
package com.savora.restro.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payment_orders")
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, length = 1000)
    private String deliveryAddress;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String paymentMethod = "ONLINE";

    @Column(nullable = false)
    private String orderStatus = "PENDING";

    @Column(nullable = false)
    private String paymentStatus = "PENDING";

    @Column(unique = true)
    private String razorpayOrderId;

    private String razorpayPaymentId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<PaymentOrderItem> items = new ArrayList<>();

    public void addItem(PaymentOrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public Long getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String value) {
        customerEmail = value;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String value) {
        phone = value;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String value) {
        deliveryAddress = value;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal value) {
        totalAmount = value;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String value) {
        orderStatus = value;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String value) {
        paymentStatus = value;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String value) {
        razorpayOrderId = value;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String value) {
        razorpayPaymentId = value;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<PaymentOrderItem> getItems() {
        return items;
    }
}
