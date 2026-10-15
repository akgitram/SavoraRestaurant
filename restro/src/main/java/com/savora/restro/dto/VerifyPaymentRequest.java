
package com.savora.restro.dto;

public record VerifyPaymentRequest(
    Long restaurantOrderId,
    String razorpay_order_id,
    String razorpay_payment_id,
    String razorpay_signature
) {}
