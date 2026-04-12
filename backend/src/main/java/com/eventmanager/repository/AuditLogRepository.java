package com.eventmanager.repository;

import com.eventmanager.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    Page<AuditLog> findByUserIdOrderByTimestampDesc(String userId, Pageable pageable);
    
    Page<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType, Pageable pageable);
    
    Page<AuditLog> findByActionOrderByTimestampDesc(String action, Pageable pageable);
    
    Page<AuditLog> findByTimestampBetweenOrderByTimestampDesc(
        LocalDateTime start, 
        LocalDateTime end, 
        Pageable pageable
    );
    
    List<AuditLog> findTop100ByOrderByTimestampDesc();
    
    long countByUserIdAndTimestampAfter(String userId, LocalDateTime timestamp);
}
