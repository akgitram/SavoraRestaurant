package com.savora.restro.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.savora.restro.repository.OrderRepo;
import com.savora.restro.repository.UserRepo;
import com.savora.restro.repository.ReservationRepo;
import com.savora.restro.entity.OrderStatus;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "${app.frontend.url}")
public class AdminDashboardController {

    private final OrderRepo orderRepo;
    private final UserRepo userRepo;
    private final ReservationRepo reservationRepo;

    public AdminDashboardController(
            OrderRepo orderRepo,
            UserRepo userRepo,
            ReservationRepo reservationRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.reservationRepo = reservationRepo;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getStats() {

        BigDecimal revenue =
            orderRepo.getRevenueByStatus(OrderStatus.DELIVERED);

        return Map.of(
            "totalOrders", orderRepo.count(),
            "totalUsers", userRepo.count(),
            "totalReservations", reservationRepo.count(),
            "totalRevenue", revenue
        );
    }
}