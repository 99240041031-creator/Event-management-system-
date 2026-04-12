package com.eventmanager.repository;

import com.eventmanager.model.ClubHackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubHackathonRepository extends JpaRepository<ClubHackathon, String> {
    List<ClubHackathon> findByClubId(String clubId);
    List<ClubHackathon> findByClubIdOrderByStartDateDesc(String clubId);
    List<ClubHackathon> findByClubIdAndStatus(String clubId, String status);
}
