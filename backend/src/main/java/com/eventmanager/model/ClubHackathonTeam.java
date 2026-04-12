package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "club_hackathon_teams")
public class ClubHackathonTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "hackathon_id", nullable = false)
    private ClubHackathon hackathon;

    @Column(nullable = false)
    private String teamName;
    
    @ManyToOne
    @JoinColumn(name = "leader_id")
    private User leader;

    // Use ElementCollection for simple list of member IDs if full mapping is too complex, 
    // or ManyToMany if we want full User objects. Using ManyToMany for correctness.
    @ManyToMany
    @JoinTable(
        name = "club_hackathon_team_members",
        joinColumns = @JoinColumn(name = "team_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();
    
    private String projectTitle;
    private String projectDescription;
    private String submissionUrl;
    
    private Double totalScore = 0.0;
    private String feedback;

    private LocalDateTime createdAt = LocalDateTime.now();
}
