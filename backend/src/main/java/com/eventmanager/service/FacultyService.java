package com.eventmanager.service;

import com.eventmanager.dto.AnalyticsDto;
import com.eventmanager.dto.DashboardSummaryDto;
import com.eventmanager.dto.EventRegistrationDto;
import com.eventmanager.dto.FacultyStatsDto;
import com.eventmanager.dto.LeaderboardEntryDto;
import com.eventmanager.dto.StudentAnalyticsDto;
import com.eventmanager.model.Certificate;
import com.eventmanager.model.Event;
import com.eventmanager.model.Hackathon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface FacultyService {
    
    /**
     * Get dashboard statistics for a faculty member
     */
    FacultyStatsDto getDashboardStats(String facultyId);
    
    /**
     * Get dashboard summary with comprehensive metrics
     */
    DashboardSummaryDto getDashboardSummary(String facultyId);
    
    /**
     * Get analytics data for faculty
     */
    AnalyticsDto getAnalytics(String facultyId, int days);
    
    /**
     * Get all events created by a faculty member
     */
    Page<Event> getFacultyEvents(String facultyId, Pageable pageable);
    
    /**
     * Get all hackathons created by a faculty member
     */
    Page<Hackathon> getFacultyHackathons(String facultyId, Pageable pageable);
    
    /**
     * Get students under a faculty member's supervision
     */
    List<Object> getFacultyStudents(String facultyId);
    
    /**
     * Get recent activity for a faculty member
     */
    List<Object> getRecentActivity(String facultyId, int limit);
    
    /**
     * Get event registrations
     */
    List<EventRegistrationDto> getEventRegistrations(String eventId, String facultyId);
    
    /**
     * Mark attendance for event
     */
    void markAttendance(String eventId, List<String> userIds, String facultyId);
    
    /**
     * Get hackathon teams
     */
    List<Object> getHackathonTeams(String hackathonId, String facultyId);
    
    /**
     * Get hackathon leaderboard
     */
    List<LeaderboardEntryDto> getHackathonLeaderboard(String hackathonId, String facultyId);
    
    /**
     * Score a submission
     */
    void scoreSubmission(String submissionId, Map<String, Object> scoreData, String facultyId);
    
    /**
     * Get student analytics
     */
    StudentAnalyticsDto getStudentAnalytics(String studentId, String facultyId);
    
    /**
     * Generate certificates
     */
    void generateCertificates(String eventId, List<String> userIds, String facultyId);
    
    /**
     * Get certificates issued by faculty
     */
    Page<Certificate> getCertificates(String facultyId, Pageable pageable);
    
    /**
     * Revoke a certificate
     */
    void revokeCertificate(String certificateId, String facultyId);
}
