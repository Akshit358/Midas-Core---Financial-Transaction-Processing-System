package com.midascore.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.Cache;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Service
public class CacheService {

    @Autowired
    private CacheManager cacheManager;

    @Cacheable(value = "customers", key = "#id")
    public String getCustomerCache(Long id) {
        return "Customer " + id + " cached";
    }

    @CacheEvict(value = "customers", key = "#id")
    public void evictCustomerCache(Long id) {
        // Cache eviction handled by annotation
    }

    @CachePut(value = "customers", key = "#id")
    public String updateCustomerCache(Long id, String data) {
        return "Updated customer " + id + ": " + data;
    }

    @Cacheable(value = "accounts", key = "#id")
    public String getAccountCache(Long id) {
        return "Account " + id + " cached";
    }

    @CacheEvict(value = "accounts", key = "#id")
    public void evictAccountCache(Long id) {
        // Cache eviction handled by annotation
    }

    @Cacheable(value = "transactions", key = "#id")
    public String getTransactionCache(Long id) {
        return "Transaction " + id + " cached";
    }

    @CacheEvict(value = "transactions", key = "#id")
    public void evictTransactionCache(Long id) {
        // Cache eviction handled by annotation
    }

    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        Collection<String> cacheNames = cacheManager.getCacheNames();
        
        for (String cacheName : cacheNames) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                stats.put(cacheName, cache.getNativeCache());
            }
        }
        
        return stats;
    }

    public void clearAllCaches() {
        Collection<String> cacheNames = cacheManager.getCacheNames();
        for (String cacheName : cacheNames) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        }
    }
}
