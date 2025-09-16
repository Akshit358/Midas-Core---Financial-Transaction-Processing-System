package com.midascore.service;

import com.midascore.model.Account;
import com.midascore.model.AccountType;
import com.midascore.model.Customer;
import com.midascore.repository.AccountRepository;
import com.midascore.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public Account createAccount(Long customerId, AccountType accountType, String currency, BigDecimal initialBalance) {
        Customer customer = customerRepository.findById(customerId)
                .filter(c -> !c.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        String accountNumber = generateAccountNumber();
        
        Account account = new Account(accountNumber, accountType, customer);
        account.setCurrency(currency);
        account.setBalance(initialBalance != null ? initialBalance : BigDecimal.ZERO);
        
        return accountRepository.save(account);
    }
    
    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id)
                .filter(account -> !account.getIsDeleted());
    }
    
    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber);
    }
    
    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerIdAndIsDeletedFalse(customerId);
    }
    
    public List<Account> getAccountsByType(AccountType accountType) {
        return accountRepository.findByAccountTypeAndIsActiveTrueAndIsDeletedFalse(accountType);
    }
    
    public List<Account> getAllActiveAccounts() {
        return accountRepository.findByIsActiveTrueAndIsDeletedFalse();
    }
    
    public Account deposit(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getIsActive()) {
            throw new RuntimeException("Account is not active");
        }
        
        account.deposit(amount);
        return accountRepository.save(account);
    }
    
    public Account withdraw(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getIsActive()) {
            throw new RuntimeException("Account is not active");
        }
        
        if (!account.withdraw(amount)) {
            throw new RuntimeException("Insufficient funds or account is frozen");
        }
        
        return accountRepository.save(account);
    }
    
    public void freezeAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setIsFrozen(true);
        accountRepository.save(account);
    }
    
    public void unfreezeAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setIsFrozen(false);
        accountRepository.save(account);
    }
    
    public void deactivateAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setIsActive(false);
        accountRepository.save(account);
    }
    
    public BigDecimal getTotalBalanceByCustomerId(Long customerId) {
        return accountRepository.getTotalBalanceByCustomerId(customerId);
    }
    
    public Long getActiveAccountCount() {
        return accountRepository.countActiveAccounts();
    }
    
    public Long getAccountCountByType(AccountType accountType) {
        return accountRepository.countByAccountTypeAndIsActiveTrueAndIsDeletedFalse(accountType);
    }
    
    private String generateAccountNumber() {
        return "ACC" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
