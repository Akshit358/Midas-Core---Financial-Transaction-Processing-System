package com.midascore.service;

import com.midascore.model.User;
import com.midascore.model.UserRole;
import com.midascore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        if (user.getIsActive() == null || !user.getIsActive()) {
            throw new UsernameNotFoundException("User account is disabled");
        }
        
        if (user.isAccountLocked()) {
            throw new UsernameNotFoundException("User account is locked");
        }
        
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                user.getIsActive() != null && user.getIsActive() && (user.getIsLocked() == null || !user.getIsLocked()), // Account enabled if active and not locked
                true, // Account non-expired
                true, // Credentials non-expired
                user.getIsLocked() == null || !user.getIsLocked(), // Account non-locked
                authorities
        );
    }
    
    public User createUser(User user) {
        // Check if username already exists
        if (userRepository.findByUsernameAndIsDeletedFalse(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.findByEmailAndIsDeletedFalse(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Encode password
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id)
                .filter(user -> !user.getIsDeleted());
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsernameAndIsDeletedFalse(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailAndIsDeletedFalse(email);
    }
    
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrueAndIsDeletedFalse();
    }
    
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRoleAndIsActiveTrueAndIsDeletedFalse(role);
    }
    
    public List<User> getLockedUsers() {
        return userRepository.findByIsLockedTrueAndIsDeletedFalse();
    }
    
    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getId())
                .filter(u -> !u.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update fields
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        existingUser.setIsActive(user.getIsActive());
        existingUser.setIsLocked(user.getIsLocked());
        
        return userRepository.save(existingUser);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> !u.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsDeleted(true);
        userRepository.save(user);
    }
    
    public void lockUser(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> !u.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsLocked(true);
        user.setLockedUntil(LocalDateTime.now().plusHours(1)); // Lock for 1 hour
        userRepository.save(user);
    }
    
    public void unlockUser(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> !u.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsLocked(false);
        user.setLockedUntil(null);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
    }
    
    public void recordSuccessfulLogin(String username) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLastLogin(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        user.setIsLocked(false);
        user.setLockedUntil(null);
        
        userRepository.save(user);
    }
    
    public void recordFailedLogin(String username) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        
        if (user.getFailedLoginAttempts() >= 5) {
            user.setIsLocked(true);
            user.setLockedUntil(LocalDateTime.now().plusHours(1));
        }
        
        userRepository.save(user);
    }
    
    public boolean isAccountLocked(String username) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.isAccountLocked();
    }
    
    public void changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .filter(u -> !u.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public boolean verifyPassword(String username, String password) {
        User user = userRepository.findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return passwordEncoder.matches(password, user.getPasswordHash());
    }
}
