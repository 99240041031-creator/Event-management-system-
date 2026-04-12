package com.eventmanager.repository;

import com.eventmanager.model.ClubBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubBudgetRepository extends JpaRepository<ClubBudget, String> {
    Optional<ClubBudget> findByClubId(String clubId);
}
