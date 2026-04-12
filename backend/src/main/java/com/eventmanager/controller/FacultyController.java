package com.eventmanager.controller;

import com.eventmanager.dto.*;
import com.eventmanager.exception.ResourceNotFoundException;
import com.eventmanager.exception.UnauthorizedException;
import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.service.*;
import com.eventmanager.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@PreAuthorize("hasRole('FACULTY')")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private HackathonRepository hackathonRepository;
    
    @Autowired
    private AuditLogService auditLogService;

    /**
     * Get dashboard statistics for the authenticated faculty member
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<FacultyStatsDto>> getDashboardStats(Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        FacultyStatsDto stats = facultyService.getDashboardStats(facultyId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get all events created by the authenticated faculty member
     */
    @GetMapping("/events")
    public ResponseEntity<ApiResponse<Page<Event>>> getFacultyEvents(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> events = facultyService.getFacultyEvents(facultyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    /**
     * Create a new event
     */
    @PostMapping("/events")
    public ResponseEntity<ApiResponse<Event>> createEvent(
            @RequestBody Event event,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        User organizer = new User();
        organizer.setId(facultyId);
        event.setOrganizer(organizer);
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.ok(ApiResponse.success(savedEvent));
    }

    /**
     * Update an existing event
     */
    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Event>> updateEvent(
            @PathVariable String id,
            @RequestBody Event event,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Verify ownership
        if (existingEvent.getOrganizer() == null || !existingEvent.getOrganizer().getId().equals(facultyId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized"));
        }
        
        event.setId(id);
        User organizer = new User();
        organizer.setId(facultyId);
        event.setOrganizer(organizer);
        Event updatedEvent = eventRepository.save(event);
        return ResponseEntity.ok(ApiResponse.success(updatedEvent));
    }

    /**
     * Delete an event
     */
    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse<String>> deleteEvent(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Verify ownership
        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(facultyId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized"));
        }
        
        eventRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully"));
    }

    /**
     * Get all hackathons created by the authenticated faculty member
     */
    @GetMapping("/hackathons")
    public ResponseEntity<ApiResponse<Page<Hackathon>>> getFacultyHackathons(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<Hackathon> hackathons = facultyService.getFacultyHackathons(facultyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(hackathons));
    }

    /**
     * Create a new hackathon
     */
    @PostMapping("/hackathons")
    public ResponseEntity<ApiResponse<Hackathon>> createHackathon(
            @RequestBody Hackathon hackathon,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        User organizer = new User();
        organizer.setId(facultyId);
        hackathon.setOrganizer(organizer);
        Hackathon savedHackathon = hackathonRepository.save(hackathon);
        return ResponseEntity.ok(ApiResponse.success(savedHackathon));
    }

    /**
     * Update an existing hackathon
     */
    @PutMapping("/hackathons/{id}")
    public ResponseEntity<ApiResponse<Hackathon>> updateHackathon(
            @PathVariable String id,
            @RequestBody Hackathon hackathon,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        Hackathon existingHackathon = hackathonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
        
        // Verify ownership
        if (existingHackathon.getOrganizer() == null || !existingHackathon.getOrganizer().getId().equals(facultyId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized"));
        }
        
        hackathon.setId(id);
        User organizer = new User();
        organizer.setId(facultyId);
        hackathon.setOrganizer(organizer);
        Hackathon updatedHackathon = hackathonRepository.save(hackathon);
        return ResponseEntity.ok(ApiResponse.success(updatedHackathon));
    }

    /**
     * Delete a hackathon
     */
    @DeleteMapping("/hackathons/{id}")
    public ResponseEntity<ApiResponse<String>> deleteHackathon(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        Hackathon hackathon = hackathonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
        
        // Verify ownership
        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getId().equals(facultyId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized"));
        }
        
        hackathonRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Hackathon deleted successfully"));
    }

    /**
     * Get students under faculty supervision
     */
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Object>>> getFacultyStudents(Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        List<Object> students = facultyService.getFacultyStudents(facultyId);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    /**
     * Get recent activity for the faculty member
     */
    @GetMapping("/activity/recent")
    public ResponseEntity<ApiResponse<List<Object>>> getRecentActivity(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        List<Object> activities = facultyService.getRecentActivity(facultyId, limit);
        return ResponseEntity.ok(ApiResponse.success(activities));
    }

    /**
     * Get analytics data for faculty
     */
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAnalytics(
            Authentication authentication,
            @RequestParam(defaultValue = "30") int days) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        AnalyticsDto analytics = facultyService.getAnalytics(facultyId, days);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
    
    /**
     * Get dashboard summary
     */
    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary(Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        DashboardSummaryDto summary = facultyService.getDashboardSummary(facultyId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
    
    /**
     * Get event details by ID
     */
    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        
        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to access this event");
        }
        
        return ResponseEntity.ok(ApiResponse.success(event));
    }
    
    /**
     * Get event registrations
     */
    @GetMapping("/events/{id}/registrations")
    public ResponseEntity<ApiResponse<List<EventRegistrationDto>>> getEventRegistrations(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        List<EventRegistrationDto> registrations = facultyService.getEventRegistrations(id, facultyId);
        return ResponseEntity.ok(ApiResponse.success(registrations));
    }
    
    /**
     * Mark attendance for event
     */
    @PostMapping("/events/{id}/attendance")
    public ResponseEntity<ApiResponse<String>> markAttendance(
            @PathVariable String id,
            @RequestBody Map<String, List<String>> request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        List<String> userIds = request.get("userIds");
        
        facultyService.markAttendance(id, userIds, facultyId);
        auditLogService.log("MARK_ATTENDANCE", "EVENT", id, 
            "Faculty marked attendance for event: " + id, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully"));
    }
    
    /**
     * Get hackathon details by ID
     */
    @GetMapping("/hackathons/{id}")
    public ResponseEntity<ApiResponse<Hackathon>> getHackathonById(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        Hackathon hackathon = hackathonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", id));
        
        if (hackathon.getOrganizer() == null || !hackathon.getOrganizer().getId().equals(facultyId)) {
            throw new UnauthorizedException("You don't have permission to access this hackathon");
        }
        
        return ResponseEntity.ok(ApiResponse.success(hackathon));
    }
    
    /**
     * Get hackathon teams
     */
    @GetMapping("/hackathons/{id}/teams")
    public ResponseEntity<ApiResponse<List<Object>>> getHackathonTeams(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        List<Object> teams = facultyService.getHackathonTeams(id, facultyId);
        return ResponseEntity.ok(ApiResponse.success(teams));
    }
    
    /**
     * Get hackathon leaderboard
     */
    @GetMapping("/hackathons/{id}/leaderboard")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDto>>> getLeaderboard(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        List<LeaderboardEntryDto> leaderboard = facultyService.getHackathonLeaderboard(id, facultyId);
        return ResponseEntity.ok(ApiResponse.success(leaderboard));
    }
    
    /**
     * Score a submission
     */
    @PostMapping("/hackathons/{id}/score")
    public ResponseEntity<ApiResponse<String>> scoreSubmission(
            @PathVariable String id,
            @RequestBody Map<String, Object> scoreData,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        facultyService.scoreSubmission(id, scoreData, facultyId);
        auditLogService.log("SCORE_SUBMISSION", "HACKATHON", id, 
            "Faculty submitted scores for hackathon team: " + id, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.success("Submission scored successfully"));
    }
    
    /**
     * Get student analytics
     */
    @GetMapping("/students/{id}/analytics")
    public ResponseEntity<ApiResponse<StudentAnalyticsDto>> getStudentAnalytics(
            @PathVariable String id,
            Authentication authentication) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        StudentAnalyticsDto analytics = facultyService.getStudentAnalytics(id, facultyId);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
    
    /**
     * Generate certificates
     */
    @PostMapping("/certificates/generate")
    public ResponseEntity<ApiResponse<String>> generateCertificates(
            @RequestBody Map<String, Object> request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        String eventId = (String) request.get("eventId");
        List<String> userIds = (List<String>) request.get("userIds");
        
        facultyService.generateCertificates(eventId, userIds, facultyId);
        auditLogService.log("GENERATE_CERTIFICATES", "EVENT", eventId, 
            "Faculty generated certificates for event: " + eventId, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.success("Certificates generated successfully"));
    }
    
    /**
     * Get faculty certificates
     */
    @GetMapping("/certificates")
    public ResponseEntity<ApiResponse<Page<Certificate>>> getCertificates(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<Certificate> certificates = facultyService.getCertificates(facultyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(certificates));
    }
    
    /**
     * Revoke certificate
     */
    @PutMapping("/certificates/{id}/revoke")
    public ResponseEntity<ApiResponse<String>> revokeCertificate(
            @PathVariable String id,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String facultyId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        
        facultyService.revokeCertificate(id, facultyId);
        auditLogService.log("REVOKE_CERTIFICATE", "CERTIFICATE", id, 
            "Faculty revoked certificate: " + id, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.success("Certificate revoked successfully"));
    }
}
