package com.savora.restro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.OrderItem;

@Repository 
public interface  OrderItemRepo extends JpaRepository<OrderItem,Long>{
    
    
}
