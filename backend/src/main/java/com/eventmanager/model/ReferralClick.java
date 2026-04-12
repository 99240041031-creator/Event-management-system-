package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "referral_clicks")
public class ReferralClick {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private ReferralCampaign campaign;

    private String visitorIp;
    private String deviceFingerprint;
    private String browser;
    private String userAgent;
    
    private LocalDateTime clickedAt = LocalDateTime.now();
    
    private boolean isSuspicious = false;
    private String flagReason;
}
