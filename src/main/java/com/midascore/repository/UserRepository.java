package com.midascore.repository;

import com.midascore.model.User;
import com.midascore.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsernameAndIsDeletedFalse(String username);
    
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    
    List<User> findByRoleAndIsActiveTrueAndIsDeletedFalse(UserRole role);
    
    List<User> findByIsActiveTrueAndIsDeletedFalse();
    
    List<User> findByIsLockedTrueAndIsDeletedFalse();
    
    @Query("SELECT u FROM User u WHERE u.lastLogin < :cutoffDate AND u.isActive = true AND u.isDeleted = false")
    List<User> findInactiveUsers(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.isDeleted = false")
    Long countActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true AND u.isDeleted = false")
    Long countByRoleAndIsActiveTrueAndIsDeletedFalse(@Param("role") UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isLocked = true AND u.isDeleted = false")
    Long countLockedUsers();
}
