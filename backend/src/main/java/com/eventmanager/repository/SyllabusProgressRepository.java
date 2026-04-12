package com.eventmanager.repository;

import com.eventmanager.model.SyllabusProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusProgressRepository extends JpaRepository<SyllabusProgress, String> {
    List<SyllabusProgress> findByFacultyId(String facultyId);
    List<SyllabusProgress> findBySubjectId(String subjectId);
}
