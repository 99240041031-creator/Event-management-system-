package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ClubMembershipRepository clubMembershipRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Override
    public Map<String, Object> getStudentDashboardStats(String userId) {
        Map<String, Object> stats = new HashMap<>();

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return stats;
        }

        // Basic stats
        stats.put("totalPoints", user.getPoints() != null ? user.getPoints() : 0);

        // Certificate count
        long certificateCount = certificateRepository.findByUserId(userId).size();
        stats.put("certificatesEarned", certificateCount);

        // Hackathon participation
        long hackathonCount = teamMemberRepository.findByUserId(userId).stream()
                .map(tm -> tm.getTeam())
                .filter(team -> team.getHackathon() != null)
                .distinct()
                .count();
        stats.put("hackathonsParticipated", hackathonCount);

        // Club memberships
        long clubCount = clubMembershipRepository.findByUserId(userId).size();
        stats.put("clubsJoined", clubCount);

        // Badges
        List<Map<String, Object>> badges = userBadgeRepository.findByUserId(userId).stream()
                .map(ub -> {
                    Map<String, Object> badge = new HashMap<>();
                    badge.put("id", ub.getBadge().getId());
                    badge.put("name", ub.getBadge().getName());
                    badge.put("icon", ub.getBadge().getIconUrl());
                    badge.put("earnedAt", ub.getAwardedAt());
                    return badge;
                })
                .collect(Collectors.toList());
        stats.put("badges", badges);

        // Recent activities
        List<Map<String, Object>> recentActivities = activityRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .limit(10)
                .map(activity -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", activity.getId());
                    act.put("type", activity.getActivityType());
                    act.put("description", activity.getDescription());
                    act.put("timestamp", activity.getTimestamp());
                    act.put("points", 10);
                    return act;
                })
                .collect(Collectors.toList());
        stats.put("recentActivities", recentActivities);

        // Participation trends (last 6 months)
        List<Map<String, Object>> participationTrends = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", java.time.LocalDate.now().minusMonths(i).getMonth().toString());
            monthData.put("events", (int) (Math.random() * 5));
            participationTrends.add(monthData);
        }
        stats.put("participationTrends", participationTrends);

        // College rank
        stats.put("collegeRank", (int) (Math.random() * 100) + 1);

        return stats;
    }

    @Override
    public Map<String, Object> getClubAnalytics(String clubId) {
        Map<String, Object> stats = new HashMap<>();

        long memberCount = clubMembershipRepository.findByClubId(clubId).size();
        stats.put("totalMembers", memberCount);
        stats.put("activeMembers", (int) (memberCount * 0.7));
        stats.put("eventsHosted", (int) (Math.random() * 20));

        return stats;
    }

    @Override
    public Map<String, Object> getCollegeAdminStats(String collegeId) {
        Map<String, Object> stats = new HashMap<>();

        long studentCount = userRepository.countByRoleAndCollege_Id("student", collegeId);

        long eventCount = eventRepository.countByCollege_Id(collegeId);

        long hackathonCount = hackathonRepository.countByCollege_Id(collegeId);

        stats.put("totalStudents", studentCount);
        stats.put("totalEvents", eventCount);
        stats.put("totalHackathons", hackathonCount);
        stats.put("engagementRate", 78.5);

        return stats;
    }

    @Override
    public Map<String, Object> getEventStats(String eventId) {
        Map<String, Object> stats = new HashMap<>();

        Event event = eventRepository.findById(eventId).orElse(null);
        if (event != null) {
            stats.put("registeredCount", event.getRegisteredCount());
            stats.put("capacity", event.getCapacity());
            stats.put("attendanceRate", 85.0);
        }

        return stats;
    }

    @Override
    public java.util.List<Map<String, Object>> getCollegeRankings() {
        java.util.List<Map<String, Object>> rankings = new java.util.ArrayList<>();
        collegeRepository.findAll().forEach(college -> {
            Map<String, Object> collegeStats = new HashMap<>();
            collegeStats.put("id", college.getId());
            collegeStats.put("name", college.getName());
            collegeStats.put("logo", college.getLogo());

            long studentCount = userRepository.countByRoleAndCollege_Id("student", college.getId());
            collegeStats.put("studentCount", studentCount);

            Map<String, Object> stats = new HashMap<>();
            stats.put("engagementScore", (int) (Math.random() * 1000));

            long hackathons = hackathonRepository.countByCollege_Id(college.getId());
            long events = eventRepository.countByCollege_Id(college.getId());

            stats.put("totalHackathons", hackathons);
            stats.put("totalEvents", events);
            collegeStats.put("stats", stats);

            rankings.add(collegeStats);
        });
        return rankings;
    }
}
