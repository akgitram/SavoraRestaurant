
package com.savora.restro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.savora.restro.entity.PasswordResetToken;

import java.util.Optional;
@Repository 
public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    void deleteByEmail(String email);

    @Modifying
    @Query("""
        delete from PasswordResetToken t
        where t.email = :email and t.id <> :tokenId
        """)
    void deleteByEmailExceptId(
            @Param("email") String email,
            @Param("tokenId") Long tokenId
    );
}