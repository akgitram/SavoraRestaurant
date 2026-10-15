package com.savora.restro.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.entity.Reservation;
import com.savora.restro.entity.ReservationStatus;
import com.savora.restro.service.ReservationService;
import org.springframework.web.bind.annotation.PutMapping;


@RestController 
@RequestMapping("/api/user")
public class ReservationController {
    private ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
    @PostMapping
    public ResponseEntity<?> savedata(@RequestBody Reservation reservation){
        return ResponseEntity.ok(reservationService.savedata(reservation));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getdata(@PathVariable  Long id){
       return  ResponseEntity.ok(reservationService.getResv(id));
    }
    @GetMapping
    public ResponseEntity<List<?>> getall(){
        return ResponseEntity.ok(reservationService.getall());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable  Long id){
        return ResponseEntity.ok(reservationService.deleteRev(id));

    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> update(@PathVariable Long id,@RequestParam ReservationStatus status){
        return  ResponseEntity.ok(reservationService.update(id, status));
    }


    @GetMapping("/my")
    public ResponseEntity<List<Reservation>> getallbyEmail(Authentication authentication){
        String email=authentication.getName();
        
        return ResponseEntity.ok(reservationService.getallEamil(email));
    }
}
