package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "department_health")
public class DepartmentHealth {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "department_id", nullable = false, unique = true)
    private Department department;

    private Double participationRate = 0.0;
    private Double facultyPerformance = 0.0;
    private Double studentEngagement = 0.0;
    private Double clubPerformance = 0.0;
    private Double budgetEfficiency = 0.0;
    
    private Double totalHealthScore = 0.0;

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        // HealthScore = (ParticipationRate × 0.3) + (FacultyPerformance × 0.2) + (StudentEngagement × 0.2) + (ClubPerformance × 0.15) + (BudgetEfficiency × 0.15)
        this.totalHealthScore = (participationRate * 0.3) + 
                               (facultyPerformance * 0.2) + 
                               (studentEngagement * 0.2) + 
                               (clubPerformance * 0.15) + 
                               (budgetEfficiency * 0.15);
        this.updatedAt = LocalDateTime.now();
    }
}
