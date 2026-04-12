package com.eventmanager.repository;

import com.eventmanager.model.JudgeScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JudgeScoreRepository extends JpaRepository<JudgeScore, String> {
    List<JudgeScore> findBySubmission_Id(String submissionId);

    List<JudgeScore> findByJudge_Id(String judgeId);

    java.util.Optional<JudgeScore> findByJudge_IdAndSubmission_IdAndHackathonRound_Id(
            String judgeId, String submissionId, String roundId);

    java.util.Optional<JudgeScore> findByJudgeAndSubmission(com.eventmanager.model.User judge,
            com.eventmanager.model.Submission submission);
}
