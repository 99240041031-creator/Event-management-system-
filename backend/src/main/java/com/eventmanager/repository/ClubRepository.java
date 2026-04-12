package com.eventmanager.repository;

import com.eventmanager.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, String> {
    List<Club> findByCollegeId(String collegeId);
    List<Club> findByFacultyAdvisorId(String facultyId);

    List<Club> findByIsActiveTrue();

    List<Club> findByDepartment_Id(String departmentId);
    long countByDepartment_IdAndStatus(String departmentId, String status);
}
