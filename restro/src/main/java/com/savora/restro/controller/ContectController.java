package com.savora.restro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.entity.Contect;
import com.savora.restro.service.ContectService;

@RestController 
@RequestMapping("/api/contect")
public class ContectController {
    private ContectService contectService;

    public ContectController(ContectService contectService) {
        this.contectService = contectService;
    }

    @PostMapping
    public ResponseEntity<?> saveContect(@RequestBody  Contect contect){
        return ResponseEntity.ok(contectService.sendContect(contect));
    }
    
    
}
