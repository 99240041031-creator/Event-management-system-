package com.eventmanager.controller;

import com.eventmanager.model.JudgeScore;
import com.eventmanager.model.ScoreLock;
import com.eventmanager.service.EvaluationService;
import com.eventmanager.service.ScoreLockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private ScoreLockService scoreLockService;

    @PostMapping("/submit/{submissionId}")
    @PreAuthorize("hasRole('DIRECTOR') or hasRole('JUDGE')")
    public ResponseEntity<?> submitScore(
            @PathVariable String submissionId,
            @RequestBody Map<String, Object> payload) {

        String criteriaScores = (String) payload.get("criteriaScores");
        // Handle number to double conversion safely
        Double totalScore = 0.0;
        if (payload.get("totalScore") instanceof Number) {
            totalScore = ((Number) payload.get("totalScore")).doubleValue();
        }

        String feedback = (String) payload.get("feedback");
        Boolean isDraft = (Boolean) payload.get("isDraft");

        JudgeScore score = evaluationService.submitScore(submissionId, criteriaScores, totalScore, feedback, isDraft);
        return ResponseEntity.ok(score);
    }

    @GetMapping("/submission/{submissionId}")
    @PreAuthorize("hasAnyRole('DIRECTOR', 'JUDGE', 'FACULTY', 'HOD')")
    // Faculty/HOD can view scores too
    public ResponseEntity<?> getScore(@PathVariable String submissionId) {
        return evaluationService.getScoreForSubmission(submissionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping("/lock/{eventId}")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<ScoreLock> lockScores(@PathVariable String eventId) {
        return ResponseEntity.ok(scoreLockService.lockEventScores(eventId));
    }

    @GetMapping("/lock/{eventId}/status")
    public ResponseEntity<Boolean> getLockStatus(@PathVariable String eventId) {
        return ResponseEntity.ok(scoreLockService.isEventLocked(eventId));
    }

    @Autowired
    private com.eventmanager.repository.ScoreRubricRepository scoreRubricRepository;

    @Autowired
    private com.eventmanager.service.LeaderboardService leaderboardService;

    @GetMapping("/rubric/{eventId}")
    public ResponseEntity<java.util.List<com.eventmanager.model.ScoreRubric>> getRubric(@PathVariable String eventId) {
        return ResponseEntity.ok(scoreRubricRepository.findByEventId(eventId));
    }

    @PostMapping("/rubric")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY')")
    public ResponseEntity<?> createRubric(@RequestBody java.util.List<com.eventmanager.model.ScoreRubric> rubrics) {
        return ResponseEntity.ok(scoreRubricRepository.saveAll(rubrics));
    }

    @GetMapping("/leaderboard/{eventId}")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY', 'DEAN_OF_CAMPUS', 'AMBASSADOR', 'STUDENT')")
    public ResponseEntity<java.util.List<Map<String, Object>>> getLeaderboard(@PathVariable String eventId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(eventId));
    }

    @GetMapping("/pending-summary")
    @PreAuthorize("hasAnyRole('HOD', 'DIRECTOR')")
    public ResponseEntity<java.util.List<Map<String, Object>>> getPendingSummary() {
        // Find all events that have submitted scores but are not locked
        // This is a simplified version.
        // For each active event, count pending (submitted) scores
        // We'll need EventRepository here.
        // Let's just use EvaluationService to get counts.
        return ResponseEntity.ok(evaluationService.getPendingSummaryForHOD());
    }

    @GetMapping("/pending/{eventId}")
    @PreAuthorize("hasAnyRole('HOD', 'DIRECTOR')")
    public ResponseEntity<java.util.List<com.eventmanager.model.JudgeScore>> getPendingScores(
            @PathVariable String eventId) {
        return ResponseEntity.ok(evaluationService.getSubmittedScoresByEvent(eventId));
    }

    @Autowired
    private com.eventmanager.service.GovernanceService governanceService;

    @Autowired
    private com.eventmanager.repository.UserRepository userRepository;

    @GetMapping("/judges")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY', 'DIRECTOR')")
    public ResponseEntity<java.util.List<com.eventmanager.model.User>> getAllJudges() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> "JUDGE".equalsIgnoreCase(u.getSubRole()))
                .collect(java.util.stream.Collectors.toList()));
    }

    @PostMapping("/assign/{eventId}")
    @PreAuthorize("hasAnyRole('HOD', 'DIRECTOR')")
    public ResponseEntity<?> assignJudge(@PathVariable String eventId, @RequestParam String judgeId) {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        String currentEmail = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        com.eventmanager.model.User actor = userRepository.findByEmail(currentEmail).orElseThrow();

        governanceService.assignJudge(eventId, judgeId, actor);
        return ResponseEntity.ok("Judge assigned successfully");
    }
}
