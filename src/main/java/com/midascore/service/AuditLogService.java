package com.midascore.service;

import com.midascore.model.AuditLog;
import com.midascore.model.AuditLogType;
import com.midascore.model.User;
import com.midascore.repository.AuditLogRepository;
import com.midascore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public AuditLog createAuditLog(AuditLogType auditType, String entityType, Long entityId, 
                                 String description, String ipAddress, String userAgent) {
        AuditLog auditLog = new AuditLog(auditType, entityType, entityId, null);
        auditLog.setDescription(description);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        
        return auditLogRepository.save(auditLog);
    }
    
    public AuditLog createAuditLog(AuditLogType auditType, String entityType, Long entityId, 
                                 Long userId, String description, String ipAddress, String userAgent) {
        User user = userRepository.findById(userId).orElse(null);
        AuditLog auditLog = new AuditLog(auditType, entityType, entityId, user);
        auditLog.setDescription(description);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        
        return auditLogRepository.save(auditLog);
    }
    
    public AuditLog createAuditLogWithChanges(AuditLogType auditType, String entityType, Long entityId, 
                                            Long userId, String oldValues, String newValues, 
                                            String description, String ipAddress, String userAgent) {
        User user = userRepository.findById(userId).orElse(null);
        AuditLog auditLog = new AuditLog(auditType, entityType, entityId, user);
        auditLog.setOldValues(oldValues);
        auditLog.setNewValues(newValues);
        auditLog.setDescription(description);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        
        return auditLogRepository.save(auditLog);
    }
    
    public List<AuditLog> getAuditLogsByType(AuditLogType auditType) {
        return auditLogRepository.findByAuditTypeAndIsDeletedFalseOrderByCreatedAtDesc(auditType);
    }
    
    public List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId);
    }
    
    public List<AuditLog> getAuditLogsByUser(Long userId) {
        return auditLogRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
    }
    
    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByCreatedAtBetweenAndIsDeletedFalse(startDate, endDate);
    }
    
    public List<AuditLog> getAuditLogsByTypeAndDateRange(AuditLogType auditType, 
                                                        LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByAuditTypeAndCreatedAtBetweenAndIsDeletedFalse(auditType, startDate, endDate);
    }
    
    public Long getAuditLogCountByType(AuditLogType auditType) {
        return auditLogRepository.countByAuditTypeAndIsDeletedFalse(auditType);
    }
    
    public Long getAuditLogCountSince(LocalDateTime since) {
        return auditLogRepository.countByCreatedAtAfterAndIsDeletedFalse(since);
    }
    
    // Convenience methods for common audit events
    public void logUserLogin(String username, String ipAddress, String userAgent) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username).orElse(null);
        if (user != null) {
            createAuditLog(AuditLogType.USER_LOGIN, "User", user.getId(), user.getId(),
                    "User logged in", ipAddress, userAgent);
        }
    }
    
    public void logUserLogout(String username, String ipAddress, String userAgent) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username).orElse(null);
        if (user != null) {
            createAuditLog(AuditLogType.USER_LOGOUT, "User", user.getId(), user.getId(),
                    "User logged out", ipAddress, userAgent);
        }
    }
    
    public void logTransactionCreated(Long transactionId, Long userId, String ipAddress, String userAgent) {
        createAuditLog(AuditLogType.TRANSACTION_CREATED, "Transaction", transactionId, userId,
                "Transaction created", ipAddress, userAgent);
    }
    
    public void logAccountCreated(Long accountId, Long userId, String ipAddress, String userAgent) {
        createAuditLog(AuditLogType.ACCOUNT_CREATED, "Account", accountId, userId,
                "Account created", ipAddress, userAgent);
    }
    
    public void logCustomerCreated(Long customerId, Long userId, String ipAddress, String userAgent) {
        createAuditLog(AuditLogType.CUSTOMER_CREATED, "Customer", customerId, userId,
                "Customer created", ipAddress, userAgent);
    }
}
