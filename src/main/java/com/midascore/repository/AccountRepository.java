package com.midascore.repository;

import com.midascore.model.Account;
import com.midascore.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    Optional<Account> findByAccountNumberAndIsDeletedFalse(String accountNumber);
    
    List<Account> findByCustomerIdAndIsDeletedFalse(Long customerId);
    
    List<Account> findByAccountTypeAndIsActiveTrueAndIsDeletedFalse(AccountType accountType);
    
    List<Account> findByIsActiveTrueAndIsDeletedFalse();
    
    List<Account> findByIsFrozenTrueAndIsDeletedFalse();
    
    @Query("SELECT a FROM Account a WHERE a.balance >= :minBalance AND a.isActive = true AND a.isDeleted = false")
    List<Account> findByBalanceGreaterThanEqualAndIsActiveTrueAndIsDeletedFalse(@Param("minBalance") BigDecimal minBalance);
    
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.customer.id = :customerId AND a.isActive = true AND a.isDeleted = false")
    BigDecimal getTotalBalanceByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT COUNT(a) FROM Account a WHERE a.isActive = true AND a.isDeleted = false")
    Long countActiveAccounts();
    
    @Query("SELECT COUNT(a) FROM Account a WHERE a.accountType = :accountType AND a.isActive = true AND a.isDeleted = false")
    Long countByAccountTypeAndIsActiveTrueAndIsDeletedFalse(@Param("accountType") AccountType accountType);
}
