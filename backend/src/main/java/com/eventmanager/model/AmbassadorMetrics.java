package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ambassador_metrics")
public class AmbassadorMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer totalReferrals = 0;
    private Integer successfulRegistrations = 0;
    private Integer successfulParticipations = 0;
    private Double conversionRate = 0.0;
    private Integer rewardPoints = 0;
    private Integer ambassadorRank = 0;
    private Integer externalCollegeReach = 0;
    
    private Double fraudScore = 0.0;
    private Double consistencyScore = 0.0;
    private Double rawRankingScore = 0.0;
    private Double networkReachScore = 0.0; // Normalized influence
    
    private String validationStatus = "VALID"; // VALID, SUSPICIOUS, BLOCKED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
