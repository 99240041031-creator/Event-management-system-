package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "department_budgets")
public class DepartmentBudget {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "department_id", nullable = false, unique = true)
    private Department department;

    private Double allocated = 0.0;
    private Double spent = 0.0;
    private Double pendingApproval = 0.0;
    
    private String fiscalYear;

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
