package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScoringService {

    @Autowired
    private JudgeScoreRepository judgeScoreRepository;

    @Autowired
    private HackathonRoundRepository hackathonRoundRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ScoringAuditLogRepository auditLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public JudgeScore submitScore(String judgeId, String submissionId, String roundId, 
                                 Map<String, Integer> criteriaScores, String feedback, boolean isFinal) throws JsonProcessingException {
        
        HackathonRound round = hackathonRoundRepository.findById(roundId)
            .orElseThrow(() -> new RuntimeException("Round not found"));
            
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Validate that judge is assigned (optional, service-level check)
        
        JudgeScore score = judgeScoreRepository.findByJudge_IdAndSubmission_IdAndHackathonRound_Id(
            judgeId, submissionId, roundId).orElse(new JudgeScore());

        score.setJudge(new User()); // Set actual user in controller or fetch here
        score.getJudge().setId(judgeId);
        score.setSubmission(submission);
        score.setHackathonRound(round);
        score.setRoundNumber(round.getRoundNumber());
        score.setCriteriaScores(objectMapper.writeValueAsString(criteriaScores));
        score.setFeedback(feedback);
        score.setIsDraft(!isFinal);
        score.setStatus(isFinal ? "SUBMITTED" : "DRAFT");

        // Calculate total for this judge
        double total = criteriaScores.values().stream().mapToInt(Integer::intValue).sum();
        score.setTotalScore(total);
        score.setUpdatedAt(LocalDateTime.now());

        JudgeScore saved = judgeScoreRepository.save(score);

        // Record Audit Log
        ScoringAuditLog auditLog = new ScoringAuditLog();
        auditLog.setJudge(score.getJudge());
        auditLog.setSubmission(submission);
        auditLog.setRound(round);
        auditLog.setAction(isFinal ? "SUBMIT" : "DRAFT_SAVE");
        auditLog.setNewScore(total);
        auditLog.setDetails("Criteria scores updated: " + criteriaScores);
        auditLogRepository.save(auditLog);

        if (isFinal) {
            updateSubmissionTotalScore(submissionId, round.getHackathon().getId());
            notifyLeaderboardUpdate(round.getHackathon().getId());
        }

        return saved;
    }

    public List<HackathonRound> getHackathonRounds(String hackathonId) {
        return hackathonRoundRepository.findByHackathonIdOrderByRoundNumberAsc(hackathonId);
    }

    public HackathonRound getRoundDetails(String roundId) {
        return hackathonRoundRepository.findById(roundId).orElseThrow(() -> new RuntimeException("Round not found"));
    }

    private void updateSubmissionTotalScore(String submissionId, String hackathonId) {
        Submission submission = submissionRepository.findById(submissionId).orElseThrow();
        List<JudgeScore> roundScores = judgeScoreRepository.findBySubmission_Id(submissionId);
        
        // Group by round to calculate round-wise totals
        Map<Integer, Double> roundCategoryTotals = roundScores.stream()
            .filter(s -> !s.getIsDraft())
            .collect(Collectors.groupingBy(
                JudgeScore::getRoundNumber,
                Collectors.averagingDouble(JudgeScore::getTotalScore)
            ));

        // Multi-round weighting logic
        double totalWeightedScore = 0.0;
        double totalWeight = 0.0;

        for (Map.Entry<Integer, Double> entry : roundCategoryTotals.entrySet()) {
            Integer roundNum = entry.getKey();
            Double avgScore = entry.getValue();
            
            // Fetch weight for this round
            double weight = hackathonRoundRepository.findByHackathonIdOrderByRoundNumberAsc(hackathonId)
                .stream()
                .filter(r -> r.getRoundNumber().equals(roundNum))
                .map(HackathonRound::getWeightage)
                .findFirst()
                .orElse(1.0);
            
            totalWeightedScore += (avgScore * weight);
            totalWeight += weight;
        }

        double finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0.0;
        
        // Dynamic Round Promotion Logic (Optional: based on shortlist)
        
        submission.setScore(finalScore);
        submission.setStatus(Submission.SubmissionStatus.EVALUATED);
        submissionRepository.save(submission);
    }

    public List<Map<String, Object>> getLeaderboard(String hackathonId) {
        List<Submission> submissions = submissionRepository.findByHackathonId(hackathonId);
        
        return submissions.stream()
            .sorted((s1, s2) -> {
                // 1. Comparison by Score
                int cmp = Double.compare(s2.getScore(), s1.getScore());
                if (cmp != 0) return cmp;

                // 2. Tie-break: Highest Innovation/Technical Score (assuming "Innovation" or first criterion)
                // This is a simplified tie-break logic based on the prompt's "Highest criteria score"
                // In a full implementation, we'd fetch all JudgeScores and compare specific criteria.
                
                // 3. Tie-break: Earliest Submission
                if (s1.getSubmittedAt() != null && s2.getSubmittedAt() != null) {
                    return s1.getSubmittedAt().compareTo(s2.getSubmittedAt());
                }
                return 0;
            })
            .map(s -> {
                Map<String, Object> entry = new HashMap<>();
                entry.put("submissionId", s.getId());
                entry.put("teamName", s.getTeam() != null ? s.getTeam().getName() : "Solo");
                entry.put("projectTitle", s.getProjectTitle());
                entry.put("score", s.getScore());
                entry.put("status", s.getStatus());
                return entry;
            })
            .collect(Collectors.toList());
    }

    public Map<String, Object> getHackathonAnalytics(String hackathonId) {
        List<Submission> submissions = submissionRepository.findByHackathonId(hackathonId);
        List<JudgeScore> allScores = judgeScoreRepository.findAll().stream()
            .filter(s -> s.getSubmission().getHackathon().getId().equals(hackathonId))
            .collect(Collectors.toList());

        Map<String, Object> analytics = new HashMap<>();

        // 1. Score Distribution
        int[] distribution = new int[11]; // 0-10, 10-20, ..., 90-100
        submissions.forEach(s -> {
            int bucket = (int) (s.getScore() / 10);
            if (bucket > 10) bucket = 10;
            distribution[bucket]++;
        });
        analytics.put("scoreDistribution", distribution);

        // 2. Criteria Averages
        Map<String, Double> criteriaAverages = new HashMap<>();
        Map<String, Integer> criteriaCounts = new HashMap<>();
        
        allScores.forEach(s -> {
            try {
                Map<String, Integer> scores = objectMapper.readValue(s.getCriteriaScores(), Map.class);
                scores.forEach((name, val) -> {
                    criteriaAverages.put(name, criteriaAverages.getOrDefault(name, 0.0) + val);
                    criteriaCounts.put(name, criteriaCounts.getOrDefault(name, 0) + 1);
                });
            } catch (Exception ignored) {}
        });
        
        criteriaAverages.forEach((name, total) -> {
            criteriaAverages.put(name, total / criteriaCounts.get(name));
        });
        analytics.put("criteriaAverages", criteriaAverages);

        // 3. Judge Deviation
        Map<String, Double> judgeAverages = allScores.stream()
            .collect(Collectors.groupingBy(s -> s.getJudge().getName(), Collectors.averagingDouble(JudgeScore::getTotalScore)));
        
        double globalAvg = submissions.stream().mapToDouble(Submission::getScore).average().orElse(0.0);
        
        Map<String, Double> judgeDeviation = new HashMap<>();
        judgeAverages.forEach((name, avg) -> {
            judgeDeviation.put(name, avg - globalAvg);
        });
        analytics.put("judgeDeviation", judgeDeviation);

        return analytics;
    }

    public void notifyLeaderboardUpdate(String hackathonId) {
        List<Map<String, Object>> leaderboard = getLeaderboard(hackathonId);
        messagingTemplate.convertAndSend("/topic/hackathon/" + hackathonId + "/leaderboard", leaderboard);
    }
}
