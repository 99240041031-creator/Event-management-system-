package com.eventmanager.controller;

import com.eventmanager.model.JudgeScore;
import com.eventmanager.model.ScoreLock;
import com.eventmanager.model.ScoreRubric;
import com.eventmanager.model.User;
import com.eventmanager.repository.ScoreRubricRepository;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.service.EvaluationService;
import com.eventmanager.service.GovernanceService;
import com.eventmanager.service.LeaderboardService;
import com.eventmanager.service.ScoreLockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private ScoreLockService scoreLockService;

    @Autowired
    private ScoreRubricRepository scoreRubricRepository;

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private GovernanceService governanceService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit/{submissionId}")
    @PreAuthorize("hasRole('DIRECTOR') or hasRole('JUDGE')")
    public ResponseEntity<?> submitScore(
            @PathVariable String submissionId,
            @RequestBody Map<String, Object> payload) {

        String criteriaScores = (String) payload.get("criteriaScores");
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

    @GetMapping("/rubric/{eventId}")
    public ResponseEntity<List<ScoreRubric>> getRubric(@PathVariable String eventId) {
        return ResponseEntity.ok(scoreRubricRepository.findByEventId(eventId));
    }

    @PostMapping("/rubric")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY')")
    public ResponseEntity<?> createRubric(@RequestBody List<ScoreRubric> rubrics) {
        return ResponseEntity.ok(scoreRubricRepository.saveAll(rubrics));
    }

    @GetMapping("/leaderboard/{eventId}")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY', 'DEAN_OF_CAMPUS', 'AMBASSADOR', 'STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(@PathVariable String eventId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(eventId));
    }

    @GetMapping("/pending-summary")
    @PreAuthorize("hasAnyRole('HOD', 'DIRECTOR')")
    public ResponseEntity<List<Map<String, Object>>> getPendingSummary() {
        return ResponseEntity.ok(evaluationService.getPendingSummaryForHOD());
    }

    @GetMapping("/pending/{eventId}")
    @PreAuthorize("hasAnyRole('HOD', 'DIRECTOR')")
    public ResponseEntity<List<JudgeScore>> getPendingScores(@PathVariable String eventId) {
        return ResponseEntity.ok(evaluationService.getSubmittedScoresByEvent(eventId));
    }

    @GetMapping("/judges")
    @PreAuthorize("hasAnyRole('HOD', 'FACULTY', 'DIRECTOR')")
    public ResponseEntity<List<User>> getAllJudges() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> "JUDGE".equalsIgnoreCase(u.getSubRole()))
                .collect(Collectors.toList()));
    }

    @PostMapping("/assign/{eventId}")
    @PreAuthorize("hasAnyRole('HOD', 'DIRECTOR')")
    public ResponseEntity<?> assignJudge(@PathVariable String eventId, @RequestParam String judgeId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentEmail = ((UserDetails) principal).getUsername();
        User actor = userRepository.findByEmail(currentEmail).orElseThrow();

        governanceService.assignJudge(eventId, judgeId, actor);
        return ResponseEntity.ok("Judge assigned successfully");
    }
}
