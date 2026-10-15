package com.savora.restro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.dto.CreateAdminRequest;
import com.savora.restro.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAdmin(
            @RequestBody CreateAdminRequest request) {

        return ResponseEntity.ok(
            adminService.createAdmin(request)
        );
    }
}