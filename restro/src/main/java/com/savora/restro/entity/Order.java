package com.savora.restro.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity 
@Table(name = "Orders")
public class Order {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    @JsonIgnore 
    private User user;
    private double totalamount;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @Column(nullable = false)
    private LocalDateTime orderDate;
    private String address;
    private String paymentMethod;
    private String phone;
    private LocalDateTime confirmedAt;
    private LocalDateTime estimatedDeliveryTime;
    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JsonIgnoreProperties(("Order"))
    private List<OrderItem> orderItems=new ArrayList<>(); 

    public Order(){

    }

    

    public Order(Long id,User user, double totalamount, OrderStatus status, LocalDateTime orderDate, String address,
            String paymentMethod, String phone, LocalDateTime confirmedAt, LocalDateTime estimatedDeliveryTime,
            List<OrderItem> orderItems) {
        this.id=id;
        this.user = user;
        this.totalamount = totalamount;
        this.status = status;
        this.orderDate = orderDate;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.phone = phone;
        this.confirmedAt = confirmedAt;
        this.estimatedDeliveryTime = estimatedDeliveryTime;
        this.orderItems = orderItems;
    }
    
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getTotalamount() {
        return totalamount;
    }

    public void setTotalamount(double totalamount) {
        this.totalamount = totalamount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }



    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }



    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }



    public LocalDateTime getEstimatedDeliveryTime() {
        return estimatedDeliveryTime;
    }



    public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) {
        this.estimatedDeliveryTime = estimatedDeliveryTime;
    }



    public Long getId() {
        return id;
    }



    public void setId(Long id) {
        this.id = id;
    }
    

    
    
    
}
