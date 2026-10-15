package com.savora.restro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.Contect;

@Repository 
public interface  ContectRepo extends JpaRepository<Contect,Long>{
    
}
