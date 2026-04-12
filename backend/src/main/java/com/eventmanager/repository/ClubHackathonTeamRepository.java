package com.eventmanager.repository;

import com.eventmanager.model.ClubHackathonTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubHackathonTeamRepository extends JpaRepository<ClubHackathonTeam, String> {
    List<ClubHackathonTeam> findByHackathonId(String hackathonId);
    List<ClubHackathonTeam> findByHackathonIdOrderByTotalScoreDesc(String hackathonId);
}
