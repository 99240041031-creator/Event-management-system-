package com.eventmanager.repository;

import com.eventmanager.model.HackathonScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HackathonScoreRepository extends JpaRepository<HackathonScore, String> {
    List<HackathonScore> findByTeamId(String teamId);
    Optional<HackathonScore> findByTeamIdAndJudgeId(String teamId, String judgeId);
}
