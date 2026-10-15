
package com.savora.restro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.savora.restro.dto.OrderStatusResponse;
import com.savora.restro.entity.Order;
import com.savora.restro.entity.OrderStatus;
import com.savora.restro.service.OrderService;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    public record StatusRequest(String status) {
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderStatusResponse> updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {

        Order updatedOrder = orderService.updateOrderStatus(id,
                OrderStatus.valueOf(request.status().trim().toUpperCase()));

        return ResponseEntity.ok(OrderStatusResponse.from(updatedOrder));
    }
}
