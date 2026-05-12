package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.security.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

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

    @Transactional(rollbackFor = Exception.class)
    public void submitForApproval(String eventId, User actor) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        // Step 2: Faculty Supervision (Implicit if faculty creates)
        if (Roles.FACULTY.equals(actor.getRole())) {
            event.setStatus("HOD_APPROVAL_PENDING");
            eventRepository.save(event);
            logAction(eventId, "EVENT", "SUBMIT_FOR_APPROVAL", actor, "Faculty submitted event for HOD approval");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void approveEvent(String eventId, User actor, String comments) {
        if (!Roles.HOD.equalsIgnoreCase(actor.getDirectorRole()) && 
            !Roles.HOD.equalsIgnoreCase(actor.getRole()) && 
            !Roles.DIRECTOR.equalsIgnoreCase(actor.getRole()) &&
            !Roles.COLLEGE_ADMIN.equalsIgnoreCase(actor.getRole()) &&
            !Roles.SUPER_ADMIN.equalsIgnoreCase(actor.getRole())) {
            throw new RuntimeException("Only HOD, Director or Admin can approve events");
        }

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            // Strict Check: Must be pending approval
            if (!"HOD_APPROVAL_PENDING".equals(event.getStatus()) && !"PENDING".equals(event.getStatus())) {
                throw new RuntimeException("Event is not pending approval. Current status: " + event.getStatus());
            }

            event.setStatus("ACTIVE"); // Step 7: HOD Approves
            eventRepository.save(event);
            logActionWithEntity(eventId, "EVENT", "APPROVE", actor, comments, event, null);

            auditLogService.log("EVENT_APPROVED", "Event " + event.getTitle() + " approved exclusively by HOD", actor,
                    "Event", eventId);
        } else {
            System.out.println("[MOCK_APPROVAL] Mock approval used for ID: " + eventId);
        }

    }

    @Transactional(rollbackFor = Exception.class)
    public void approveHackathon(String hackathonId, User actor, String comments) {
        if (!Roles.HOD.equalsIgnoreCase(actor.getDirectorRole()) && 
            !Roles.HOD.equalsIgnoreCase(actor.getRole()) && 
            !Roles.DIRECTOR.equalsIgnoreCase(actor.getRole()) &&
            !Roles.COLLEGE_ADMIN.equalsIgnoreCase(actor.getRole()) &&
            !Roles.SUPER_ADMIN.equalsIgnoreCase(actor.getRole())) {
            throw new RuntimeException("Only HOD, Director or Admin can approve hackathons");
        }

        Optional<Hackathon> hackathonOpt = hackathonRepository.findById(hackathonId);
        
        if (hackathonOpt.isPresent()) {
            Hackathon hackathon = hackathonOpt.get();
            if (!"HOD_APPROVAL_PENDING".equals(hackathon.getApprovalStatus()) && !"PENDING".equals(hackathon.getApprovalStatus())) {
                throw new RuntimeException("Hackathon is not pending approval. Current status: " + hackathon.getApprovalStatus());
            }

            hackathon.setApprovalStatus("APPROVED");
            hackathon.setStatus("ACTIVE");
            hackathonRepository.save(hackathon);
            logActionWithEntity(hackathonId, "HACKATHON", "APPROVE", actor, comments, null, hackathon);

            auditLogService.log("HACKATHON_APPROVED", "Hackathon " + hackathon.getTitle() + " approved exclusively by HOD",
                    actor, "Hackathon", hackathonId);
        } else {
            System.out.println("[MOCK_APPROVAL] Mock approval used for ID: " + hackathonId);
        }

    }

    // --- 2. Judge Management (Step 3) ---

    @Transactional(rollbackFor = Exception.class)
    public void assignJudge(String eventId, String judgeId, User actor) {
        // Only Director (HOD/Admin) can add judges
        if (actor.getDirectorRole() == null && 
            !Roles.HOD.equalsIgnoreCase(actor.getRole()) && 
            !Roles.DIRECTOR.equalsIgnoreCase(actor.getRole()) &&
            !Roles.COLLEGE_ADMIN.equalsIgnoreCase(actor.getRole())) {
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

    @Transactional(rollbackFor = Exception.class)
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

    @Transactional(rollbackFor = Exception.class)
    public void lockScores(String eventId, User actor, String comments) {
        // Step 7: HOD Finalizes and Locks
        if (!Roles.HOD.equalsIgnoreCase(actor.getDirectorRole()) && 
            !Roles.HOD.equalsIgnoreCase(actor.getRole()) &&
            !Roles.DIRECTOR.equalsIgnoreCase(actor.getRole())) {
            throw new RuntimeException("Only HOD or Director can lock scores");
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
        logActionWithEntity(entityId, entityType, action, actor, comments, null, null);
    }

    private void logActionWithEntity(String entityId, String entityType, String action, User actor, String comments, Event event, Hackathon hackathon) {
        GovernanceLog log = new GovernanceLog();
        log.setEntityId(entityId);
        log.setEntityType(entityType);
        log.setAction(action);
        log.setActor(actor);
        log.setComments(comments);
        log.setTargetEvent(event);
        log.setTargetHackathon(hackathon);
        log.setTimestamp(LocalDateTime.now());
        governanceLogRepository.save(log);
        governanceLogRepository.flush(); // Force immediate database check
    }
}
