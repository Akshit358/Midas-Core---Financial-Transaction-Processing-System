package com.midascore.repository;

import com.midascore.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmailAndIsDeletedFalse(String email);
    
    List<Customer> findByIsActiveTrueAndIsDeletedFalse();
    
    List<Customer> findByIsVerifiedTrueAndIsDeletedFalse();
    
    @Query("SELECT c FROM Customer c WHERE c.firstName LIKE %:name% OR c.lastName LIKE %:name% AND c.isDeleted = false")
    List<Customer> findByNameContainingIgnoreCaseAndIsDeletedFalse(@Param("name") String name);
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.isActive = true AND c.isDeleted = false")
    Long countActiveCustomers();
    
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.isVerified = true AND c.isDeleted = false")
    Long countVerifiedCustomers();
}
