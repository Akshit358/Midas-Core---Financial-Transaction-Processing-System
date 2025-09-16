package com.midascore.service;

import com.midascore.model.AuditLogType;
import com.midascore.model.TransactionStatus;
import com.midascore.model.TransactionType;
import com.midascore.model.UserRole;
import com.midascore.repository.*;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MetricsService {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    private final AtomicLong activeConnections = new AtomicLong(0);
    private Counter transactionCounter;
    private Counter loginCounter;
    private Counter errorCounter;
    
    @PostConstruct
    public void initMetrics() {
        // Custom counters
        transactionCounter = Counter.builder("midas.transactions.total")
                .description("Total number of transactions")
                .register(meterRegistry);
        
        loginCounter = Counter.builder("midas.logins.total")
                .description("Total number of logins")
                .register(meterRegistry);
        
        errorCounter = Counter.builder("midas.errors.total")
                .description("Total number of errors")
                .register(meterRegistry);
    }
    
    public void incrementTransactionCount() {
        transactionCounter.increment();
    }
    
    public void incrementLoginCount() {
        loginCounter.increment();
    }
    
    public void incrementErrorCount() {
        errorCounter.increment();
    }
    
    public void incrementActiveConnections() {
        activeConnections.incrementAndGet();
    }
    
    public void decrementActiveConnections() {
        activeConnections.decrementAndGet();
    }
    
    public long getActiveConnections() {
        return activeConnections.get();
    }
    
    public long getActiveCustomerCount() {
        return customerRepository.countActiveCustomers();
    }
    
    public long getActiveAccountCount() {
        return accountRepository.countActiveAccounts();
    }
    
    public long getActiveUserCount() {
        return userRepository.countActiveUsers();
    }
    
    public long getPendingTransactionCount() {
        return transactionRepository.countByStatusAndIsDeletedFalse(TransactionStatus.PENDING);
    }
    
    public void recordTransactionMetrics(TransactionType type, TransactionStatus status) {
        Counter.builder("midas.transactions.by_type")
                .tag("type", type.name())
                .register(meterRegistry)
                .increment();
        
        Counter.builder("midas.transactions.by_status")
                .tag("status", status.name())
                .register(meterRegistry)
                .increment();
    }
    
    public void recordUserMetrics(UserRole role) {
        Counter.builder("midas.users.by_role")
                .tag("role", role.name())
                .register(meterRegistry)
                .increment();
    }
    
    public void recordAuditMetrics(AuditLogType auditType) {
        Counter.builder("midas.audit.by_type")
                .tag("type", auditType.name())
                .register(meterRegistry)
                .increment();
    }
}
