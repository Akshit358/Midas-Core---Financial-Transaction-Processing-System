package com.midascore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {
    
    @Column(name = "transaction_id", unique = true, nullable = false)
    private String transactionId;
    
    @NotNull(message = "Transaction type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;
    
    @NotNull(message = "Transaction status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;
    
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "currency", nullable = false)
    private String currency = "USD";
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "reference_number")
    private String referenceNumber;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "failure_reason")
    private String failureReason;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    private Account toAccount;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    // Constructors
    public Transaction() {}
    
    public Transaction(String transactionId, TransactionType transactionType, 
                     TransactionStatus status, BigDecimal amount, Customer customer) {
        this.transactionId = transactionId;
        this.transactionType = transactionType;
        this.status = status;
        this.amount = amount;
        this.customer = customer;
    }
    
    // Getters and Setters
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public TransactionType getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
    
    public TransactionStatus getStatus() {
        return status;
    }
    
    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public Account getFromAccount() {
        return fromAccount;
    }
    
    public void setFromAccount(Account fromAccount) {
        this.fromAccount = fromAccount;
    }
    
    public Account getToAccount() {
        return toAccount;
    }
    
    public void setToAccount(Account toAccount) {
        this.toAccount = toAccount;
    }
    
    public Customer getCustomer() {
        return customer;
    }
    
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
    // Business methods
    public void markAsCompleted() {
        this.status = TransactionStatus.COMPLETED;
        this.processedAt = LocalDateTime.now();
    }
    
    public void markAsFailed(String reason) {
        this.status = TransactionStatus.FAILED;
        this.failureReason = reason;
        this.processedAt = LocalDateTime.now();
    }
    
    public boolean isCompleted() {
        return TransactionStatus.COMPLETED.equals(this.status);
    }
    
    public boolean isFailed() {
        return TransactionStatus.FAILED.equals(this.status);
    }
}
