package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ambassador_networks")
public class AmbassadorNetwork {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "ambassador_id", nullable = false)
    private User ambassador;

    @ManyToOne
    @JoinColumn(name = "source_campus_id", nullable = false)
    private ExternalCampus sourceCampus;

    @ManyToOne
    @JoinColumn(name = "target_campus_id", nullable = false)
    private ExternalCampus targetCampus;

    private Integer referralsCount = 0;
    private Integer transferVolume = 0;
    private Double weight = 1.0;
    
    private LocalDateTime establishedAt = LocalDateTime.now();
}
