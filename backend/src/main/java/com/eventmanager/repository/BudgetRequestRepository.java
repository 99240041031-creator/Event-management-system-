package com.eventmanager.repository;

import com.eventmanager.model.BudgetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRequestRepository extends JpaRepository<BudgetRequest, String> {
    List<BudgetRequest> findByDepartmentId(String departmentId);
    List<BudgetRequest> findByStatus(String status);
}
