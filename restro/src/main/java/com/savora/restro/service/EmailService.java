package com.savora.restro.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service 
public class EmailService {
    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public void sendOtp(String email,String otp){
        SimpleMailMessage message=new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("SAVORA - Email Verification");
        message.setText(
             "Your SAVORA verification code is: " + otp +
            "\n\nThis code expires in 5 minutes." +
            "\nIf you did not request this code, ignore this email."
        );
        mailSender.send(message);
    }
    
}
