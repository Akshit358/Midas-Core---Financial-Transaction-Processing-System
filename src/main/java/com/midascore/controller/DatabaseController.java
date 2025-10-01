package com.midascore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/database")
@CrossOrigin(origins = "*")
public class DatabaseController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getDatabaseInfo() {
        Map<String, Object> info = new HashMap<>();
        
        try {
            // Get database product name and version
            String productName = jdbcTemplate.queryForObject("SELECT H2VERSION()", String.class);
            info.put("database", "H2 Database");
            info.put("version", productName);
            
            // Get connection info
            String url = jdbcTemplate.getDataSource().getConnection().getMetaData().getURL();
            info.put("url", url);
            
            // Get table count
            String tableCountQuery = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'";
            Integer tableCount = jdbcTemplate.queryForObject(tableCountQuery, Integer.class);
            info.put("tableCount", tableCount);
            
            // Get table names
            String tablesQuery = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'";
            List<String> tables = jdbcTemplate.queryForList(tablesQuery, String.class);
            info.put("tables", tables);
            
        } catch (Exception e) {
            info.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(info);
    }

    @GetMapping("/tables")
    public ResponseEntity<List<Map<String, Object>>> getTables() {
        try {
            String query = "SELECT " +
                "TABLE_NAME as name, " +
                "(SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = t.TABLE_NAME AND TABLE_SCHEMA = 'PUBLIC') as columnCount " +
                "FROM INFORMATION_SCHEMA.TABLES t " +
                "WHERE TABLE_SCHEMA = 'PUBLIC' " +
                "ORDER BY TABLE_NAME";
            
            List<Map<String, Object>> tables = jdbcTemplate.queryForList(query);
            return ResponseEntity.ok(tables);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of(Map.of("error", e.getMessage())));
        }
    }

    @GetMapping("/tables/{tableName}/columns")
    public ResponseEntity<List<Map<String, Object>>> getTableColumns(@PathVariable String tableName) {
        try {
            String query = "SELECT " +
                "COLUMN_NAME as name, " +
                "DATA_TYPE as type, " +
                "IS_NULLABLE as nullable, " +
                "COLUMN_DEFAULT as defaultValue, " +
                "CHARACTER_MAXIMUM_LENGTH as maxLength " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = ? AND TABLE_SCHEMA = 'PUBLIC' " +
                "ORDER BY ORDINAL_POSITION";
            
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(query, tableName.toUpperCase());
            return ResponseEntity.ok(columns);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of(Map.of("error", e.getMessage())));
        }
    }

    @GetMapping("/tables/{tableName}/count")
    public ResponseEntity<Map<String, Object>> getTableRowCount(@PathVariable String tableName) {
        try {
            String query = "SELECT COUNT(*) FROM " + tableName.toUpperCase();
            Integer count = jdbcTemplate.queryForObject(query, Integer.class);
            return ResponseEntity.ok(Map.of("table", tableName, "rowCount", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeQuery(@RequestBody Map<String, String> request) {
        try {
            String query = request.get("query");
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Query is required"));
            }
            
            // Only allow SELECT queries for safety
            if (!query.trim().toUpperCase().startsWith("SELECT")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only SELECT queries are allowed"));
            }
            
            List<Map<String, Object>> results = jdbcTemplate.queryForList(query);
            return ResponseEntity.ok(Map.of("results", results, "rowCount", results.size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
