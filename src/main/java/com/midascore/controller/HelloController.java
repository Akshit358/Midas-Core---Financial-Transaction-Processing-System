package com.midascore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "index.html";
    }

    @GetMapping("/api")
    @ResponseBody
    public Map<String, Object> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Midas Core Financial Transaction Processing System");
        response.put("version", "1.0.0");
        response.put("status", "Running");
        response.put("endpoints", Map.of(
            "customers", "/api/v1/customers",
            "accounts", "/api/v1/accounts", 
            "transactions", "/api/v1/transactions",
            "health", "/health",
            "actuator", "/actuator/health"
        ));
        return response;
    }

    @GetMapping("/health")
    @ResponseBody
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Midas Core Financial Transaction Processing System");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
