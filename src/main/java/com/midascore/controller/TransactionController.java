package com.midascore.controller;

import com.midascore.dto.TransactionRequest;
import com.midascore.dto.TransferRequest;
import com.midascore.model.Transaction;
import com.midascore.model.TransactionStatus;
import com.midascore.model.TransactionType;
import com.midascore.service.TransactionService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@Valid @RequestBody TransferRequest request) {
        try {
            Transaction transaction = transactionService.transferMoney(
                request.getFromAccountNumber(),
                request.getToAccountNumber(),
                request.getAmount(),
                request.getDescription()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Transfer failed");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@Valid @RequestBody TransactionRequest request) {
        try {
            Transaction transaction = transactionService.depositToAccount(
                request.getAccountNumber(), 
                request.getAmount(), 
                request.getDescription()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Deposit failed");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@Valid @RequestBody TransactionRequest request) {
        try {
            Transaction transaction = transactionService.withdrawFromAccount(
                request.getAccountNumber(), 
                request.getAmount(), 
                request.getDescription()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Withdrawal failed");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/transaction-id/{transactionId}")
    public ResponseEntity<Transaction> getTransactionByTransactionId(@PathVariable String transactionId) {
        Optional<Transaction> transaction = transactionService.getTransactionByTransactionId(transactionId);
        return transaction.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCustomer(@PathVariable Long customerId) {
        List<Transaction> transactions = transactionService.getTransactionsByCustomerId(customerId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable Long accountId) {
        List<Transaction> transactions = transactionService.getTransactionsByAccountId(accountId);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(@RequestParam(required = false) TransactionStatus status,
                                                               @RequestParam(required = false) TransactionType type) {
        List<Transaction> transactions;
        if (status != null && type != null) {
            transactions = transactionService.getTransactionsByStatus(status);
            transactions = transactions.stream()
                    .filter(t -> t.getTransactionType() == type)
                    .collect(Collectors.toList());
        } else if (status != null) {
            transactions = transactionService.getTransactionsByStatus(status);
        } else if (type != null) {
            transactions = transactionService.getTransactionsByType(type);
        } else {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(transactions);
    }
    
    @PostMapping("/{transactionId}/cancel")
    public ResponseEntity<?> cancelTransaction(@PathVariable String transactionId) {
        try {
            transactionService.cancelTransaction(transactionId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Transaction cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Cancel failed");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/stats/count")
    public ResponseEntity<Long> getTransactionCount(@RequestParam(required = false) TransactionStatus status,
                                                   @RequestParam(required = false) TransactionType type) {
        Long count;
        if (status != null) {
            count = transactionService.getTransactionCountByStatus(status);
        } else if (type != null) {
            count = transactionService.getTransactionCountByType(type);
        } else {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(count);
    }
}
