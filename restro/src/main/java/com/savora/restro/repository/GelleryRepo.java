package com.savora.restro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.Gellery;

@Repository 
public interface GelleryRepo extends JpaRepository<Gellery,Long>{

    Optional<Gellery> findById(Long id);

    
} 