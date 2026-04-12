package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "referral_records")
public class ReferralRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private ReferralCampaign campaign;

    @ManyToOne
    @JoinColumn(name = "referred_user_id")
    private User referredUser; // Created upon successful registration

    private String visitorIp; // Track clicks before registration
    private String conversionStatus = "CLICKED"; // CLICKED, REGISTERED, PARTICIPATED, COMPLETED

    private LocalDateTime clickedAt = LocalDateTime.now();
    private LocalDateTime registeredAt;
    private LocalDateTime participatedAt;
    private LocalDateTime completedAt;
}
