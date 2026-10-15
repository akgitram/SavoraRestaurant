
package com.savora.restro.service;


import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.savora.restro.entity.PasswordResetToken;
import com.savora.restro.entity.User;
import com.savora.restro.repository.PasswordResetTokenRepository;
import com.savora.restro.repository.UserRepo;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class PasswordResetService {

    private final UserRepo userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String senderEmail;

    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            UserRepo userRepository,
            PasswordResetTokenRepository tokenRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
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

                    // Send the reset link by email.
                    String resetLink = frontendUrl
                            + "/reset-password?token=" + rawToken;

                    sendResetEmail(user.getEmail(), resetLink);
                });
    }

    // Validate token and update the password.
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
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

        // Make this token unusable after successful reset.
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Invalidate other reset tokens for the same account.
        tokenRepository.deleteByEmailExceptId(
                user.getEmail(),
                resetToken.getId()
        );
    }

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

    private void sendResetEmail(String email, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(email);
            helper.setSubject("SAVORA - Reset Your Password");

            String html = """
                    <div style="font-family:Arial,sans-serif;
                                max-width:600px;margin:auto;padding:25px;
                                background:#111111;color:#ffffff;">
                      <h1 style="color:#F5B942;">SAVORA</h1>
                      <h2>Reset Your Password</h2>
                      <p>We received a request to reset your password.</p>
                      <p>This link expires in 15 minutes and can only be
                         used once.</p>
                      <a href="%s"
                         style="display:inline-block;padding:12px 22px;
                                background:#F5B942;color:#111111;
                                text-decoration:none;border-radius:8px;
                                font-weight:bold;">
                        Reset Password
                      </a>
                      <p style="margin-top:25px;color:#aaaaaa;">
                        If you did not request this, you can ignore
                        this email.
                      </p>
                    </div>
                    """.formatted(resetLink);

            helper.setText(html, true);
            mailSender.send(message);

        } catch (Exception ex) {
            // Do not log the reset URL or raw token.
            throw new IllegalStateException(
                    "Unable to send password reset email.", ex
            );
        }
    }
}