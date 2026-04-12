package com.eventmanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberRole role = MemberRole.MEMBER;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status = MemberStatus.ACTIVE;
    
    // New field for Club Management System
    private Integer contributionScore = 0;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;
    
    private LocalDateTime approvedAt;
    
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    public enum MemberRole {
        PRESIDENT,
        VICE_PRESIDENT,
        SECRETARY,
        TREASURER,
        CORE_MEMBER,
        MEMBER
    }
    
    public enum MemberStatus {
        PENDING,
        ACTIVE,
        INACTIVE,
        REMOVED
    }
}
