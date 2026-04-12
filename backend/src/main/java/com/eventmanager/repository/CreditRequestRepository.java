package com.eventmanager.repository;

import com.eventmanager.model.CreditRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditRequestRepository extends JpaRepository<CreditRequest, String> {
    List<CreditRequest> findByStudentId(String studentId);
    List<CreditRequest> findByStatus(String status);
}
