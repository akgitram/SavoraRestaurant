package com.savora.restro.service;

import  java.util.List;
import org.springframework.stereotype.Service;

import com.savora.restro.entity.Reservation;
import com.savora.restro.entity.ReservationStatus;
import com.savora.restro.repository.ReservationRepo;

@Service 
public class ReservationService {
    private ReservationRepo reservationRepo;

    public ReservationService(ReservationRepo reservationRepo) {
        this.reservationRepo = reservationRepo;
    }
    
    public Reservation savedata(Reservation reservation){
            reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepo.save(reservation);
    }

    public Reservation getResv(Long id){
        Reservation rev=reservationRepo.findById(id)
                .orElseThrow(()->new RuntimeException("this it not found"));

        return rev;
    }

    public List<Reservation> getall(){
        return  reservationRepo.findAll();
    }

    public List<Reservation> getallEamil(String email){
        List<Reservation> items=reservationRepo.findByEmail(email);
        return items;
    }



    public Reservation update(Long id,ReservationStatus status){
        Reservation rev=reservationRepo.findById(id)
                .orElseThrow(()->new RuntimeException("user not found"));
        rev.setStatus(status);

        return reservationRepo.save(rev);
    }

    public Reservation deleteRev(Long id){
        Reservation rev=reservationRepo.findById(id)
                .orElseThrow(()->new RuntimeException("this reservation not found"));
        reservationRepo.delete(rev);
        return rev;
    }
    
}
