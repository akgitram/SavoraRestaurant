
package com.savora.restro.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BrevoEmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    @Value("${BREVO_SENDER_EMAIL}")
    private String senderEmail;

    @Value("${brevo.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpEmail(String recipient, String otp) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("api-key", apiKey);

        Map<String, Object> body = Map.of(
            "sender", Map.of(
                "name", "Savora",
                "email", senderEmail
            ),
            "to", List.of(
                Map.of("email", recipient)
            ),
            "subject", "Your Savora Verification Code",
            "textContent",
                "Your Savora verification code is " + otp
                + ". Do not share this code with anyone."
        );

        HttpEntity<Map<String, Object>> request =
            new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
            apiUrl,
            request,
            String.class
        );
    }
}
