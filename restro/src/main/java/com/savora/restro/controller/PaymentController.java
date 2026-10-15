
package com.savora.restro.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.savora.restro.dto.CreatePaymentRequest;
import com.savora.restro.dto.CreatePaymentResponse;
import com.savora.restro.dto.VerifyPaymentRequest;
import com.savora.restro.service.PaymentService;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<CreatePaymentResponse> createOrder(
            @RequestBody CreatePaymentRequest request,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .build();
        }

        CreatePaymentResponse response =
            paymentService.createPaymentOrder(
                request, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .build();
        }

        paymentService.verifyPayment(
            request, authentication.getName());

        return ResponseEntity.ok(Map.of(
            "message", "Payment verified successfully",
            "paymentStatus", "PAID"
        ));
    }
}
