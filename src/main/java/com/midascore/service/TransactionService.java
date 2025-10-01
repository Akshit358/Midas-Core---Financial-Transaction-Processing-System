package com.midascore.service;

import com.midascore.model.*;
import com.midascore.repository.TransactionRepository;
import com.midascore.repository.AccountRepository;
import com.midascore.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public Transaction createTransaction(Long customerId, TransactionType transactionType, 
                                       BigDecimal amount, String description) {
        Customer customer = customerRepository.findById(customerId)
                .filter(c -> !c.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        String transactionId = generateTransactionId();
        
        Transaction transaction = new Transaction(transactionId, transactionType, 
                                               TransactionStatus.PENDING, amount, customer);
        transaction.setDescription(description);
        
        return transactionRepository.save(transaction);
    }
    
    public Transaction transferMoney(String fromAccountNumber, String toAccountNumber, 
                                   BigDecimal amount, String description) {
        Account fromAccount = accountRepository.findByAccountNumberAndIsDeletedFalse(fromAccountNumber)
                .orElseThrow(() -> new RuntimeException("From account not found"));
        
        Account toAccount = accountRepository.findByAccountNumberAndIsDeletedFalse(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("To account not found"));
        
        if (!fromAccount.getIsActive() || !toAccount.getIsActive()) {
            throw new RuntimeException("One or both accounts are not active");
        }
        
        if (!fromAccount.hasSufficientFunds(amount)) {
            throw new RuntimeException("Insufficient funds or account is frozen");
        }
        
        String transactionId = generateTransactionId();
        
        Transaction transaction = new Transaction(transactionId, TransactionType.TRANSFER, 
                                               TransactionStatus.PROCESSING, amount, fromAccount.getCustomer());
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setDescription(description);
        
        // Perform the transfer
        fromAccount.withdraw(amount);
        toAccount.deposit(amount);
        
        transaction.markAsCompleted();
        
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        
        return transactionRepository.save(transaction);
    }
    
    public Transaction depositToAccount(String accountNumber, BigDecimal amount, String description) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getIsActive()) {
            throw new RuntimeException("Account is not active");
        }
        
        String transactionId = generateTransactionId();
        
        Transaction transaction = new Transaction(transactionId, TransactionType.DEPOSIT, 
                                               TransactionStatus.PROCESSING, amount, account.getCustomer());
        transaction.setToAccount(account);
        transaction.setDescription(description);
        
        account.deposit(amount);
        transaction.markAsCompleted();
        
        accountRepository.save(account);
        return transactionRepository.save(transaction);
    }
    
    public Transaction withdrawFromAccount(String accountNumber, BigDecimal amount, String description) {
        Account account = accountRepository.findByAccountNumberAndIsDeletedFalse(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getIsActive()) {
            throw new RuntimeException("Account is not active");
        }
        
        if (!account.hasSufficientFunds(amount)) {
            throw new RuntimeException("Insufficient funds or account is frozen");
        }
        
        String transactionId = generateTransactionId();
        
        Transaction transaction = new Transaction(transactionId, TransactionType.WITHDRAWAL, 
                                               TransactionStatus.PROCESSING, amount, account.getCustomer());
        transaction.setFromAccount(account);
        transaction.setDescription(description);
        
        account.withdraw(amount);
        transaction.markAsCompleted();
        
        accountRepository.save(account);
        return transactionRepository.save(transaction);
    }
    
    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .filter(transaction -> !transaction.getIsDeleted());
    }
    
    public Optional<Transaction> getTransactionByTransactionId(String transactionId) {
        return transactionRepository.findByTransactionIdAndIsDeletedFalse(transactionId);
    }
    
    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByCustomerIdAndIsDeletedFalseOrderByCreatedAtDesc(customerId);
    }
    
    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        List<Transaction> outgoing = transactionRepository.findByFromAccountIdAndIsDeletedFalseOrderByCreatedAtDesc(accountId);
        List<Transaction> incoming = transactionRepository.findByToAccountIdAndIsDeletedFalseOrderByCreatedAtDesc(accountId);
        
        outgoing.addAll(incoming);
        return outgoing.stream()
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .collect(Collectors.toList());
    }
    
    public List<Transaction> getTransactionsByStatus(TransactionStatus status) {
        return transactionRepository.findByStatusAndIsDeletedFalse(status);
    }
    
    public List<Transaction> getTransactionsByType(TransactionType transactionType) {
        return transactionRepository.findByTransactionTypeAndIsDeletedFalse(transactionType);
    }
    
    public void cancelTransaction(String transactionId) {
        Transaction transaction = transactionRepository.findByTransactionIdAndIsDeletedFalse(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (transaction.isCompleted()) {
            throw new RuntimeException("Cannot cancel completed transaction");
        }
        
        transaction.setStatus(TransactionStatus.CANCELLED);
        transactionRepository.save(transaction);
    }
    
    public Long getTransactionCountByStatus(TransactionStatus status) {
        return transactionRepository.countByStatusAndIsDeletedFalse(status);
    }
    
    public Long getTransactionCountByType(TransactionType transactionType) {
        return transactionRepository.countByTransactionTypeAndIsDeletedFalse(transactionType);
    }
    
    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
