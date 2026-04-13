package com.eventmanager.controller;

import com.eventmanager.model.JudgeScore;
import com.eventmanager.service.ScoringService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scoring")
@PreAuthorize("hasRole('JUDGE') or hasRole('DIRECTOR')")
public class ScoringController {

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private com.eventmanager.service.ScoringReportService reportService;

    @Autowired
    private com.eventmanager.repository.UserRepository userRepository;

    private String getCurrentUserId() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            return userRepository
                    .findByEmail(((org.springframework.security.core.userdetails.UserDetails) principal).getUsername())
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    @PostMapping("/submit")
    public ResponseEntity<JudgeScore> submitScore(@RequestBody Map<String, Object> payload) throws JsonProcessingException {
        String submissionId = (String) payload.get("submissionId");
        String roundId = (String) payload.get("roundId");
        @SuppressWarnings("unchecked")
        Map<String, Integer> criteriaScores = (Map<String, Integer>) payload.get("criteriaScores");
        String feedback = (String) payload.get("feedback");
        boolean isFinal = (boolean) payload.get("isFinal");

        JudgeScore score = scoringService.submitScore(
            getCurrentUserId(), submissionId, roundId, criteriaScores, feedback, isFinal
        );

        return ResponseEntity.ok(score);
    }

    @GetMapping("/hackathon/{hackathonId}/rounds")
    public ResponseEntity<List<com.eventmanager.model.HackathonRound>> getHackathonRounds(@PathVariable String hackathonId) {
        return ResponseEntity.ok(scoringService.getHackathonRounds(hackathonId));
    }

    @GetMapping("/round/{roundId}")
    public ResponseEntity<com.eventmanager.model.HackathonRound> getRoundDetails(@PathVariable String roundId) {
        return ResponseEntity.ok(scoringService.getRoundDetails(roundId));
    }

    @GetMapping("/leaderboard/{hackathonId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(@PathVariable String hackathonId) {
        return ResponseEntity.ok(scoringService.getLeaderboard(hackathonId));
    }

    @GetMapping("/report/{hackathonId}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String hackathonId) throws Exception {
        byte[] pdf = reportService.generateLeaderboardPdf(hackathonId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=leaderboard.pdf")
                .body(pdf);
    }

    @GetMapping("/analytics/{hackathonId}")
    @PreAuthorize("hasRole('JUDGE') or hasRole('DIRECTOR') or hasRole('FACULTY')")
    public ResponseEntity<Map<String, Object>> getAnalytics(@PathVariable String hackathonId) {
        return ResponseEntity.ok(scoringService.getHackathonAnalytics(hackathonId));
    }
}
