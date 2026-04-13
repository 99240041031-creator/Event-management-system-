package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "exam_results")
public class ExamResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    private Double internalMarks = 0.0;
    private Double externalMarks = 0.0;
    private Double totalScore = 0.0;
    
    private String passStatus = "FAIL"; // PASS, FAIL, ARREAR
    private String semester;
    
    private LocalDateTime recordedAt = LocalDateTime.now();
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }
    public Double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }
    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }
    public String getPassStatus() { return passStatus; }
    public void setPassStatus(String passStatus) { this.passStatus = passStatus; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}
