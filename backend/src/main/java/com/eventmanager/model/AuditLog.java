package com.eventmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String action;
    
    @Column(nullable = false)
    private String entityType;
    
    private String entityId;
    
    @Column(nullable = false)
    private String userId;
    
    private String username;
    
    @Column(nullable = false)
    private String userRole;
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    private String ipAddress;
    
    private String userAgent;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private String status; // SUCCESS, FAILURE
    
    private String errorMessage;
}
