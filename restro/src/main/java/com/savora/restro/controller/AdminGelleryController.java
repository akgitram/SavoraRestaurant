package com.savora.restro.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.entity.Gellery;
import com.savora.restro.service.GelleryService;

@RestController
@RequestMapping("/admin/gellery")
public class AdminGelleryController {
    
    private GelleryService gelleryService;
    

    public AdminGelleryController(GelleryService gelleryService) {
        this.gelleryService = gelleryService;
    }

    @PostMapping 
    public ResponseEntity<?> savegel(@RequestBody  Gellery gellery){
        return ResponseEntity.ok(gelleryService.save(gellery));
    }

    @GetMapping
    public ResponseEntity<List<Gellery>> getALL(){
        List<Gellery>  item=gelleryService.getAll();
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id){
        return ResponseEntity.ok(gelleryService.deleteImage(id));

    }
    
}
