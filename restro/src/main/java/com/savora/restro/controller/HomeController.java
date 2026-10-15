package com.savora.restro.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
public class HomeController {
     @GetMapping("/")
    public String home() {
        return "SAVORA Restaurant Backend is running!";
    } 
    
}
