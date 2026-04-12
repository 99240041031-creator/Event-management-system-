package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "club_events")
public class ClubEvent {
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

    private String type; // WORKSHOP, SEMINAR, MEETUP
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED, CANCELLED

    private Integer capacity;
    private Integer registeredCount = 0;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    private Boolean registrationOpen = true;
    
    @Transient
    private Integer registrationCount; // Populated dynamically

    private LocalDateTime createdAt = LocalDateTime.now();
}
