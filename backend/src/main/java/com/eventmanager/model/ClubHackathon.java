package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "club_hackathons")
public class ClubHackathon {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String prizePool;
    
    private LocalDateTime submissionDeadline;
    
    private String status = "DRAFT"; // DRAFT, PUBLISHED, ONGOING, COMPLETED

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private LocalDateTime createdAt = LocalDateTime.now();
}
