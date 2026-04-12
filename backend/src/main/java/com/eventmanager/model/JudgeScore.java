package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "judge_scores")
public class JudgeScore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "judge_id", nullable = false)
    private User judge;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @Column(columnDefinition = "TEXT")
    private String criteriaScores; // JSON string for criteria-wise scores

    @ManyToOne
    @JoinColumn(name = "round_id")
    private HackathonRound hackathonRound;

    private Integer roundNumber;

    private Double totalScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private String status = "DRAFT"; // DRAFT, SUBMITTED

    private Boolean isDraft = true; // Kept for backward compatibility, sync with status

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getJudge() {
        return judge;
    }

    public void setJudge(User judge) {
        this.judge = judge;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public void setCriteriaScores(String criteriaScores) {
        this.criteriaScores = criteriaScores;
    }

    public HackathonRound getHackathonRound() {
        return hackathonRound;
    }

    public void setHackathonRound(HackathonRound hackathonRound) {
        this.hackathonRound = hackathonRound;
    }

    public Integer getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(Integer roundNumber) {
        this.roundNumber = roundNumber;
    }

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Boolean getIsDraft() {
        return isDraft;
    }

    public void setIsDraft(Boolean isDraft) {
        this.isDraft = isDraft;
        this.status = isDraft ? "DRAFT" : "SUBMITTED";
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.isDraft = "DRAFT".equalsIgnoreCase(status);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getSubmissionId() {
        return submission != null ? submission.getId() : null;
    }
}
