package com.midascore.controller;

import com.midascore.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cache")
@CrossOrigin(origins = "*")
public class CacheController {

    @Autowired
    private CacheService cacheService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = cacheService.getCacheStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/clear")
    public ResponseEntity<String> clearAllCaches() {
        cacheService.clearAllCaches();
        return ResponseEntity.ok("All caches cleared successfully");
    }

    @PostMapping("/customers/{id}/evict")
    public ResponseEntity<String> evictCustomerCache(@PathVariable Long id) {
        cacheService.evictCustomerCache(id);
        return ResponseEntity.ok("Customer cache evicted for ID: " + id);
    }

    @PostMapping("/accounts/{id}/evict")
    public ResponseEntity<String> evictAccountCache(@PathVariable Long id) {
        cacheService.evictAccountCache(id);
        return ResponseEntity.ok("Account cache evicted for ID: " + id);
    }

    @PostMapping("/transactions/{id}/evict")
    public ResponseEntity<String> evictTransactionCache(@PathVariable Long id) {
        cacheService.evictTransactionCache(id);
        return ResponseEntity.ok("Transaction cache evicted for ID: " + id);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<String> getCustomerCache(@PathVariable Long id) {
        String result = cacheService.getCustomerCache(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<String> getAccountCache(@PathVariable Long id) {
        String result = cacheService.getAccountCache(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<String> getTransactionCache(@PathVariable Long id) {
        String result = cacheService.getTransactionCache(id);
        return ResponseEntity.ok(result);
    }
}
