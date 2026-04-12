package com.eventmanager.service;

import com.eventmanager.model.AuditLog;
import com.eventmanager.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    
    @Async
    @Transactional
    public void log(String action, String entityType, String entityId, String details, HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            AuditLog log = new AuditLog();
            log.setAction(action);
            log.setEntityType(entityType);
            log.setEntityId(entityId);
            log.setDetails(details);
            log.setStatus("SUCCESS");
            
            if (auth != null && auth.isAuthenticated()) {
                log.setUsername(auth.getName());
                log.setUserRole(auth.getAuthorities().toString());
                // Extract user ID from authentication if available
                // log.setUserId(extractUserId(auth));
            }
            
            if (request != null) {
                log.setIpAddress(getClientIpAddress(request));
                log.setUserAgent(request.getHeader("User-Agent"));
            }
            
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Log error but don't fail the main operation
            System.err.println("Failed to create audit log: " + e.getMessage());
        }
    }
    
    @Async
    @Transactional
    public void logFailure(String action, String entityType, String entityId, String errorMessage, HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            AuditLog log = new AuditLog();
            log.setAction(action);
            log.setEntityType(entityType);
            log.setEntityId(entityId);
            log.setStatus("FAILURE");
            log.setErrorMessage(errorMessage);
            
            if (auth != null && auth.isAuthenticated()) {
                log.setUsername(auth.getName());
                log.setUserRole(auth.getAuthorities().toString());
            }
            
            if (request != null) {
                log.setIpAddress(getClientIpAddress(request));
                log.setUserAgent(request.getHeader("User-Agent"));
            }
            
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to create audit log: " + e.getMessage());
        }
    }
    
    public Page<AuditLog> getRecentLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }
    
    public Page<AuditLog> getLogsByUser(String userId, Pageable pageable) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId, pageable);
    }
    
    public Page<AuditLog> getLogsByEntityType(String entityType, Pageable pageable) {
        return auditLogRepository.findByEntityTypeOrderByTimestampDesc(entityType, pageable);
    }
    
    public Page<AuditLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end, pageable);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Async
    @Transactional
    public void log(String action, String details, com.eventmanager.model.User actor, String entityType, String entityId) {
        try {
            AuditLog log = new AuditLog();
            log.setAction(action);
            log.setEntityType(entityType);
            log.setEntityId(entityId);
            log.setDetails(details);
            log.setStatus("SUCCESS");
            
            if (actor != null) {
                log.setUsername(actor.getName() != null ? actor.getName() : actor.getEmail());
                log.setUserRole(actor.getRole() != null ? actor.getRole() : "UNKNOWN");
                log.setUserId(actor.getId());
            }
            
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to create audit log: " + e.getMessage());
        }
    }
}
