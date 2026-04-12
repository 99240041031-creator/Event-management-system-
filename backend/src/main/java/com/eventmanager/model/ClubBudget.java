package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "club_budgets")
public class ClubBudget {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "club_id", nullable = false, unique = true)
    private Club club;

    private Double allocated = 0.0;
    private Double spent = 0.0;
    private Double revenue = 0.0;
    
    private String fiscalYear; // e.g., "2024-2025"

    private LocalDateTime updatedAt = LocalDateTime.now();
}
