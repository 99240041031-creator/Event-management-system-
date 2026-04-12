package com.eventmanager.repository;

import com.eventmanager.model.ClubEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubEventRepository extends JpaRepository<ClubEvent, String> {
    List<ClubEvent> findByClubId(String clubId);
    List<ClubEvent> findByClubIdOrderByStartDateDesc(String clubId);
    List<ClubEvent> findByClubIdAndStatus(String clubId, String status);
    long countByClubId(String clubId);
    long countByClubIdAndStatus(String clubId, String status);
}
