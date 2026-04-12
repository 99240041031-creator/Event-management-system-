package com.eventmanager.repository;

import com.eventmanager.model.AmbassadorMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmbassadorMetricsRepository extends JpaRepository<AmbassadorMetrics, String> {
    Optional<AmbassadorMetrics> findByUserId(String userId);
}
