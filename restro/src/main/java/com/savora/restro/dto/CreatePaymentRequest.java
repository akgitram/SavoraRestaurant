
package com.savora.restro.dto;

import java.util.List;

public record CreatePaymentRequest(
    String phone,
    String deliveryAddress,
    String paymentMethod,
    List<ItemRequest> items
) {
    public record ItemRequest(
        Long menuItemId,
        Integer quantity
    ) {}
}
