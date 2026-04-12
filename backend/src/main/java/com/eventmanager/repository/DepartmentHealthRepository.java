package com.eventmanager.repository;

import com.eventmanager.model.DepartmentHealth;
import com.eventmanager.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DepartmentHealthRepository extends JpaRepository<DepartmentHealth, String> {
    Optional<DepartmentHealth> findByDepartment(Department department);
}
