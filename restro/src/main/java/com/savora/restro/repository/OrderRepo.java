package com.savora.restro.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.Order;
import com.savora.restro.entity.OrderStatus;
import com.savora.restro.entity.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Repository 
public interface  OrderRepo extends JpaRepository<Order,Long>{
    @EntityGraph(attributePaths = {
    "user",
    "orderItems",
    "orderItems.menuItem"
})
List<Order> findByUserEmail(String email);

    @EntityGraph(attributePaths = {"orderItems", "orderItems.menuItem"})
    List<Order> findByUser(User user);

 @EntityGraph(attributePaths = {"orderItems", "orderItems.menuItem"})
Optional<Order> findByIdAndUserEmail(Long id, String email);

@EntityGraph(attributePaths = {"orderItems", "orderItems.menuItem"})
Optional<Order> findWithItemsById(Long id);

@EntityGraph(attributePaths = {
    "user",
    "orderItems",
    "orderItems.menuItem"
})
@Query("SELECT DISTINCT o FROM Order o")
List<Order> findAllWithDetails();

long count();

@Query("SELECT COALESCE(SUM(o.totalamount), 0) FROM Order o")
BigDecimal getTotalRevenue();

@Query("""
    SELECT COALESCE(SUM(o.totalamount), 0)
    FROM Order o
    WHERE o.status = :status
""")
BigDecimal getRevenueByStatus(@Param("status") OrderStatus status);



}
