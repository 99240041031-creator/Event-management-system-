package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    private String code;
    private String semester;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}
