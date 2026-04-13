package com.eventmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "governance_logs")
public class GovernanceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "target_event_id", nullable = true)
    private Event targetEvent; // The event or hackathon being approved/reviewed

    @ManyToOne
    @JoinColumn(name = "action_by_id", nullable = false)
    private User actionBy;

    private String actionType; // APPROVAL, REJECTION, OVERRIDE, SCORE_FINALIZATION

    private String fromStatus;
    private String toStatus;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(columnDefinition = "TEXT")
    private String metadata; // For any additional data like override reasons

    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Event getTargetEvent() {
        return targetEvent;
    }

    public void setTargetEvent(Event targetEvent) {
        this.targetEvent = targetEvent;
    }

    public User getActionBy() {
        return actionBy;
    }

    public void setActionBy(User actionBy) {
        this.actionBy = actionBy;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(String fromStatus) {
        this.fromStatus = fromStatus;
    }

    public String getToStatus() {
        return toStatus;
    }

    public void setToStatus(String toStatus) {
        this.toStatus = toStatus;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // --- Compatibility Methods for Service ---
    public void setEntityId(String entityId) {
        // basic mapping, though targetEvent is preferred for events
    }

    public void setEntityType(String entityType) {
        // generic type
    }

    public void setAction(String action) {
        this.actionType = action;
    }

    public void setActor(User actor) {
        this.actionBy = actor;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.createdAt = timestamp;
    }

    @ManyToOne(optional = true)
    @JoinColumn(name = "target_hackathon_id", nullable = true)
    private Hackathon targetHackathon;

    public Hackathon getTargetHackathon() {
        return targetHackathon;
    }

    public void setTargetHackathon(Hackathon targetHackathon) {
        this.targetHackathon = targetHackathon;
    }

    @Column(name = "entity_id")
    private String entityId;

    @Column(name = "entity_type")
    private String entityType;
}
