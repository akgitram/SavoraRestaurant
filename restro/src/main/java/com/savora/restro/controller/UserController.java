package com.savora.restro.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.dto.LoginDto;
import com.savora.restro.dto.LoginResponse;
import com.savora.restro.dto.SignupDto;
import com.savora.restro.dto.VerifyOtpDto;
import com.savora.restro.entity.User;
import com.savora.restro.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/auth/user")
public class UserController {
    protected UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignupDto dto) {
        String userRes = userService.signupUser(dto);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userRes);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpDto dto) {

        return ResponseEntity.ok(userService.verifyOtp(dto.getEmail(), dto.getOtp()));
    }
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        LoginResponse userRes = userService.login(dto);
        return ResponseEntity.ok(userRes);

    }

    @GetMapping("/me")
    public String me() {
        return "welcome to my page";
    }

}
