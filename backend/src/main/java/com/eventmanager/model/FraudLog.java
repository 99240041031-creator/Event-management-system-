package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "fraud_logs")
public class FraudLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "ambassador_id", nullable = false)
    private User ambassador;

    private String activityType; // CLICK, REGISTRATION, SYSTEM
    private Integer riskScore;
    private String reason;
    
    private String technicalDetails; // IP, Fingerprint, Pattern info
    
    private LocalDateTime detectedAt = LocalDateTime.now();
}
