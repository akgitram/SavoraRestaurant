
package com.savora.restro.dto;

public record CreatePaymentResponse(
    String keyId,
    Integer amount,
    String currency,
    String razorpayOrderId,
    Long restaurantOrderId
) {}
