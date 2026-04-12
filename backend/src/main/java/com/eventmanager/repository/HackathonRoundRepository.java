package com.eventmanager.repository;

import com.eventmanager.model.HackathonRound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HackathonRoundRepository extends JpaRepository<HackathonRound, String> {
    List<HackathonRound> findByHackathonIdOrderByRoundNumberAsc(String hackathonId);
}
