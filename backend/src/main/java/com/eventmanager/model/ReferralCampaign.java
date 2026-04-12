package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "referral_campaigns")
public class ReferralCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "ambassador_id", nullable = false)
    private User ambassador; // Ambassador role user

    private String targetAudience;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event; // Optional targeted event

    @Column(unique = true)
    private String referralToken;
    
    private String referralLink;
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, PAUSED

    private Integer clickCount = 0;
    private Integer registrationCount = 0;

    private LocalDateTime startDate = LocalDateTime.now();
    private LocalDateTime endDate;
    private LocalDateTime createdAt = LocalDateTime.now();
}
