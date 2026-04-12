package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.security.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class GovernanceService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GovernanceLogRepository governanceLogRepository;

    @Autowired
    private ScoreLockRepository scoreLockRepository;

    @Autowired
    private JudgeAssignmentRepository judgeAssignmentRepository;

    @Autowired
    private JudgeScoreRepository judgeScoreRepository;

    @Autowired
    private AuditLogService auditLogService;

    // --- 1. Event/Hackathon Approval Flow ---

    @Transactional
    public void submitForApproval(String eventId, User actor) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        // Step 2: Faculty Supervision (Implicit if faculty creates)
        if (Roles.FACULTY.equals(actor.getRole())) {
            event.setStatus("HOD_APPROVAL_PENDING");
            eventRepository.save(event);
            logAction(eventId, "EVENT", "SUBMIT_FOR_APPROVAL", actor, "Faculty submitted event for HOD approval");
        }
    }

    @Transactional
    public void approveEvent(String eventId, User actor, String comments) {
        if (!Roles.HOD.equals(actor.getDirectorRole()) && !Roles.HOD.equals(actor.getRole())) {
            throw new RuntimeException("Only HOD can approve events");
        }

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        // Strict Check: Must be pending approval
        if (!"HOD_APPROVAL_PENDING".equals(event.getStatus())) {
            throw new RuntimeException("Event is not pending approval");
        }

        event.setStatus("ACTIVE"); // Step 7: HOD Approves
        eventRepository.save(event);
        logAction(eventId, "EVENT", "APPROVE", actor, comments);

        auditLogService.log("EVENT_APPROVED", "Event", eventId,
                "Event " + event.getTitle() + " approved exclusively by HOD", null);
    }

    @Transactional
    public void approveHackathon(String hackathonId, User actor, String comments) {
        if (!Roles.HOD.equals(actor.getDirectorRole()) && !Roles.HOD.equals(actor.getRole())) {
            throw new RuntimeException("Only HOD can approve hackathons");
        }

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
        if (!"HOD_APPROVAL_PENDING".equals(hackathon.getStatus())) {
            throw new RuntimeException("Hackathon is not pending approval");
        }

        hackathon.setStatus("ACTIVE");
        hackathonRepository.save(hackathon);
        logAction(hackathonId, "HACKATHON", "APPROVE", actor, comments);

        auditLogService.log("HACKATHON_APPROVED", "Hackathon", hackathonId,
                "Hackathon " + hackathon.getTitle() + " approved exclusively by HOD", null);
    }

    // --- 2. Judge Management (Step 3) ---

    @Transactional
    public void assignJudge(String eventId, String judgeId, User actor) {
        // Only Director (HOD/Admin) can add judges
        if (actor.getDirectorRole() == null && !Roles.HOD.equals(actor.getRole())) {
            throw new RuntimeException("Insufficient privileges to assign judges");
        }

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        User judge = userRepository.findById(judgeId).orElseThrow(() -> new RuntimeException("Judge not found"));

        JudgeAssignment assignment = new JudgeAssignment();
        assignment.setEvent(event);
        assignment.setJudge(judge);
        assignment.setStatus("ASSIGNED");
        judgeAssignmentRepository.save(assignment);

        logAction(eventId, "EVENT", "ASSIGN_JUDGE", actor, "Assigned judge: " + judge.getEmail());
    }

    // --- 3. Scoring Governance (Steps 4-7) ---

    @Autowired
    private SubmissionRepository submissionRepository;

    @Transactional
    public void submitScore(String submissionId, JudgeScore scoreDetails, User judge) {
        // Step 5: Judges submit scores
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        String eventId = null;
        if (submission.getEvent() != null) {
            eventId = submission.getEvent().getId();
        } else if (submission.getHackathon() != null) {
            eventId = submission.getHackathon().getId(); // Treating hackathon ID as event ID for locking
        }

        if (eventId != null && isScoresLocked(eventId)) {
            throw new RuntimeException("Scores are locked for this event/hackathon. No new scores or edits allowed.");
        }

        // Check if score already exists for this judge and submission
        JudgeScore existingScore = judgeScoreRepository.findByJudgeAndSubmission(judge, submission)
                .orElse(new JudgeScore());

        existingScore.setJudge(judge);
        existingScore.setSubmission(submission);
        existingScore.setCriteriaScores(scoreDetails.getCriteriaScores());
        existingScore.setTotalScore(scoreDetails.getTotalScore());
        existingScore.setFeedback(scoreDetails.getFeedback());
        existingScore.setIsDraft(scoreDetails.getIsDraft());
        existingScore.setUpdatedAt(LocalDateTime.now());

        judgeScoreRepository.save(existingScore);

        auditLogService.log("SCORE_SUBMIT", "JudgeScore", existingScore.getId(),
                "Judge " + judge.getEmail() + " submitted score for submission " + submissionId, null);
    }

    @Transactional
    public void lockScores(String eventId, User actor, String comments) {
        // Step 7: HOD Finalizes and Locks
        if (!Roles.HOD.equals(actor.getDirectorRole()) && !Roles.HOD.equals(actor.getRole())) {
            throw new RuntimeException("Only HOD can lock scores");
        }

        if (scoreLockRepository.existsByEventId(eventId)) {
            throw new RuntimeException("Scores are already locked for this event");
        }

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        ScoreLock lock = new ScoreLock();
        lock.setEvent(event);
        lock.setLockedBy(actor);
        lock.setLockedAt(LocalDateTime.now());
        lock.setComments(comments);
        scoreLockRepository.save(lock);

        logAction(eventId, "EVENT", "LOCK_SCORES", actor, "Scores finalized and locked by HOD");

        // Step 8 & 9: Operations triggered implicitly or via separate service calls
        // (Leaderboard/Certificates)
        triggerPostProcessing(eventId);
    }

    public boolean isScoresLocked(String eventId) {
        return scoreLockRepository.existsByEventId(eventId);
    }

    private void triggerPostProcessing(String eventId) {
        System.out.println("Triggering Leaderboard and Certificate generation for event: " + eventId);
    }

    // --- Helper ---

    private void logAction(String entityId, String entityType, String action, User actor, String comments) {
        GovernanceLog log = new GovernanceLog();
        log.setEntityId(entityId);
        log.setEntityType(entityType);
        log.setAction(action);
        log.setActor(actor);
        log.setComments(comments);
        log.setTimestamp(LocalDateTime.now());
        governanceLogRepository.save(log);
    }
}
