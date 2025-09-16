package com.midascore.repository;

import com.midascore.model.AuditLog;
import com.midascore.model.AuditLogType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByAuditTypeAndIsDeletedFalseOrderByCreatedAtDesc(AuditLogType auditType);
    
    List<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
    
    List<AuditLog> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT a FROM AuditLog a WHERE a.createdAt BETWEEN :startDate AND :endDate AND a.isDeleted = false ORDER BY a.createdAt DESC")
    List<AuditLog> findByCreatedAtBetweenAndIsDeletedFalse(@Param("startDate") LocalDateTime startDate, 
                                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM AuditLog a WHERE a.auditType = :auditType AND a.createdAt BETWEEN :startDate AND :endDate AND a.isDeleted = false ORDER BY a.createdAt DESC")
    List<AuditLog> findByAuditTypeAndCreatedAtBetweenAndIsDeletedFalse(@Param("auditType") AuditLogType auditType,
                                                                      @Param("startDate") LocalDateTime startDate,
                                                                      @Param("endDate") LocalDateTime endDate);
    
    Page<AuditLog> findByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.auditType = :auditType AND a.isDeleted = false")
    Long countByAuditTypeAndIsDeletedFalse(@Param("auditType") AuditLogType auditType);
    
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.createdAt >= :since AND a.isDeleted = false")
    Long countByCreatedAtAfterAndIsDeletedFalse(@Param("since") LocalDateTime since);
}
