package com.midascore.repository;

import com.midascore.model.Transaction;
import com.midascore.model.TransactionStatus;
import com.midascore.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionIdAndIsDeletedFalse(String transactionId);
    
    List<Transaction> findByCustomerIdAndIsDeletedFalseOrderByCreatedAtDesc(Long customerId);
    
    List<Transaction> findByFromAccountIdAndIsDeletedFalseOrderByCreatedAtDesc(Long fromAccountId);
    
    List<Transaction> findByToAccountIdAndIsDeletedFalseOrderByCreatedAtDesc(Long toAccountId);
    
    List<Transaction> findByStatusAndIsDeletedFalse(TransactionStatus status);
    
    List<Transaction> findByTransactionTypeAndIsDeletedFalse(TransactionType transactionType);
    
    List<Transaction> findByStatusAndTransactionTypeAndIsDeletedFalse(TransactionStatus status, TransactionType transactionType);
    
    @Query("SELECT t FROM Transaction t WHERE t.customer.id = :customerId AND t.createdAt BETWEEN :startDate AND :endDate AND t.isDeleted = false ORDER BY t.createdAt DESC")
    List<Transaction> findByCustomerIdAndCreatedAtBetweenAndIsDeletedFalse(
        @Param("customerId") Long customerId, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.customer.id = :customerId AND t.status = :status AND t.isDeleted = false")
    BigDecimal getTotalAmountByCustomerIdAndStatus(@Param("customerId") Long customerId, @Param("status") TransactionStatus status);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status AND t.isDeleted = false")
    Long countByStatusAndIsDeletedFalse(@Param("status") TransactionStatus status);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionType = :transactionType AND t.isDeleted = false")
    Long countByTransactionTypeAndIsDeletedFalse(@Param("transactionType") TransactionType transactionType);
}
