package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "scoring_audit_logs")
public class ScoringAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "judge_id", nullable = false)
    private User judge;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne
    @JoinColumn(name = "round_id", nullable = false)
    private HackathonRound round;

    private String action; // e.g., "SUBMIT", "DRAFT_SAVE", "LOCK"
    private Double oldScore;
    private Double newScore;
    private String details;

    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters and Setters (if needed beyond @Data)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public User getJudge() { return judge; }
    public void setJudge(User judge) { this.judge = judge; }
    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }
    public HackathonRound getRound() { return round; }
    public void setRound(HackathonRound round) { this.round = round; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Double getOldScore() { return oldScore; }
    public void setOldScore(Double oldScore) { this.oldScore = oldScore; }
    public Double getNewScore() { return newScore; }
    public void setNewScore(Double newScore) { this.newScore = newScore; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
