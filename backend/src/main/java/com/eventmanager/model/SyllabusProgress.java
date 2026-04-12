package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "syllabus_progress")
public class SyllabusProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private User faculty;
    
    private Double completionPercentage = 0.0;
    private String lastTopicCovered;
    private String status = "ON_TRACK"; // ON_TRACK, DELAYED
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public User getFaculty() { return faculty; }
    public void setFaculty(User faculty) { this.faculty = faculty; }
    public Double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Double cp) { this.completionPercentage = cp; }
    public String getLastTopicCovered() { return lastTopicCovered; }
    public void setLastTopicCovered(String lt) { this.lastTopicCovered = lt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
