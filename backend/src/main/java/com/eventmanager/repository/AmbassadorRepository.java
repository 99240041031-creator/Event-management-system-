package com.eventmanager.repository;

import com.eventmanager.model.Ambassador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmbassadorRepository extends JpaRepository<Ambassador, String> {
    List<Ambassador> findByClubId(String clubId);
    List<Ambassador> findByClubIdOrderByImpactScoreDesc(String clubId);
}
