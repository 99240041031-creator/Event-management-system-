package com.eventmanager.controller;

import com.eventmanager.model.*;
import com.eventmanager.service.ClubService;
import com.eventmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
public class FacultyClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private UserService userService;

    private String getCurrentFacultyId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // In a real scenario, we extract strict ID. For now assuming email/username lookup works/mocked properly or standard Spring Security user details.
        // If auth.getPrincipal() is the user object, cast it. safer to look up.
        if (auth == null || !auth.isAuthenticated()) return null;
        return userService.getUserByEmail(auth.getName()).getId();
    }

    // --- Overview ---

    @GetMapping("/clubs")
    public ResponseEntity<List<Club>> getFacultyClubs() {
        String facultyId = getCurrentFacultyId();
        return ResponseEntity.ok(clubService.getClubsByFacultyAdvisor(facultyId));
    }

    @GetMapping("/clubs/{id}/overview")
    public ResponseEntity<Club> getClubOverview(@PathVariable String id) {
        // Add security check: ensure faculty owns this club
        return clubService.getClubById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Recruitment ---

    @PutMapping("/clubs/{id}/recruitment")
    public ResponseEntity<Club> toggleRecruitment(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(clubService.toggleRecruitment(id, body.get("isOpen")));
    }

    @GetMapping("/clubs/{id}/applications")
    public ResponseEntity<List<ClubJoinRequest>> getApplications(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubJoinRequests(id));
    }

    @PutMapping("/applications/{id}")
    public ResponseEntity<ClubJoinRequest> updateApplicationStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(clubService.updateJoinRequestStatus(id, body.get("status")));
    }

    @PostMapping("/applications/bulk-approve")
    public ResponseEntity<List<ClubMembership>> bulkApproveApplications(@RequestBody Map<String, List<String>> body) {
        return ResponseEntity.ok(clubService.bulkApproveApplications(body.get("requestIds")));
    }

    @PutMapping("/applications/{id}/score")
    public ResponseEntity<Void> updateApplicationScore(@PathVariable String id, @RequestBody Map<String, Double> body) {
        clubService.updateJoinRequestScore(id, body.get("score"));
        return ResponseEntity.ok().build();
    }

    // --- Members ---

    @GetMapping("/clubs/{id}/members")
    public ResponseEntity<List<ClubMembership>> getMembers(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubMembers(id));
    }

    @PutMapping("/members/{id}")
    public ResponseEntity<Void> updateMemberRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        clubService.updateMembershipRole(id, body.get("role"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/clubs/{id}/members/export")
    public ResponseEntity<List<ClubMembership>> exportMembers(@PathVariable String id) {
        return ResponseEntity.ok(clubService.exportMembers(id));
    }

    // --- Events ---

    @GetMapping("/clubs/{id}/events")
    public ResponseEntity<List<ClubEvent>> getClubEvents(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubEvents(id));
    }

    @PostMapping("/clubs/{id}/events")
    public ResponseEntity<ClubEvent> createClubEvent(@PathVariable String id, @RequestBody ClubEvent event) {
        Club club = new Club();
        club.setId(id);
        event.setClub(club);
        return ResponseEntity.ok(clubService.createClubEvent(event));
    }

    @GetMapping("/events/{id}/participants")
    public ResponseEntity<List<ClubEventRegistration>> getEventParticipants(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getEventParticipants(id));
    }

    @PostMapping("/clubs/events/{id}/attendance")
    public ResponseEntity<Void> markAttendance(@PathVariable String id, @RequestBody Map<String, String> body) {
        clubService.markAttendance(id, body.get("studentId"), body.get("status"));
        return ResponseEntity.ok().build();
    }

    // --- Hackathons ---

    @GetMapping("/clubs/{id}/hackathons")
    public ResponseEntity<List<ClubHackathon>> getClubHackathons(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubHackathons(id));
    }

    @PostMapping("/clubs/{id}/hackathons")
    public ResponseEntity<ClubHackathon> createClubHackathon(@PathVariable String id, @RequestBody ClubHackathon hackathon) {
        Club club = new Club();
        club.setId(id);
        hackathon.setClub(club);
        return ResponseEntity.ok(clubService.createClubHackathon(hackathon));
    }

    // --- Announcements ---

    @GetMapping("/clubs/{id}/posts")
    public ResponseEntity<List<ClubAnnouncement>> getClubPosts(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubAnnouncements(id));
    }

    @PostMapping("/clubs/{id}/posts")
    public ResponseEntity<ClubAnnouncement> createClubPost(@PathVariable String id, @RequestBody Map<String, String> body) {
        String facultyId = getCurrentFacultyId();
        return ResponseEntity.ok(clubService.createAnnouncement(id, facultyId, body.get("title"), body.get("content")));
    }

    // --- Budget ---

    @GetMapping("/clubs/{id}/budget")
    public ResponseEntity<ClubBudget> getClubBudget(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubBudget(id));
    }

    @PostMapping("/clubs/{id}/budget")
    public ResponseEntity<ClubBudget> updateClubBudget(@PathVariable String id, @RequestBody Map<String, Double> body) {
        return ResponseEntity.ok(clubService.updateClubBudget(id, body.get("allocated"), body.get("spent"), body.get("revenue")));
    }

    // --- Analytics ---

    @GetMapping("/clubs/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getClubAnalytics(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubAnalytics(id));
    }

    // --- Certificates ---

    @PostMapping("/clubs/{id}/certificates/generate")
    public ResponseEntity<?> generateCertificates(@PathVariable String id, @RequestParam(required = false) String eventId) {
        clubService.generateCertificatesForEvent(id, eventId);
        return ResponseEntity.ok(Map.of("message", "Certificates generation queued"));
    }

    @GetMapping("/certificates/verify/{certificateId}")
    public ResponseEntity<ClubCertificate> verifyCertificate(@PathVariable String certificateId) {
        return ResponseEntity.ok(clubService.verifyCertificate(certificateId));
    }

    @PostMapping("/clubs/certificates/{id}/revoke")
    public ResponseEntity<Void> revokeCertificate(@PathVariable String id) {
        clubService.revokeCertificate(id);
        return ResponseEntity.ok().build();
    }

    // --- Ambassadors ---

    @GetMapping("/clubs/{id}/ambassadors")
    public ResponseEntity<List<ClubAmbassador>> getAmbassadors(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubAmbassadors(id));
    }

    @PostMapping("/clubs/{id}/ambassadors")
    public ResponseEntity<ClubAmbassador> addAmbassador(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(clubService.addAmbassador(id, body.get("userId")));
    }

    // --- Hackathon Teams & Scoring ---

    @PostMapping("/clubs/hackathons/{id}/teams")
    public ResponseEntity<ClubHackathonTeam> registerTeam(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String teamName = (String) body.get("teamName");
        @SuppressWarnings("unchecked")
        List<String> studentIds = (List<String>) body.get("studentIds");
        return ResponseEntity.ok(clubService.registerClubHackathonTeam(id, teamName, studentIds));
    }

    @PostMapping("/hackathons/teams/{teamId}/score")
    public ResponseEntity<ClubHackathonTeam> scoreTeam(@PathVariable String teamId, @RequestBody Map<String, Object> body) {
        Double score = Double.valueOf(body.get("score").toString());
        String feedback = (String) body.get("feedback");
        return ResponseEntity.ok(clubService.scoreClubHackathonTeam(teamId, score, feedback));
    }

    @GetMapping("/clubs/hackathons/{id}/leaderboard")
    public ResponseEntity<List<ClubHackathonTeam>> getLeaderboard(@PathVariable String id) {
        return ResponseEntity.ok(clubService.getClubHackathonLeaderboard(id));
    }
}
