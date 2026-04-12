package com.eventmanager.service;

import com.eventmanager.model.Club;
import com.eventmanager.model.ClubHeadAssignment;
import com.eventmanager.model.User;
import com.eventmanager.repository.ClubHeadAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ClubHeadAssignmentService {

    @Autowired
    private ClubHeadAssignmentRepository clubHeadAssignmentRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public void assignClubHead(User faculty, Club club, User actor) {
        // Deactivate existing if any (simplified policy: one head per club)
        clubHeadAssignmentRepository.findByFacultyIdAndClubIdAndIsActiveTrue(faculty.getId(), club.getId())
                .ifPresent(a -> {
                    a.setActive(false);
                    clubHeadAssignmentRepository.save(a);
                });

        ClubHeadAssignment assignment = new ClubHeadAssignment();
        assignment.setFaculty(faculty);
        assignment.setClub(club);
        assignment.setActive(true);
        clubHeadAssignmentRepository.save(assignment);

        auditLogService.log("ASSIGN_CLUB_HEAD",
                "Club", club.getId(),
                "Faculty " + faculty.getEmail() + " assigned as head of club " + club.getName(),
                null);
    }

    public boolean isClubHead(User faculty, String clubId) {
        return clubHeadAssignmentRepository.findByFacultyIdAndClubIdAndIsActiveTrue(faculty.getId(), clubId)
                .isPresent();
    }

    public List<ClubHeadAssignment> getFacultyAssignments(String facultyId) {
        return clubHeadAssignmentRepository.findByFacultyIdAndIsActiveTrue(facultyId);
    }
}
