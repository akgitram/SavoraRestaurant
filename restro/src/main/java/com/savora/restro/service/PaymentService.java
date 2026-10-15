
package com.savora.restro.service;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.savora.restro.dto.CreatePaymentRequest;
import com.savora.restro.dto.CreatePaymentResponse;
import com.savora.restro.dto.VerifyPaymentRequest;
import com.savora.restro.entity.PaymentOrder;
import com.savora.restro.entity.PaymentOrderItem;
import com.savora.restro.repository.MenuItemRepo;
import com.savora.restro.repository.PaymentOrderRepository;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Set;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentOrderRepository orderRepository;
    private final MenuItemRepo menuItemRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentService(RazorpayClient razorpayClient, PaymentOrderRepository orderRepository,
            MenuItemRepo menuItemRepository) {
        this.razorpayClient = razorpayClient;
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Transactional
    public CreatePaymentResponse createPaymentOrder(CreatePaymentRequest request, String customerEmail) {

        if (customerEmail == null || customerEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in");
        }

        if (request == null || request.phone() == null || request.phone().isBlank() || request.deliveryAddress() == null
                || request.deliveryAddress().isBlank() || request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid checkout details");
        }

        if (!"ONLINE".equalsIgnoreCase(request.paymentMethod())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This endpoint is for online payments only");
        }

        PaymentOrder restaurantOrder = new PaymentOrder();
        restaurantOrder.setCustomerEmail(customerEmail);
        restaurantOrder.setPhone(request.phone().trim());
        restaurantOrder.setDeliveryAddress(request.deliveryAddress().trim());

        BigDecimal total = BigDecimal.ZERO;
        Set<Long> seenIds = new HashSet<>();

        for (CreatePaymentRequest.ItemRequest requestedItem : request.items()) {

            if (requestedItem == null || requestedItem.menuItemId() == null || requestedItem.quantity() == null
                    || requestedItem.quantity() < 1 || requestedItem.quantity() > 100) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid cart item");
            }

            if (!seenIds.add(requestedItem.menuItemId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate menu items are not allowed");
            }

            var menuItem = menuItemRepository.findById(requestedItem.menuItemId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Menu item not found: " + requestedItem.menuItemId()));

            // Use the database price, never the React price.
            BigDecimal price = BigDecimal.valueOf(menuItem.getPrice());
            if (price.signum() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu item price");
            }

            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(requestedItem.quantity()));

            total = total.add(lineTotal);

            PaymentOrderItem item = new PaymentOrderItem();
            item.setMenuItemId(menuItem.getId());
            item.setItemName(menuItem.getName());
            item.setQuantity(requestedItem.quantity());
            item.setUnitPrice(price);

            restaurantOrder.addItem(item);
        }

        total = total.setScale(2, RoundingMode.UNNECESSARY);

        if (total.signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order amount must be greater than zero");
        }

        // Razorpay accepts amounts in paise.
        long amountInPaise;
        try {
            amountInPaise = total.movePointRight(2).longValueExact();

            // This response uses Integer for the React checkout.
            Math.toIntExact(amountInPaise);
        } catch (ArithmeticException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order amount is too large");
        }

        restaurantOrder.setTotalAmount(total);
        restaurantOrder.setOrderStatus("PENDING");
        restaurantOrder.setPaymentStatus("PENDING");

        // Save our own order first to obtain its database ID.
        PaymentOrder savedOrder = orderRepository.saveAndFlush(restaurantOrder);

        try {
            JSONObject razorpayRequest = new JSONObject();
            razorpayRequest.put("amount", amountInPaise);
            razorpayRequest.put("currency", "INR");
            razorpayRequest.put("receipt", "savora_" + savedOrder.getId());

            Order razorpayOrder = razorpayClient.orders.create(razorpayRequest);

            String razorpayOrderId = razorpayOrder.get("id");

            savedOrder.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(savedOrder);

            return new CreatePaymentResponse(keyId, Math.toIntExact(amountInPaise), "INR", razorpayOrderId,
                    savedOrder.getId());

        } catch (RazorpayException | ArithmeticException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Could not create payment order. Please try again.");
        }
    }

    @Transactional
    public void verifyPayment(VerifyPaymentRequest request, String customerEmail) {

        if (request == null || request.restaurantOrderId() == null || isBlank(request.razorpay_order_id())
                || isBlank(request.razorpay_payment_id()) || isBlank(request.razorpay_signature())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing payment verification details");
        }

        PaymentOrder order = orderRepository.findByIdAndCustomerEmail(request.restaurantOrderId(), customerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!request.razorpay_order_id().equals(order.getRazorpayOrderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment order does not match");
        }

        if ("PAID".equals(order.getPaymentStatus())) {
            if (request.razorpay_payment_id().equals(order.getRazorpayPaymentId())) {
                return; // Safe retry of the same verification.
            }

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Order has already been paid");
        }

        if (!"PENDING".equals(order.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Order is not awaiting payment");
        }

        try {
            JSONObject signatureData = new JSONObject();
            signatureData.put("razorpay_order_id", request.razorpay_order_id());
            signatureData.put("razorpay_payment_id", request.razorpay_payment_id());
            signatureData.put("razorpay_signature", request.razorpay_signature());

            boolean signatureValid = Utils.verifyPaymentSignature(signatureData, keySecret);

            if (!signatureValid) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment signature");
            }

            // A valid signature alone should not be treated as proof
            // that funds are captured. Check the payment with Razorpay.
            Payment payment = razorpayClient.payments.fetch(request.razorpay_payment_id());

            if (!request.razorpay_order_id().equals(payment.get("order_id"))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment belongs to a different order");
            }

            if (!"captured".equalsIgnoreCase(payment.get("status").toString())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment is not captured yet");
            }

            long expectedPaise = order.getTotalAmount().movePointRight(2).longValueExact();

            long actualPaise = Long.parseLong(payment.get("amount").toString());

            if (actualPaise != expectedPaise || !"INR".equalsIgnoreCase(payment.get("currency").toString())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment amount or currency mismatch");
            }

            order.setRazorpayPaymentId(request.razorpay_payment_id());
            order.setPaymentStatus("PAID");
            order.setOrderStatus("CONFIRMED");

            orderRepository.save(order);

        } catch (RazorpayException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to verify payment with gateway");
        }
    }

    private String getKeySecret() {
        // The secret is never returned to the frontend.
        return System.getenv("RAZORPAY_KEY_SECRET");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
