package com.eventmanager.repository;

import com.eventmanager.model.ClubEventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubEventRegistrationRepository extends JpaRepository<ClubEventRegistration, String> {
    List<ClubEventRegistration> findByClubEventId(String clubEventId);
    List<ClubEventRegistration> findByStudentId(String studentId);
    Optional<ClubEventRegistration> findByClubEventIdAndStudentId(String clubEventId, String studentId);
    long countByClubEventId(String clubEventId);
    List<ClubEventRegistration> findByClubEventIdAndAttendanceStatus(String clubEventId, String status);
}
