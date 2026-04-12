package com.eventmanager.service;

import com.eventmanager.model.Club;
import com.eventmanager.model.ClubAnnouncement;
import com.eventmanager.model.ClubMembership;
import com.eventmanager.model.ClubJoinRequest;
import com.eventmanager.model.RecruitmentNotice;
import java.util.List;
import java.util.Optional;

public interface ClubService {
    List<Club> getAllClubs();

    List<Club> getClubsByCollege(String collegeId);

    List<Club> getClubsByFacultyAdvisor(String facultyId);

    Optional<Club> getClubById(String id);

    Club createClub(Club club);

    Club updateClub(String id, Club clubDetails);

    void deleteClub(String id);

    // Announcements
    ClubAnnouncement createAnnouncement(String clubId, String authorId, String title, String content);

    List<ClubAnnouncement> getClubAnnouncements(String clubId);

    // Memberships
    ClubMembership joinClub(String clubId, String userId);

    List<ClubMembership> getClubMembers(String clubId);

    List<ClubMembership> getUserClubs(String userId);

    void updateMembershipRole(String membershipId, String role);

    // Recruitment & Join Requests
    RecruitmentNotice createRecruitmentNotice(String clubId, String title, String description, String role,
            String requirements, java.time.LocalDateTime deadline);

    List<RecruitmentNotice> getClubRecruitmentNotices(String clubId);

    List<RecruitmentNotice> getAllOpenRecruitments();

    ClubJoinRequest submitJoinRequest(String clubId, String userId, String message);

    List<ClubJoinRequest> getClubJoinRequests(String clubId);

    ClubJoinRequest updateJoinRequestStatus(String requestId, String status);

    // Faculty Management Extensions
    Club toggleRecruitment(String clubId, boolean isOpen);
    
    // Budget
    com.eventmanager.model.ClubBudget getClubBudget(String clubId);
    com.eventmanager.model.ClubBudget updateClubBudget(String clubId, Double allocated, Double spent, Double revenue);
    
    // Club Events (Specific to Club entity)
    List<com.eventmanager.model.ClubEvent> getClubEvents(String clubId);
    com.eventmanager.model.ClubEvent createClubEvent(com.eventmanager.model.ClubEvent event);
    
    // Club Hackathons
    List<com.eventmanager.model.ClubHackathon> getClubHackathons(String clubId);
    com.eventmanager.model.ClubHackathon createClubHackathon(com.eventmanager.model.ClubHackathon hackathon);
    
    // Club Hackathon Management
    com.eventmanager.model.ClubHackathonTeam registerClubHackathonTeam(String hackathonId, String teamName, List<String> studentIds);
    com.eventmanager.model.ClubHackathonTeam scoreClubHackathonTeam(String teamId, Double score, String feedback);
    List<com.eventmanager.model.ClubHackathonTeam> getClubHackathonLeaderboard(String hackathonId);
    // Ambassadors
    com.eventmanager.model.ClubAmbassador addAmbassador(String clubId, String studentId);
    List<com.eventmanager.model.ClubAmbassador> getClubAmbassadors(String clubId);

    // Certificates
    void generateCertificatesForEvent(String clubId, String eventId);
    List<com.eventmanager.model.ClubCertificate> getClubCertificates(String clubId);
    String generateCertificateId();
    com.eventmanager.model.ClubCertificate verifyCertificate(String certificateId);
    void revokeCertificate(String certificateId);
    
    // Analytics
    java.util.Map<String, Object> getClubAnalytics(String clubId);
    
    // Event Registration & Attendance
    com.eventmanager.model.ClubEventRegistration registerForEvent(String eventId, String studentId);
    List<com.eventmanager.model.ClubEventRegistration> getEventParticipants(String eventId);
    void markAttendance(String eventId, String studentId, String status);
    
    // Recruitment Advanced
    void updateJoinRequestScore(String requestId, Double score);
    List<com.eventmanager.model.ClubMembership> bulkApproveApplications(List<String> requestIds);
    
    // Export
    List<com.eventmanager.model.ClubMembership> exportMembers(String clubId);
}
