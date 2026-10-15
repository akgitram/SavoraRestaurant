package com.savora.restro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.MenuItem;
import java.util.List;


@Repository 
public interface  MenuItemRepo extends JpaRepository<MenuItem,Long>{
    Optional<MenuItem> findById(Long id);

}
