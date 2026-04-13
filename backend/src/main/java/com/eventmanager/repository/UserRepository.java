package com.eventmanager.repository;

import com.eventmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByDepartmentAndRole(String department, String role);
    long countByDepartmentAndRole(String department, String role);
    java.util.List<User> findByRole(String role);
}
