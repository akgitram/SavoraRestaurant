
package com.savora.restro.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.savora.restro.entity.PasswordResetToken;
import com.savora.restro.entity.User;
import com.savora.restro.repository.PasswordResetTokenRepository;
import com.savora.restro.repository.UserRepo;

@Service
public class PasswordResetService {

    private final UserRepo userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final BrevoEmailService brevoEmailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            UserRepo userRepository,
            PasswordResetTokenRepository tokenRepository,
            BrevoEmailService brevoEmailService,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.brevoEmailService = brevoEmailService;
        this.passwordEncoder = passwordEncoder;
    }

    // Request a password reset email.
    @Transactional
    public void forgotPassword(String email) {

        userRepository.findByEmail(email.trim())
                .ifPresent(user -> {

                    // Remove previous reset tokens for this account.
                    tokenRepository.deleteByEmail(user.getEmail());

                    // Generate a secure random token.
                    byte[] randomBytes = new byte[32];
                    secureRandom.nextBytes(randomBytes);

                    String rawToken = Base64.getUrlEncoder()
                            .withoutPadding()
                            .encodeToString(randomBytes);

                    // Store only the hash of the token.
                    PasswordResetToken resetToken =
                            new PasswordResetToken();

                    resetToken.setEmail(user.getEmail());
                    resetToken.setTokenHash(hashToken(rawToken));
                    resetToken.setExpiresAt(
                            Instant.now().plusSeconds(15 * 60)
                    );
                    resetToken.setUsed(false);

                    tokenRepository.save(resetToken);

                    // Build the frontend reset link.
                    String resetLink = frontendUrl
                            + "/reset-password?token=" + rawToken;

                    // Send the reset email through Brevo.
                    sendResetEmail(user.getEmail(), resetLink);
                });
    }

    // Validate token and update the password.
    @Transactional
    public void resetPassword(
            String rawToken,
            String newPassword) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException(
                    "Invalid or expired reset link."
            );
        }

        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken =
                tokenRepository.findByTokenHash(tokenHash)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Invalid or expired reset link."
                        ));

        if (resetToken.isUsed()
                || resetToken.getExpiresAt().isBefore(Instant.now())) {

            throw new IllegalArgumentException(
                    "Invalid or expired reset link."
            );
        }

        User user = userRepository
                .findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid or expired reset link."
                ));

        // Apply the same password encoder used during signup.
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark the token as used.
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Invalidate other reset tokens for this account.
        tokenRepository.deleteByEmailExceptId(
                user.getEmail(),
                resetToken.getId()
        );
    }

    // Hash the token using SHA-256.
    private String hashToken(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hash);

        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Unable to process reset token.", ex
            );
        }
    }

    // Send the password-reset email using Brevo.
    private void sendResetEmail(
            String email,
            String resetLink) {

        try {
            brevoEmailService.sendOtpEmail(
                    email,
                    resetLink
            );

        } catch (Exception ex) {

            // Do not log the reset URL or raw token.
            throw new IllegalStateException(
                    "Unable to send password reset email.", ex
            );
        }
    }
}