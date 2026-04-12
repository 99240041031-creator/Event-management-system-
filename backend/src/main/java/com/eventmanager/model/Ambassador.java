package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "club_ambassadors")
public class Ambassador {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private Integer referrals = 0;
    private Integer impactScore = 0;
    
    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    private LocalDateTime joinedAt = LocalDateTime.now();
}
