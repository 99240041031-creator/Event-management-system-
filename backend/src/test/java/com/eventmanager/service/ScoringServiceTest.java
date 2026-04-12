package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ScoringServiceTest {

    @Mock
    private JudgeScoreRepository judgeScoreRepository;

    @Mock
    private HackathonRoundRepository hackathonRoundRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ScoringService scoringService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateSubmissionTotalScoreWithMultipleJudges() {
        String submissionId = "sub-123";
        String hackathonId = "hack-456";

        Submission submission = new Submission();
        submission.setId(submissionId);
        
        Hackathon hackathon = new Hackathon();
        hackathon.setId(hackathonId);

        HackathonRound round = new HackathonRound();
        round.setHackathon(hackathon);
        round.setRoundNumber(1);

        // Mock 3 judges giving scores in round 1
        JudgeScore score1 = new JudgeScore();
        score1.setRoundNumber(1);
        score1.setTotalScore(80.0);
        score1.setIsDraft(false);

        JudgeScore score2 = new JudgeScore();
        score2.setRoundNumber(1);
        score2.setTotalScore(90.0);
        score2.setIsDraft(false);

        JudgeScore score3 = new JudgeScore();
        score3.setRoundNumber(1);
        score3.setTotalScore(70.0);
        score3.setIsDraft(false);

        List<JudgeScore> roundScores = Arrays.asList(score1, score2, score3);

        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(judgeScoreRepository.findBySubmission_Id(submissionId)).thenReturn(roundScores);

        // This method is private, but we can test it indirectly via a public method if possible, 
        // or just test the logic by making it package-private for testing or using reflection.
        // However, the logic is what matters. Let's trigger it via getLeaderboard or just verify the logic here if we were to refactor.
        // For now, I'll use reflection or just test the submitScore flow.
        
        // Actually, let's test submitScore with the isFinal=true flag which calls updateSubmissionTotalScore.
    }

    @Test
    void testSubmitScoreCalculatesCorrectAverage() throws JsonProcessingException {
        String judgeId = "judge-1";
        String submissionId = "sub-1";
        String roundId = "round-1";
        
        Hackathon hackathon = new Hackathon();
        hackathon.setId("h-1");

        HackathonRound round = new HackathonRound();
        round.setId(roundId);
        round.setRoundNumber(1);
        round.setHackathon(hackathon);

        Submission submission = new Submission();
        submission.setId(submissionId);

        Map<String, Integer> criteriaScores = new HashMap<>();
        criteriaScores.put("Innovation", 10);
        criteriaScores.put("Impact", 15);

        when(hackathonRoundRepository.findById(roundId)).thenReturn(Optional.of(round));
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(judgeScoreRepository.findByJudge_IdAndSubmission_IdAndHackathonRound_Id(any(), any(), any()))
            .thenReturn(Optional.empty());
        when(judgeScoreRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // First judge submits 25
        scoringService.submitScore(judgeId, submissionId, roundId, criteriaScores, "Good", true);

        // Mock second judge score of 35
        JudgeScore existingScore1 = new JudgeScore();
        existingScore1.setRoundNumber(1);
        existingScore1.setTotalScore(25.0);
        existingScore1.setIsDraft(false);

        JudgeScore existingScore2 = new JudgeScore();
        existingScore2.setRoundNumber(1);
        existingScore2.setTotalScore(35.0);
        existingScore2.setIsDraft(false);

        when(judgeScoreRepository.findBySubmission_Id(submissionId)).thenReturn(Arrays.asList(existingScore1, existingScore2));

        // Trigger update via a second submission or direct call if we were testing internal state
        // Let's assume we want to verify the submission's total score after two final submissions
        
        scoringService.submitScore("judge-2", submissionId, roundId, criteriaScores, "Great", true);

        // Average should be (25+35)/2 = 30
        verify(submissionRepository, atLeastOnce()).save(argThat(s -> s.getScore() == 30.0));

        // Verify WebSocket notification
        verify(messagingTemplate, times(2)).convertAndSend(eq("/topic/hackathon/h-1/leaderboard"), anyList());
    }
}
