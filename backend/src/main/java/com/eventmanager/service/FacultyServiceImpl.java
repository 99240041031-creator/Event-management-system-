package com.eventmanager.service;

import com.eventmanager.dto.AnalyticsDto;
import com.eventmanager.dto.DashboardSummaryDto;
import com.eventmanager.dto.EventRegistrationDto;
import com.eventmanager.dto.FacultyStatsDto;
import com.eventmanager.dto.LeaderboardEntryDto;
import com.eventmanager.dto.StudentAnalyticsDto;
import com.eventmanager.exception.ResourceNotFoundException;
import com.eventmanager.exception.UnauthorizedException;
import com.eventmanager.model.Certificate;
import com.eventmanager.model.Event;
import com.eventmanager.model.EventRegistration;
import com.eventmanager.model.Hackathon;
import com.eventmanager.model.Submission;
import com.eventmanager.model.Team;
import com.eventmanager.model.User;
import com.eventmanager.repository.CertificateRepository;
import com.eventmanager.repository.EventRegistrationRepository;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.HackathonRepository;
import com.eventmanager.repository.SubmissionRepository;
import com.eventmanager.repository.TeamRepository;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.util.QRCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final EventRepository eventRepository;
    private final HackathonRepository hackathonRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final TeamRepository teamRepository;
    private final QRCodeGenerator qrCodeGenerator;

    @Override
    public FacultyStatsDto getDashboardStats(String facultyId) {
        FacultyStatsDto stats = new FacultyStatsDto();

        // Count events created by faculty
        stats.setMyEventsCount(eventRepository.countByOrganizer_Id(facultyId));

        // Count hackathons created by faculty
        stats.setMyHackathonsCount(hackathonRepository.countByOrganizer_Id(facultyId));

        // Count active registrations across all faculty events
        List<Event> facultyEvents = eventRepository.findByOrganizer_Id(facultyId);
        long activeRegistrations = facultyEvents.stream()
                .mapToLong(event -> eventRegistrationRepository.countByEventId(event.getId()))
                .sum();
        stats.setActiveRegistrationsCount(activeRegistrations);

        // Count pending approvals (events in PENDING status)
        stats.setPendingApprovalsCount(
                eventRepository.countByOrganizer_IdAndStatus(facultyId, "PENDING")
        );

        // Count resources uploaded (placeholder)
        stats.setResourcesUploadedCount(0L);

        // Count certificates issued by faculty
        stats.setCertificatesIssuedCount(certificateRepository.countByIssuerId(facultyId));

        // Count unique students who participated
        stats.setStudentParticipationCount(activeRegistrations);

        // Calculate growth metrics
        stats.setEventRegistrationGrowth(calculateGrowthRate(facultyId, "events"));
        stats.setContentDownloadGrowth(18.0);
        stats.setHackathonTeamGrowth(calculateGrowthRate(facultyId, "hackathons"));

        // Recent activity counts (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        stats.setRecentEventRegistrations(
                eventRegistrationRepository.countByEventIdInAndCreatedAtAfter(
                        facultyEvents.stream().map(Event::getId).toList(),
                        weekAgo
                )
        );
        stats.setRecentSubmissions(0L);
        stats.setRecentFeedback(0L);

        return stats;
    }

    @Override
    public DashboardSummaryDto getDashboardSummary(String facultyId) {
        DashboardSummaryDto summary = new DashboardSummaryDto();

        // Basic counts
        summary.setTotalEvents(eventRepository.countByOrganizer_Id(facultyId));
        summary.setTotalHackathons(hackathonRepository.countByOrganizer_Id(facultyId));

        // Active registrations
        List<Event> facultyEvents = eventRepository.findByOrganizer_Id(facultyId);
        long activeRegistrations = facultyEvents.stream()
                .mapToLong(event -> eventRegistrationRepository.countByEventId(event.getId()))
                .sum();
        summary.setActiveRegistrations(activeRegistrations);

        // Pending approvals
        summary.setPendingApprovals(
                eventRepository.countByOrganizer_IdAndStatus(facultyId, "PENDING")
        );

        // Resources and certificates
        summary.setResourcesUploaded(0L); // Pending: Implement when ResourceRepository is available
        summary.setCertificatesIssued(certificateRepository.countByIssuerId(facultyId));
        summary.setStudentParticipationCount(activeRegistrations);

        // Growth metrics
        summary.setEventRegistrationGrowth(calculateGrowthRate(facultyId, "events"));
        summary.setHackathonTeamGrowth(calculateGrowthRate(facultyId, "hackathons"));
        summary.setContentDownloadGrowth(15.0);

        // Recent activity
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        summary.setRecentEventRegistrations(
                eventRegistrationRepository.countByEventIdInAndCreatedAtAfter(
                        facultyEvents.stream().map(Event::getId).toList(),
                        weekAgo
                )
        );
        summary.setRecentSubmissions(0L);
        summary.setRecentFeedback(0L);

        return summary;
    }

    @Override
    public AnalyticsDto getAnalytics(String facultyId, int days) {
        AnalyticsDto analytics = new AnalyticsDto();
        // Overview stats
        analytics.setTotalEvents(eventRepository.countByOrganizer_Id(facultyId));
        analytics.setTotalHackathons(hackathonRepository.countByOrganizer_Id(facultyId));

        List<Event> facultyEvents = eventRepository.findByOrganizer_Id(facultyId);
        long totalParticipants = facultyEvents.stream()
                .mapToLong(event -> eventRegistrationRepository.countByEventId(event.getId()))
                .sum();
        analytics.setTotalParticipants(totalParticipants);

        // Calculate average attendance
        long totalAttended = facultyEvents.stream()
                .mapToLong(event -> eventRegistrationRepository.countByEventIdAndAttended(event.getId(), true))
                .sum();
        analytics.setAvgAttendance(totalParticipants > 0 ? (double) totalAttended / totalParticipants * 100 : 0.0);

        // Event trend data
        analytics.setEventTrend(generateEventTrendData(facultyId, days));

        // Participation by department
        analytics.setParticipationByDepartment(generateDepartmentParticipation(facultyId));

        // Event type distribution
        analytics.setEventTypeDistribution(generateEventTypeDistribution(facultyId));

        // Monthly engagement
        analytics.setMonthlyEngagement(generateMonthlyEngagement(facultyId, days));

        // Performance metrics
        analytics.setEventSuccessRate(calculateEventSuccessRate(facultyId));
        analytics.setHackathonCompletionRate(calculateHackathonCompletionRate(facultyId));
        analytics.setStudentEngagementScore(calculateEngagementScore(facultyId));

        return analytics;
    }

    @Override
    public Page<Event> getFacultyEvents(String facultyId, Pageable pageable) {
        return eventRepository.findByOrganizer_Id(facultyId, pageable);
    }

    @Override
    public Page<Hackathon> getFacultyHackathons(String facultyId, Pageable pageable) {
        return hackathonRepository.findByOrganizer_Id(facultyId, pageable);
    }

    @Override
    public List<Object> getFacultyStudents(String facultyId) {
        List<Event> facultyEvents = eventRepository.findByOrganizer_Id(facultyId);
        List<String> eventIds = facultyEvents.stream().map(Event::getId).toList();

        List<EventRegistration> registrations = eventRegistrationRepository.findByEventIdIn(eventIds);

        // Get unique students
        Set<String> uniqueUserIds = registrations.stream()
                .map(EventRegistration::getUserId)
                .collect(Collectors.toSet());

        List<Object> students = new ArrayList<>();
        uniqueUserIds.forEach(userId -> {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                Map<String, Object> studentInfo = new HashMap<>();
                studentInfo.put("id", user.getId());
                studentInfo.put("name", user.getName() != null ? user.getName() : (user.getFirstName() + " " + user.getLastName()));
                studentInfo.put("email", user.getEmail());
                studentInfo.put("department", user.getDepartment());
                studentInfo.put("college", user.getCollege() != null ? user.getCollege().getName() : "N/A");
                studentInfo.put("eventsAttended", registrations.stream()
                        .filter(r -> r.getUserId().equals(userId) && r.getAttended())
                        .count());
                students.add(studentInfo);
            }
        });

        return students;
    }

    @Override
    public List<Object> getRecentActivity(String facultyId, int limit) {
        List<Object> activities = new ArrayList<>();

        List<Event> facultyEvents = eventRepository.findByOrganizer_Id(facultyId);
        List<String> eventIds = facultyEvents.stream().map(Event::getId).toList();

        List<EventRegistration> recentRegistrations = eventRegistrationRepository
                .findTop10ByEventIdInOrderByCreatedAtDesc(eventIds);

        recentRegistrations.stream().limit(limit).forEach(reg -> {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "registration");
            activity.put("message", "New registration for event");
            activity.put("timestamp", reg.getCreatedAt());
            activity.put("eventId", reg.getEventId());
            activities.add(activity);
        });

        return activities;
    }

    @Override
    public List<EventRegistrationDto> getEventRegistrations(String eventId, String facultyId) {
        // Verify ownership
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to access this event");
        }

        List<EventRegistration> registrations = eventRegistrationRepository.findByEventId(eventId);

        return registrations.stream().map(reg -> {
            EventRegistrationDto dto = new EventRegistrationDto();
            dto.setId(reg.getId());
            dto.setEventId(reg.getEventId());
            dto.setUserId(reg.getUserId());
            dto.setAttended(reg.getAttended());
            dto.setRegisteredAt(reg.getCreatedAt());

            // Get user details
            User user = userRepository.findById(reg.getUserId()).orElse(null);
            if (user != null) {
                dto.setUserName(user.getName() != null ? user.getName() : (user.getFirstName() + " " + user.getLastName()));
                dto.setUserEmail(user.getEmail());
                dto.setDepartment(user.getDepartment());
                dto.setCollege(user.getCollege() != null ? user.getCollege().getName() : "N/A");
            }

            // Check if certificate issued
            dto.setCertificateIssued(certificateRepository.existsByUserIdAndEventId(reg.getUserId(), eventId));

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAttendance(String eventId, List<String> userIds, String facultyId) {
        // Verify ownership
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to modify this event");
        }

        // Mark attendance
        List<EventRegistration> registrations = eventRegistrationRepository.findByEventId(eventId);
        registrations.forEach(reg -> {
            if (userIds.contains(reg.getUserId())) {
                reg.setAttended(true);
                eventRegistrationRepository.save(reg);
            }
        });
    }

    @Override
    public List<Object> getHackathonTeams(String hackathonId, String facultyId) {
        // Verify ownership
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", hackathonId));

        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to access this hackathon");
        }

        List<Team> teams = teamRepository.findByHackathonId(hackathonId);

        return teams.stream().map(team -> {
            Map<String, Object> teamInfo = new HashMap<>();
            teamInfo.put("id", team.getId());
            teamInfo.put("name", team.getName());
            teamInfo.put("leaderId", team.getLeaderId());
            teamInfo.put("memberCount", team.getMemberCount());
            teamInfo.put("status", team.getStatus());
            return teamInfo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<LeaderboardEntryDto> getHackathonLeaderboard(String hackathonId, String facultyId) {
        // Verify ownership
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", hackathonId));

        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to access this hackathon");
        }

        List<Submission> submissions = submissionRepository.findByHackathonIdOrderByTotalScoreDesc(hackathonId);

        List<LeaderboardEntryDto> leaderboard = new ArrayList<>();
        int rank = 1;

        for (Submission submission : submissions) {
            LeaderboardEntryDto entry = new LeaderboardEntryDto();
            entry.setRank(rank++);
            entry.setTeamId(submission.getTeamId());

            // Get team name
            Team team = teamRepository.findById(submission.getTeamId()).orElse(null);
            entry.setTeamName(team != null ? team.getName() : "Unknown Team");

            entry.setTotalScore(submission.getTotalScore());
            entry.setInnovationScore(submission.getInnovationScore());
            entry.setImplementationScore(submission.getImplementationScore());
            entry.setPresentationScore(submission.getPresentationScore());
            entry.setImpactScore(submission.getImpactScore());
            entry.setStatus(submission.getStatus() != null ? submission.getStatus().toString() : "PENDING");

            leaderboard.add(entry);
        }

        return leaderboard;
    }

    @Override
    @Transactional
    public void scoreSubmission(String submissionId, Map<String, Object> scoreData, String facultyId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        // Verify ownership of hackathon
        Hackathon hackathon = hackathonRepository.findById(submission.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", submission.getHackathonId()));

        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to score this submission");
        }

        // Update scores
        submission.setInnovationScore((Integer) scoreData.get("innovation"));
        submission.setImplementationScore((Integer) scoreData.get("implementation"));
        submission.setPresentationScore((Integer) scoreData.get("presentation"));
        submission.setImpactScore((Integer) scoreData.get("impact"));

        // Calculate total
        int total = submission.getInnovationScore() + submission.getImplementationScore() +
                submission.getPresentationScore() + submission.getImpactScore();
        submission.setTotalScore(total);

        if (scoreData.containsKey("feedback")) {
            submission.setFeedback((String) scoreData.get("feedback"));
        }

        submission.setStatus(Submission.SubmissionStatus.EVALUATED);
        submissionRepository.save(submission);
    }

    @Override
    public StudentAnalyticsDto getStudentAnalytics(String studentId, String facultyId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        StudentAnalyticsDto analytics = new StudentAnalyticsDto();
        analytics.setStudentId(studentId);
        analytics.setStudentName(student.getName() != null ? student.getName() : (student.getFirstName() + " " + student.getLastName()));
        analytics.setEmail(student.getEmail());
        analytics.setDepartment(student.getDepartment());

        // Get faculty events
        List<Event> facultyEvents = eventRepository.findByOrganizer_Id(facultyId);
        List<String> eventIds = facultyEvents.stream().map(Event::getId).toList();

        // Get student's registrations for faculty events
        List<EventRegistration> registrations = eventRegistrationRepository
                .findByUserIdAndEventIdIn(studentId, eventIds);

        analytics.setEventsAttended((int) registrations.stream().filter(EventRegistration::getAttended).count());
        analytics.setHackathonsParticipated(0); // Pending: Implement registration count
        analytics.setCertificatesEarned((int) certificateRepository.countByUserId(studentId));

        // Calculate attendance rate
        long totalRegistrations = registrations.size();
        long attended = registrations.stream().filter(EventRegistration::getAttended).count();
        analytics.setAttendanceRate(totalRegistrations > 0 ? (double) attended / totalRegistrations * 100 : 0.0);

        // Performance metrics
        analytics.setAverageScore(0.0); // Pending: Calculate from submissions
        analytics.setTotalPoints(0); // Pending: Implement points system
        analytics.setPerformanceLevel(determinePerformanceLevel(analytics.getAttendanceRate()));

        // Participation history
        analytics.setParticipationHistory(new ArrayList<>());

        return analytics;
    }

    @Override
    @Transactional
    public void generateCertificates(String eventId, List<String> userIds, String facultyId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to generate certificates for this event");
        }

        for (String userId : userIds) {
            // Check if certificate already exists
            if (certificateRepository.existsByUserIdAndEventId(userId, eventId)) {
                continue;
            }


            User user = userRepository.findById(userId).orElse(null);
            if (user == null) continue;

            Certificate certificate = new Certificate();
            certificate.setUser(user);
            certificate.setEvent(event);
            User issuer = new User();
            issuer.setId(facultyId);
            certificate.setIssuer(issuer);
            certificate.setTitle(event.getTitle());
            certificate.setCategory("event");
            certificate.setStudentName(user.getName() != null ? user.getName() : (user.getFirstName() + " " + user.getLastName()));
            certificate.setIssuedAt(LocalDateTime.now());
            certificate.setStatus(Certificate.CertificateStatus.VERIFIED);

            // Generate unique certificate ID
            certificate.setCertificateId(UUID.randomUUID().toString().substring(0, 12).toUpperCase());

            // Generate verification code
            String verificationCode = qrCodeGenerator.generateVerificationCode();
            certificate.setVerificationCode(verificationCode);

            // Generate QR code
            try {
                String qrCode = qrCodeGenerator.generateCertificateQRCode(
                        certificate.getCertificateId(),
                        verificationCode,
                        "http://localhost:5173" // Pending: Use environment variable
                );
                certificate.setQrCodeUrl(qrCode);
            } catch (Exception e) {
                // Log error but continue
                e.printStackTrace();
            }

            certificateRepository.save(certificate);
        }
    }

    @Override
    public Page<Certificate> getCertificates(String facultyId, Pageable pageable) {
        return certificateRepository.findByIssuerId(facultyId, pageable);
    }

    @Override
    @Transactional
    public void revokeCertificate(String certificateId, String facultyId) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", certificateId));

        if (certificate.getIssuer() == null || !certificate.getIssuer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to revoke this certificate");
        }

        certificate.setStatus(Certificate.CertificateStatus.REVOKED);
        certificateRepository.save(certificate);
    }

    // Helper methods

    private Double calculateGrowthRate(String facultyId, String type) {
        // Simplified growth calculation
        LocalDateTime lastMonth = LocalDateTime.now().minusMonths(1);
        LocalDateTime twoMonthsAgo = LocalDateTime.now().minusMonths(2);

        if ("events".equals(type)) {
            long currentMonth = eventRepository.countByOrganizer_IdAndCreatedAtAfter(facultyId, lastMonth);
            long previousMonth = eventRepository.countByOrganizer_IdAndCreatedAtBetween(facultyId, twoMonthsAgo, lastMonth);
            return previousMonth > 0 ? ((double) (currentMonth - previousMonth) / previousMonth * 100) : 0.0;
        }

        return 0.0;
    }

    private List<Map<String, Object>> generateEventTrendData(String facultyId, int days) {
        // Generate mock trend data - Pending: Implement real SQL aggregation
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = days; i >= 0; i -= 7) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", LocalDateTime.now().minusDays(i).toString());
            point.put("events", (int) (Math.random() * 10));
            point.put("registrations", (int) (Math.random() * 50));
            trend.add(point);
        }
        return trend;
    }

    private List<Map<String, Object>> generateDepartmentParticipation(String facultyId) {
        // Pending: Implement real SQL aggregation
        return new ArrayList<>();
    }

    private List<Map<String, Object>> generateEventTypeDistribution(String facultyId) {
        // Pending: Implement real SQL aggregation
        return new ArrayList<>();
    }

    private List<Map<String, Object>> generateMonthlyEngagement(String facultyId, int days) {
        // Pending: Implement real SQL aggregation
        return new ArrayList<>();
    }

    private Double calculateEventSuccessRate(String facultyId) {
        List<Event> events = eventRepository.findByOrganizer_Id(facultyId);
        if (events.isEmpty()) return 0.0;

        long successfulEvents = events.stream()
                .filter(e -> "COMPLETED".equals(e.getStatus()))
                .count();

        return (double) successfulEvents / events.size() * 100;
    }

    private Double calculateHackathonCompletionRate(String facultyId) {
        List<Hackathon> hackathons = hackathonRepository.findByOrganizer_Id(facultyId);
        if (hackathons.isEmpty()) return 0.0;

        long completedHackathons = hackathons.stream()
                .filter(h -> "completed".equals(h.getStatus()))
                .count();

        return (double) completedHackathons / hackathons.size() * 100;
    }

    private Double calculateEngagementScore(String facultyId) {
        // Simplified engagement calculation
        List<Event> events = eventRepository.findByOrganizer_Id(facultyId);
        if (events.isEmpty()) return 0.0;

        long totalRegistrations = events.stream()
                .mapToLong(e -> eventRegistrationRepository.countByEventId(e.getId()))
                .sum();

        long totalAttended = events.stream()
                .mapToLong(e -> eventRegistrationRepository.countByEventIdAndAttended(e.getId(), true))
                .sum();

        return totalRegistrations > 0 ? (double) totalAttended / totalRegistrations * 100 : 0.0;
    }

    private String determinePerformanceLevel(Double attendanceRate) {
        if (attendanceRate >= 90) return "Excellent";
        if (attendanceRate >= 75) return "Good";
        if (attendanceRate >= 60) return "Average";
        return "Poor";
    }
}
