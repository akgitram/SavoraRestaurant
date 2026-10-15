
package com.savora.restro.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.savora.restro.dto.OrderItemRequest;
import com.savora.restro.dto.OrderRequest;
import com.savora.restro.entity.MenuItem;
import com.savora.restro.entity.Order;
import com.savora.restro.entity.OrderItem;
import com.savora.restro.entity.OrderStatus;
import com.savora.restro.entity.User;
import com.savora.restro.repository.MenuItemRepo;
import com.savora.restro.repository.OrderRepo;
import com.savora.restro.repository.UserRepo;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final MenuItemRepo menuItemRepo;
    private final UserRepo userRepo;

    public OrderService(
            OrderRepo orderRepo,
            MenuItemRepo menuItemRepo,
            UserRepo userRepo) {
        this.orderRepo = orderRepo;
        this.menuItemRepo = menuItemRepo;
        this.userRepo = userRepo;
    }

    // CUSTOMER: Create a new order
    public Order createOrder(String email, OrderRequest request) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        Order order = new Order();

        order.setAddress(request.getDeliveryAddress());
        order.setUser(user);
        order.setPhone(request.getPhone());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemRequest : request.getItems()) {

            MenuItem menuItem = menuItemRepo
                    .findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Menu item not found"));

            if (!menuItem.isAvailable()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Menu item is unavailable: " + menuItem.getName());
            }

            int quantity = itemRequest.getQuantity();

            if (quantity <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Quantity must be greater than zero");
            }

            double price = menuItem.getPrice();
            double subtotal = price * quantity;

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(price);
            orderItem.setSubtotal(subtotal);
            orderItem.setOrder(order);

            orderItems.add(orderItem);
            total += subtotal;
        }

        order.setTotalamount(total);
        order.setOrderItems(orderItems);

        return orderRepo.save(order);
    }

    // CUSTOMER: View their own orders
    public List<Order> getMyOrders(String email) {
        return orderRepo.findByUserEmail(email);
    }

    // CUSTOMER: Cancel their own order
    @Transactional
    public Order orderdeleted(String email, Long id) {

        Order order = orderRepo.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() != OrderStatus.PENDING
                && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This order can no longer be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);

        return orderRepo.save(order);
    }

    // ADMIN: View all orders
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepo.findAllWithDetails();
    }

    // ADMIN: Update order status
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() == OrderStatus.CANCELLED
                || order.getStatus() == OrderStatus.DELIVERED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This order can no longer be updated");
        }

        // Start the 30-minute delivery estimate when confirmed.
        if (newStatus == OrderStatus.CONFIRMED
                && order.getStatus() != OrderStatus.CONFIRMED) {

            LocalDateTime confirmedTime = LocalDateTime.now();

            order.setConfirmedAt(confirmedTime);
            order.setEstimatedDeliveryTime(
                    confirmedTime.plusMinutes(30));
        }

        order.setStatus(newStatus);

        return orderRepo.save(order);
    }
}