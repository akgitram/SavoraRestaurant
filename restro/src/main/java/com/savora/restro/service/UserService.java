package com.savora.restro.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.savora.restro.dto.LoginDto;
import com.savora.restro.dto.LoginResponse;
import com.savora.restro.dto.SignupDto;
import com.savora.restro.entity.PendingSignup;
import com.savora.restro.entity.Role;
import com.savora.restro.entity.User;
import com.savora.restro.repository.PendingSignupRepo;
import com.savora.restro.repository.UserRepo;
import com.savora.restro.security.JwtService;

@Service
public class UserService {
    private UserRepo userRepo;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private SecureRandom secureRandom = new SecureRandom();
    private PendingSignupRepo pendingSignupRepo;
    private BrevoEmailService emailService;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder, JwtService jwtService,PendingSignupRepo pendingSignupRepo,BrevoEmailService emailService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.pendingSignupRepo=pendingSignupRepo;
        this.emailService=emailService;
    }

    private String genrateOtp() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));

    }

    public String signupUser(SignupDto dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("User already exists");
        }

        PendingSignup pending = pendingSignupRepo.findByEmail(email).orElse(new PendingSignup());

        String otp = genrateOtp();

        pending.setName(dto.getName().trim());
        pending.setEmail(email);
        pending.setPassword(passwordEncoder.encode(dto.getPassword()));
        pending.setOtp(otp);
        pending.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        pendingSignupRepo.save(pending);

        // Send OTP to the user's email
        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            pendingSignupRepo.delete(pending);
            throw new RuntimeException("Failed to send OTP. Please try again."+e);
        }

        return "OTP sent successfully. Verify your email to complete signup.";
    }

    public String verifyOtp(String email, String otp) {

        email = email.trim().toLowerCase();

        PendingSignup pending = pendingSignupRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No pending signup found. Please sign up again."));

        if (!pending.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check OTP expiry
        if (pending.getOtpExpiry().isBefore(LocalDateTime.now())) {
            pendingSignupRepo.delete(pending);
            throw new RuntimeException("OTP has expired. Please sign up again.");
        }

        // Check again in case the email is already registered
        if (userRepo.existsByEmail(email)) {
            pendingSignupRepo.delete(pending);
            throw new RuntimeException("User already exists");
        }

        // Create the actual user only after successful verification
        User user = new User();
        user.setName(pending.getName());
        user.setEmail(pending.getEmail());
        user.setPassword(pending.getPassword());
        user.setRole(Role.USER);
        user.setEmailVerificaton(true);

        userRepo.save(user);

        // Remove temporary signup data so the OTP cannot be reused
        pendingSignupRepo.delete(pending);

        return "Email verified successfully. Account created.";
    }

    public LoginResponse login(LoginDto dto) {
        User user = userRepo.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("not found"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username and passwrod");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }

    // @Bean
    // CommandLineRunner createAdmin(UserRepo userRepository, PasswordEncoder
    // passwordEncoder) {
    // return args -> {

    // if (!userRepository.existsByEmail("admin@savora.com")) {

    // User admin = new User();

    // admin.setName("Admin");
    // admin.setEmail("admin@gmail.com");
    // admin.setPassword(passwordEncoder.encode("Admin@123"));
    // admin.setRole(Role.ADMIN);

    // userRepository.save(admin);
    // }
    // };
    // }

}
