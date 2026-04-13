package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClubServiceImpl implements ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubAnnouncementRepository announcementRepository;

    @Autowired
    private ClubMembershipRepository membershipRepository;

    @Autowired
    private RecruitmentNoticeRepository recruitmentNoticeRepository;

    @Autowired
    private ClubJoinRequestRepository joinRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ClubEventRegistrationRepository clubEventRegistrationRepository;

    @Override
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    @Override
    public List<Club> getClubsByCollege(String collegeId) {
        return clubRepository.findByCollegeId(collegeId);
    }

    @Override
    public List<Club> getClubsByFacultyAdvisor(String facultyId) {
        List<Club> clubs = clubRepository.findByFacultyAdvisorId(facultyId);
        clubs.forEach(club -> {
            club.setMemberCount(membershipRepository.countByClubId(club.getId()));
            club.setEventsCount(clubEventRepository.countByClubId(club.getId()));
        });
        return clubs;
    }

    @Override
    public Optional<Club> getClubById(String id) {
        return clubRepository.findById(id);
    }

    @Override
    public Club createClub(Club club) {
        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(String id, Club clubDetails) {
        return clubRepository.findById(id).map(club -> {
            club.setName(clubDetails.getName());
            club.setDescription(clubDetails.getDescription());
            club.setBannerUrl(clubDetails.getBannerUrl());
            club.setLogoUrl(clubDetails.getLogoUrl());
            club.setCategory(clubDetails.getCategory());
            club.setTags(clubDetails.getTags());
            club.setAchievements(clubDetails.getAchievements());
            club.setFacultyAdvisor(clubDetails.getFacultyAdvisor());
            club.setPresident(clubDetails.getPresident());
            club.setActive(clubDetails.isActive());
            return clubRepository.save(club);
        }).orElseThrow(() -> new RuntimeException("Club not found with id " + id));
    }

    @Override
    public void deleteClub(String id) {
        clubRepository.deleteById(id);
    }

    @Override
    public ClubAnnouncement createAnnouncement(String clubId, String authorId, String title, String content) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User author = userRepository.findById(authorId).orElseThrow(() -> new RuntimeException("User not found"));

        ClubAnnouncement announcement = new ClubAnnouncement();
        announcement.setClub(club);
        announcement.setAuthor(author);
        announcement.setTitle(title);
        announcement.setContent(content);

        ClubAnnouncement savedAnnouncement = announcementRepository.save(announcement);

        activityService.logActivity(authorId, "CLUB_POST", "Posted an announcement in " + club.getName(),
                savedAnnouncement.getId(), title);

        return savedAnnouncement;
    }

    @Override
    public List<ClubAnnouncement> getClubAnnouncements(String clubId) {
        return announcementRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @Override
    public ClubMembership joinClub(String clubId, String userId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ClubMembership membership = new ClubMembership();
        membership.setClub(club);
        membership.setUser(user);
        membership.setRole("MEMBER");
        membership.setStatus("PENDING");

        ClubMembership savedMembership = membershipRepository.save(membership);

        activityService.logActivity(userId, "JOINED_CLUB", "Joined " + club.getName(),
                club.getId(), club.getName());

        notificationService.createNotification(userId, "Welcome to " + club.getName(),
                "Your membership request is " + membership.getStatus(), "INFO", "CLUB");

        return savedMembership;
    }

    @Override
    public List<ClubMembership> getClubMembers(String clubId) {
        return membershipRepository.findByClubId(clubId);
    }

    @Override
    public List<ClubMembership> getUserClubs(String userId) {
        return membershipRepository.findByUserId(userId);
    }

    @Override
    public void updateMembershipRole(String membershipId, String role) {
        ClubMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        membership.setRole(role);
        membershipRepository.save(membership);
    }

    @Override
    public RecruitmentNotice createRecruitmentNotice(String clubId, String title, String description, String role,
            String requirements, LocalDateTime deadline) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));

        RecruitmentNotice notice = new RecruitmentNotice();
        notice.setClub(club);
        notice.setTitle(title);
        notice.setDescription(description);
        notice.setRole(role);
        notice.setRequirements(requirements);
        notice.setDeadline(deadline);

        RecruitmentNotice savedNotice = recruitmentNoticeRepository.save(notice);
        activityService.logActivity(club.getPresident().getId(), "CLUB_RECRUITMENT",
                "Posted a recruitment notice for " + role + " in " + club.getName(), savedNotice.getId(), title);

        return savedNotice;
    }

    @Override
    public List<RecruitmentNotice> getClubRecruitmentNotices(String clubId) {
        return recruitmentNoticeRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @Override
    public List<RecruitmentNotice> getAllOpenRecruitments() {
        return recruitmentNoticeRepository.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    @Override
    public ClubJoinRequest submitJoinRequest(String clubId, String userId, String message) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        ClubJoinRequest request = new ClubJoinRequest();
        request.setClub(club);
        request.setUser(user);
        request.setMessage(message);

        ClubJoinRequest savedRequest = joinRequestRepository.save(request);
        notificationService.createNotification(club.getPresident().getId(), "New Join Request",
                user.getName() + " wants to join " + club.getName(), "INFO", "CLUB");

        return savedRequest;
    }

    @Override
    public List<ClubJoinRequest> getClubJoinRequests(String clubId) {
        return joinRequestRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }

    @Override
    public ClubJoinRequest updateJoinRequestStatus(String requestId, String status) {
        ClubJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);

        if ("APPROVED".equals(status)) {
            // Automatically add as member
            ClubMembership membership = new ClubMembership();
            membership.setClub(request.getClub());
            membership.setUser(request.getUser());
            membership.setRole("MEMBER");
            membership.setStatus("ACTIVE");
            membershipRepository.save(membership);

            notificationService.createNotification(request.getUser().getId(), "Club Request Approved",
                    "You are now a member of " + request.getClub().getName(), "SUCCESS", "CLUB");
        } else {
            notificationService.createNotification(request.getUser().getId(), "Club Request Update",
                    "Your request to join " + request.getClub().getName() + " was " + status.toLowerCase(), "WARNING",
                    "CLUB");
        }

        return joinRequestRepository.save(request);
    }
    @Override
    public Club toggleRecruitment(String clubId, boolean isOpen) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        club.setRecruitmentOpen(isOpen);
        return clubRepository.save(club);
    }

    @Autowired
    private ClubBudgetRepository clubBudgetRepository;

    @Override
    public ClubBudget getClubBudget(String clubId) {
        return clubBudgetRepository.findByClubId(clubId)
                .orElseGet(() -> {
                    // Create default budget if not exists
                    Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
                    ClubBudget budget = new ClubBudget();
                    budget.setClub(club);
                    return clubBudgetRepository.save(budget);
                });
    }

    @Override
    public ClubBudget updateClubBudget(String clubId, Double allocated, Double spent, Double revenue) {
        ClubBudget budget = getClubBudget(clubId);
        if (allocated != null) budget.setAllocated(allocated);
        if (spent != null) budget.setSpent(spent);
        if (revenue != null) budget.setRevenue(revenue);
        budget.setUpdatedAt(LocalDateTime.now());
        return clubBudgetRepository.save(budget);
    }

    @Autowired
    private ClubEventRepository clubEventRepository;

    @Override
    public List<ClubEvent> getClubEvents(String clubId) {
        return clubEventRepository.findByClubIdOrderByStartDateDesc(clubId);
    }

    @Override
    public ClubEvent createClubEvent(ClubEvent event) {
        return clubEventRepository.save(event);
    }

    @Autowired
    private ClubHackathonRepository clubHackathonRepository;

    @Override
    public List<ClubHackathon> getClubHackathons(String clubId) {
        return clubHackathonRepository.findByClubIdOrderByStartDateDesc(clubId);
    }

    @Override
    public ClubHackathon createClubHackathon(ClubHackathon hackathon) {
        return clubHackathonRepository.save(hackathon);
    }

    @Override
    public java.util.Map<String, Object> getClubAnalytics(String clubId) {
        java.util.Map<String, Object> analytics = new java.util.HashMap<>();
        
        long totalMembers = membershipRepository.countByClubId(clubId);
        long activeEvents = clubEventRepository.countByClubIdAndStatus(clubId, "UPCOMING");
        long completedEvents = clubEventRepository.countByClubIdAndStatus(clubId, "COMPLETED");
        long pendingApplications = joinRequestRepository.findByClubIdOrderByCreatedAtDesc(clubId).stream().filter(r -> "PENDING".equals(r.getStatus())).count();
        long activeHackathons = clubHackathonRepository.findByClubIdAndStatus(clubId, "ACTIVE").size();
        long certificatesIssued = clubCertificateRepository.findByClubId(clubId).size();
        
        analytics.put("totalMembers", totalMembers);
        analytics.put("activeEvents", activeEvents);
        analytics.put("completedEvents", completedEvents);
        analytics.put("pendingApplications", pendingApplications);
        analytics.put("activeHackathons", activeHackathons);
        analytics.put("certificatesIssued", certificatesIssued);
        analytics.put("recruitmentOpen", clubRepository.findById(clubId).map(Club::getRecruitmentOpen).orElse(false));
         
        // Engagement Score Calculation (Complex aggregation placeholder)
        // (Members * 10) + (Completed Events * 20) + (Certificates * 5)
        long engagementScore = (totalMembers * 10) + (completedEvents * 20) + (certificatesIssued * 5);
        analytics.put("engagementScore", engagementScore);
        
        return analytics;
    }
    @Autowired
    private ClubAmbassadorRepository clubAmbassadorRepository;

    @Override
    public ClubAmbassador addAmbassador(String clubId, String studentId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        ClubAmbassador ambassador = new ClubAmbassador();
        ambassador.setClub(club);
        ambassador.setStudent(student);
        ambassador.setStatus("ACTIVE");

        return clubAmbassadorRepository.save(ambassador);
    }

    @Override
    public List<ClubAmbassador> getClubAmbassadors(String clubId) {
        return clubAmbassadorRepository.findByClubId(clubId);
    }

    @Autowired
    private ClubCertificateRepository clubCertificateRepository;

    @Override
    public void generateCertificatesForEvent(String clubId, String eventId) {
       // Logic to find all participants of the event and generate certificates
       List<ClubEvent> events = (eventId == null) ? clubEventRepository.findByClubIdOrderByStartDateDesc(clubId) : List.of(clubEventRepository.findById(eventId).orElseThrow());
       
       for(@SuppressWarnings("unused") ClubEvent event : events) {
         // This is a placeholder as we need proper Event Registration linkage to Club Events.
         // Assuming we can get participants later. For now, we will just log or do nothing.
         // In a real impl, we would:
         // 1. Get all users who attended the event
         // 2. Loop through them
         // 3. Create ClubCertificate entity for each
         // 4. Save to repo
       }
    }

    @Override
    public List<ClubCertificate> getClubCertificates(String clubId) {
        return clubCertificateRepository.findByClubId(clubId);
    }

    @Override
    public String generateCertificateId() {
        return "CERT-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    public ClubCertificate verifyCertificate(String certificateId) {
        return clubCertificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found or invalid"));
    }

    @Override
    public void revokeCertificate(String certificateId) {
        ClubCertificate cert = verifyCertificate(certificateId);
        cert.setStatus("REVOKED");
        clubCertificateRepository.save(cert);
    }

    @Override
    public ClubEventRegistration registerForEvent(String eventId, String studentId) {
        ClubEvent event = clubEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (event.getCapacity() != null && event.getRegisteredCount() >= event.getCapacity()) {
            throw new RuntimeException("Event is already full");
        }

        ClubEventRegistration registration = new ClubEventRegistration();
        registration.setClubEvent(event);
        registration.setStudent(student);
        registration.setRegisteredAt(LocalDateTime.now());

        ClubEventRegistration saved = clubEventRegistrationRepository.save(registration);
        
        // Update registration count
        event.setRegisteredCount((event.getRegisteredCount() == null ? 0 : event.getRegisteredCount()) + 1);
        clubEventRepository.save(event);

        return saved;
    }

    @Override
    public List<ClubEventRegistration> getEventParticipants(String eventId) {
        return clubEventRegistrationRepository.findByClubEventId(eventId);
    }

    @Override
    public void markAttendance(String eventId, String studentId, String status) {
        ClubEventRegistration reg = clubEventRegistrationRepository.findByClubEventIdAndStudentId(eventId, studentId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        reg.setAttendanceStatus(status);
        if ("ATTENDED".equals(status)) {
            reg.setAttendedAt(LocalDateTime.now());
            reg.setCompletionStatus("COMPLETED");
        }
        clubEventRegistrationRepository.save(reg);
    }

    @Override
    public void updateJoinRequestScore(String requestId, Double score) {
        ClubJoinRequest req = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setInterviewScore(score.intValue());
        joinRequestRepository.save(req);
    }

    @Override
    public List<ClubMembership> bulkApproveApplications(List<String> requestIds) {
        java.util.ArrayList<ClubMembership> memberships = new java.util.ArrayList<>();
        for (String id : requestIds) {
            ClubJoinRequest req = updateJoinRequestStatus(id, "APPROVED");
            membershipRepository.findByClubIdAndUserId(req.getClub().getId(), req.getUser().getId())
                    .ifPresent(memberships::add);
        }
        return memberships;
    }

    @Override
    public List<ClubMembership> exportMembers(String clubId) {
        return membershipRepository.findByClubId(clubId);
    }

    @Autowired
    private ClubHackathonTeamRepository clubHackathonTeamRepository;

    @Override
    public ClubHackathonTeam registerClubHackathonTeam(String hackathonId, String teamName, List<String> studentIds) {
        ClubHackathon hackathon = clubHackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));

        ClubHackathonTeam team = new ClubHackathonTeam();
        team.setHackathon(hackathon);
        team.setTeamName(teamName);
        
        List<User> members = userRepository.findAllById(studentIds);
        team.setMembers(members);
        
        team.setTotalScore(0.0);
        
        return clubHackathonTeamRepository.save(team);
    }

    @Override
    public ClubHackathonTeam scoreClubHackathonTeam(String teamId, Double score, String feedback) {
        ClubHackathonTeam team = clubHackathonTeamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setTotalScore(score);
        team.setFeedback(feedback);
        return clubHackathonTeamRepository.save(team);
    }

    @Override
    public List<ClubHackathonTeam> getClubHackathonLeaderboard(String hackathonId) {
        return clubHackathonTeamRepository.findByHackathonIdOrderByTotalScoreDesc(hackathonId);
    }
}
