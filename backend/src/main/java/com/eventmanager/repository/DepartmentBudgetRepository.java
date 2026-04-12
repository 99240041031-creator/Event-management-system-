package com.eventmanager.repository;

import com.eventmanager.model.DepartmentBudget;
import com.eventmanager.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DepartmentBudgetRepository extends JpaRepository<DepartmentBudget, String> {
    Optional<DepartmentBudget> findByDepartment(Department department);
}
