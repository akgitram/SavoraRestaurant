
package com.savora.restro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.PaymentOrder;

import java.util.Optional;

@Repository 
public interface PaymentOrderRepository
        extends JpaRepository<PaymentOrder, Long> {

    Optional<PaymentOrder> findByIdAndCustomerEmail(
        Long id,
        String customerEmail
    );

    Optional<PaymentOrder> findByRazorpayOrderIdAndCustomerEmail(
        String razorpayOrderId,
        String customerEmail
    );
}
