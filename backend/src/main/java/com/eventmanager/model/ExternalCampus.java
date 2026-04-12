package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "external_campuses")
public class ExternalCampus {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;
    
    private String location;
    private Integer studentReach = 0;
    
    @Column(nullable = false)
    private String contactPerson;

    private String tier = "BRONZE";
    private Integer estimatedStudentCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
}
