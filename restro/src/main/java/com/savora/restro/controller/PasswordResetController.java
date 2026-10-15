
package com.savora.restro.controller;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.savora.restro.service.PasswordResetService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    public record ForgotPasswordRequest(
            @NotBlank @Email String email
    ) {}

    public record ResetPasswordRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8, max = 72) String newPassword
    ) {}

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        try {
            passwordResetService.forgotPassword(
                    request.email().trim()
            );

            // Same response whether or not the email exists.
            return ResponseEntity.ok(Map.of(
                    "message",
                    "If an account exists for this email, "
                    + "password reset instructions will be sent."
            ));

        } catch (Exception ex) {
            // Log server-side details securely in production.
            return ResponseEntity.internalServerError().body(Map.of(
                    "message",
                    "Unable to process your request. Please try again."
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        try {
            passwordResetService.resetPassword(
                    request.token(),
                    request.newPassword()
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Password reset successfully."
            ));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", ex.getMessage()
            ));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", "Unable to reset password. Please try again."
            ));
        }
    }
}