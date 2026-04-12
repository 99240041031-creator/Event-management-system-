package com.eventmanager.repository;

import com.eventmanager.model.ScoringAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScoringAuditLogRepository extends JpaRepository<ScoringAuditLog, String> {
    List<ScoringAuditLog> findBySubmission_Id(String submissionId);
    List<ScoringAuditLog> findByJudge_Id(String judgeId);
}
