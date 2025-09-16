package com.midascore.controller;

import com.midascore.dto.CreateAccountRequest;
import com.midascore.model.Account;
import com.midascore.model.AccountType;
import com.midascore.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        try {
            Account account = accountService.createAccount(
                request.getCustomerId(), 
                request.getAccountType(), 
                request.getCurrency(),
                request.getInitialBalance()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {
        Optional<Account> account = accountService.getAccountById(id);
        return account.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<Account> getAccountByNumber(@PathVariable String accountNumber) {
        Optional<Account> account = accountService.getAccountByNumber(accountNumber);
        return account.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Account>> getAccountsByCustomer(@PathVariable Long customerId) {
        List<Account> accounts = accountService.getAccountsByCustomerId(customerId);
        return ResponseEntity.ok(accounts);
    }
    
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts(@RequestParam(required = false) AccountType type) {
        List<Account> accounts;
        if (type != null) {
            accounts = accountService.getAccountsByType(type);
        } else {
            accounts = accountService.getAllActiveAccounts();
        }
        return ResponseEntity.ok(accounts);
    }
    
    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable String accountNumber, 
                                         @RequestParam BigDecimal amount,
                                         @RequestParam(required = false) String description) {
        try {
            Account account = accountService.deposit(accountNumber, amount);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable String accountNumber, 
                                          @RequestParam BigDecimal amount,
                                          @RequestParam(required = false) String description) {
        try {
            Account account = accountService.withdraw(accountNumber, amount);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{accountNumber}/freeze")
    public ResponseEntity<Void> freezeAccount(@PathVariable String accountNumber) {
        try {
            accountService.freezeAccount(accountNumber);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{accountNumber}/unfreeze")
    public ResponseEntity<Void> unfreezeAccount(@PathVariable String accountNumber) {
        try {
            accountService.unfreezeAccount(accountNumber);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{accountNumber}/deactivate")
    public ResponseEntity<Void> deactivateAccount(@PathVariable String accountNumber) {
        try {
            accountService.deactivateAccount(accountNumber);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/customer/{customerId}/balance")
    public ResponseEntity<BigDecimal> getTotalBalance(@PathVariable Long customerId) {
        try {
            BigDecimal balance = accountService.getTotalBalanceByCustomerId(customerId);
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats/count")
    public ResponseEntity<Long> getAccountCount(@RequestParam(required = false) AccountType type) {
        Long count;
        if (type != null) {
            count = accountService.getAccountCountByType(type);
        } else {
            count = accountService.getActiveAccountCount();
        }
        return ResponseEntity.ok(count);
    }
}
