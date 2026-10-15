package com.savora.restro.dto;

import java.time.LocalDateTime;

import com.savora.restro.entity.Order;

public record OrderStatusResponse(
        Long id,
        String status,
        LocalDateTime confirmedAt,
        LocalDateTime estimatedDeliveryTime
) {
    public static OrderStatusResponse from(Order order) {
        return new OrderStatusResponse(
                order.getId(),
                order.getStatus().name(),
                order.getConfirmedAt(),
                order.getEstimatedDeliveryTime()
        );
    }
}