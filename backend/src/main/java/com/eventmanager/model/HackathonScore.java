package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "hackathon_scores")
public class HackathonScore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private ClubHackathonTeam team;

    @ManyToOne
    @JoinColumn(name = "judge_id", nullable = false)
    private User judge;

    private Integer innovation;
    private Integer technical;
    private Integer uiux;
    private Integer impact;
    private Integer presentation;
    
    private Integer totalScore;

    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        this.totalScore = (innovation != null ? innovation : 0) +
                          (technical != null ? technical : 0) +
                          (uiux != null ? uiux : 0) +
                          (impact != null ? impact : 0) +
                          (presentation != null ? presentation : 0);
    }
}
