package com.savora.restro.controller;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.entity.User;
import com.savora.restro.repository.UserRepo;

@RestController 
@RequestMapping("api/admin/users")
public class AdminUserController {
    private UserRepo userRepo;

    public AdminUserController(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    
    @GetMapping 
    public ResponseEntity<List<User>> getAll(){
        List<User> item=userRepo.findAll();
        return ResponseEntity.ok(item);
    }
    
}
