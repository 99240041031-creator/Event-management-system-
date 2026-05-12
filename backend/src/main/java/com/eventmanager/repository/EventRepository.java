package com.eventmanager.repository;

import com.eventmanager.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByOrganizer_Id(String organizerId);
    Page<Event> findByOrganizer_Id(String organizerId, Pageable pageable);
    long countByOrganizer_Id(String organizerId);
    long countByOrganizer_IdAndStatus(String organizerId, String status);
    long countByOrganizer_IdAndCreatedAtAfter(String organizerId, java.time.LocalDateTime createdAt);
    long countByOrganizer_IdAndCreatedAtBetween(String organizerId, java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<Event> findByDepartment_Id(String departmentId);
    long countByDepartment_IdAndStatus(String departmentId, String status);
    long countByCollege_Id(String collegeId);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(e) FROM Event e WHERE e.organizer.id = :facultyId")
    long countByFacultyId(String facultyId);
}
