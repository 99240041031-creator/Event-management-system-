package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "budget_requests")
public class BudgetRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    private String purpose;
    private Double amountRequested;
    private Double amountAllocated = 0.0;
    private Double amountSpent = 0.0;
    
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    
    private LocalDateTime requestedAt = LocalDateTime.now();
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public Double getAmountRequested() { return amountRequested; }
    public void setAmountRequested(Double p) { this.amountRequested = p; }
    public Double getAmountAllocated() { return amountAllocated; }
    public void setAmountAllocated(Double p) { this.amountAllocated = p; }
    public Double getAmountSpent() { return amountSpent; }
    public void setAmountSpent(Double p) { this.amountSpent = p; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
