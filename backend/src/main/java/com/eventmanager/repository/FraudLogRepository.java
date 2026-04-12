package com.eventmanager.repository;

import com.eventmanager.model.FraudLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudLogRepository extends JpaRepository<FraudLog, String> {
    List<FraudLog> findByAmbassadorIdOrderByDetectedAtDesc(String ambassadorId);
    List<FraudLog> findByAmbassadorId(String ambassadorId);
}
