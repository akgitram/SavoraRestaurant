package com.savora.restro.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.savora.restro.controller.RequiredArgsConstructor;
import com.savora.restro.dto.CreateAdminRequest;
import com.savora.restro.entity.Role;
import com.savora.restro.entity.User;
import com.savora.restro.repository.UserRepo;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    

    public AdminService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }


    public User createAdmin(CreateAdminRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email is already registered"
            );
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
            passwordEncoder.encode(request.getPassword())
        );

        // Only the backend decides this role.
        user.setRole(Role.ADMIN);

        return userRepo.save(user);
    }
}
