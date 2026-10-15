package com.savora.restro.repository;

import com.savora.restro.entity.PendingSignup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository 
public interface PendingSignupRepo
        extends JpaRepository<PendingSignup, Long> {

    Optional<PendingSignup> findByEmail(String email);
}