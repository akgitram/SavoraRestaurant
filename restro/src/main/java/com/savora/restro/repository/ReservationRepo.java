package com.savora.restro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.Reservation;
import java.util.List;
import java.util.Optional;


@Repository 
public interface  ReservationRepo extends JpaRepository<Reservation,Long>{

  Optional<Reservation> findById(Long id);
  List<Reservation> findByEmail(String email);
}
