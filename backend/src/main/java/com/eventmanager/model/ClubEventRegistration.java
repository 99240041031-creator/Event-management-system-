package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "club_event_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubEventRegistration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "club_event_id", nullable = false)
    private ClubEvent clubEvent;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @Column(name = "attendance_status")
    private String attendanceStatus = "REGISTERED"; // REGISTERED, ATTENDED, ABSENT
    
    @Column(name = "completion_status")
    private String completionStatus = "INCOMPLETE"; // COMPLETED, INCOMPLETE
    
    @Column(name = "registered_at")
    private LocalDateTime registeredAt = LocalDateTime.now();
    
    @Column(name = "attended_at")
    private LocalDateTime attendedAt;
}
