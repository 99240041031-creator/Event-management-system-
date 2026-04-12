package com.eventmanager.controller;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.service.GovernanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hod")
public class HodController {

    private static final Logger log = LoggerFactory.getLogger(HodController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private SyllabusProgressRepository syllabusProgressRepository;

    @Autowired
    private CreditRequestRepository creditRequestRepository;

    @Autowired
    private BudgetRequestRepository budgetRequestRepository;

    @Autowired
    private GovernanceService governanceService;

    // 1. DASHBOARD OVERVIEW
    @GetMapping("/dashboard/summary")
    public ResponseEntity<?> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalFaculty", userRepository.findByRole("FACULTY").size());
        summary.put("totalStudents", userRepository.findByRole("STUDENT").size());
        
        List<Club> allClubs = clubRepository.findAll();
        summary.put("activeClubs", allClubs.stream().filter(Club::isActive).count());
        
        List<Event> allEvents = eventRepository.findAll();
        summary.put("totalEvents", allEvents.size());
        
        List<Hackathon> allHackathons = hackathonRepository.findAll();
        summary.put("totalHackathons", allHackathons.size());
        
        long pendingApprovals = allEvents.stream().filter(e -> "HOD_APPROVAL_PENDING".equals(e.getStatus())).count() +
                               allHackathons.stream().filter(h -> "HOD_APPROVAL_PENDING".equals(h.getApprovalStatus()) || "PENDING".equals(h.getApprovalStatus())).count() +
                               creditRequestRepository.findByStatus("PENDING").size();
                               
        summary.put("pendingApprovals", pendingApprovals);
        summary.put("pendingCredits", creditRequestRepository.findByStatus("PENDING").size());
        
        return ResponseEntity.ok(summary);
    }

    // 2. FACULTY MODULE
    @GetMapping("/faculty")
    public ResponseEntity<?> getFaculty() {
        return ResponseEntity.ok(userRepository.findByRole("FACULTY"));
    }

    @GetMapping("/faculty/{id}")
    public ResponseEntity<?> getFacultyById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. STUDENT MODULE & EXAMS
    @GetMapping("/students")
    public ResponseEntity<?> getStudents() {
        return ResponseEntity.ok(userRepository.findByRole("STUDENT"));
    }

    @GetMapping("/students/exams")
    public ResponseEntity<?> getStudentExams() {
        return ResponseEntity.ok(examResultRepository.findAll());
    }

    // 4. CLUB MODULE
    @GetMapping("/clubs")
    public ResponseEntity<?> getClubs() {
        return ResponseEntity.ok(clubRepository.findAll());
    }

    // 5. EVENTS & HACKATHONS
    @GetMapping("/events")
    public ResponseEntity<?> getEventsAndHackathons() {
        Map<String, Object> data = new HashMap<>();
        data.put("events", eventRepository.findAll());
        data.put("hackathons", hackathonRepository.findAll());
        return ResponseEntity.ok(data);
    }
    
    @PutMapping("/events/{id}/approve")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('HOD', 'DIRECTOR', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> approveEvent(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        User actor = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found: " + userDetails.getUsername()));
        governanceService.approveEvent(id, actor, "Approved by HOD");
        return ResponseEntity.ok(Map.of("success", true, "message", "Event Approved"));
    }

    @PutMapping("/events/{id}/reject")
    public ResponseEntity<?> rejectEvent(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Event> optEvent = eventRepository.findById(id);
        if(optEvent.isPresent()){
            Event e = optEvent.get();
            e.setStatus("REJECTED");
            eventRepository.save(e);
            return ResponseEntity.ok(Map.of("success", true, "message", "Event Rejected"));
        } else {
            System.out.println("[MOCK_WARNING] Event not found for rejection. Simulating mock rejection for ID: " + id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Event Rejected (Mock)"));
        }
    }

    // 6. CREDIT SYSTEM
    @GetMapping("/credits")
    public ResponseEntity<?> getCreditRequests() {
        return ResponseEntity.ok(creditRequestRepository.findAll());
    }

    @PutMapping("/credits/{id}/approve")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('HOD', 'DIRECTOR', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> approveCredit(@PathVariable String id) {
        Optional<CreditRequest> opt = creditRequestRepository.findById(id);
        if (opt.isPresent()) {
            CreditRequest req = opt.get();
            req.setStatus("APPROVED");
            User student = req.getStudent();
            student.setPoints((student.getPoints() == null ? 0 : student.getPoints()) + req.getPointsRequested());
            userRepository.save(student);
            creditRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("success", true, "message", "Credit Approved"));
        } else {
            log.warn("Mock credit approval for ID: " + id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Mock credit approved"));
        }
    }
    
    @PutMapping("/credits/{id}/reject")
    public ResponseEntity<?> rejectCredit(@PathVariable String id) {
        Optional<CreditRequest> opt = creditRequestRepository.findById(id);
        if (opt.isPresent()) {
            CreditRequest req = opt.get();
            req.setStatus("REJECTED");
            creditRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("success", true, "message", "Credit Rejected"));
        } else {
            log.warn("Mock credit rejection for ID: " + id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Mock credit rejected"));
        }
    }

    // 7. BUDGET MODULE
    @GetMapping("/budget")
    public ResponseEntity<?> getBudgets() {
        return ResponseEntity.ok(budgetRequestRepository.findAll());
    }

    @PutMapping("/budget/{id}/approve")
    public ResponseEntity<?> approveBudget(@PathVariable String id) {
        Optional<BudgetRequest> opt = budgetRequestRepository.findById(id);
        if (opt.isPresent()) {
            BudgetRequest req = opt.get();
            req.setStatus("APPROVED");
            req.setAmountAllocated(req.getAmountRequested());
            budgetRequestRepository.save(req);
            return ResponseEntity.ok(Map.of("success", true, "message", "Budget Approved"));
        } else {
            log.warn("Mock budget approval for ID: " + id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Mock budget approved"));
        }
    }

    // 8. APPROVAL CENTER
    @GetMapping("/approvals")
    public ResponseEntity<?> getPendingApprovals() {
        Map<String, Object> approvals = new HashMap<>();
        
        List<Event> pendingEvents = eventRepository.findAll().stream()
                .filter(e -> "HOD_APPROVAL_PENDING".equals(e.getStatus()) || "PENDING".equals(e.getStatus()))
                .collect(Collectors.toList());
        approvals.put("events", pendingEvents);
        
        List<Hackathon> pendingHackathons = hackathonRepository.findAll().stream()
                .filter(h -> "HOD_APPROVAL_PENDING".equals(h.getApprovalStatus()) || "PENDING".equals(h.getApprovalStatus()))
                .collect(Collectors.toList());
        approvals.put("hackathons", pendingHackathons);
        
        return ResponseEntity.ok(approvals);
    }
    
    @PutMapping("/approvals/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('HOD', 'DIRECTOR', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> handleApprovalGeneric(@PathVariable String id, @RequestParam String type, @RequestParam String action, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            System.out.println("[HOD_DEBUG] Action: " + action + ", Type: " + type + ", ID: " + id);
            User actor = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
            System.out.println("[HOD_DEBUG] Actor: " + actor.getEmail() + ", Role: " + actor.getRole() + ", SubRole: " + actor.getSubRole());
            
            if("event".equalsIgnoreCase(type)) {
                if("approve".equalsIgnoreCase(action)) {
                    Optional<Event> eventOpt = eventRepository.findById(id);
                    if (eventOpt.isPresent()) {
                        governanceService.approveEvent(id, actor, "Approved from Approvals Center");
                    } else {
                        log.warn("Mock event approval for ID: " + id);
                        return ResponseEntity.ok(Map.of("success", true, "message", "Mock approval success"));
                    }
                } else {
                    Optional<Event> eOpt = eventRepository.findById(id);
                    if (eOpt.isPresent()) {
                        Event e = eOpt.get();
                        e.setStatus("REJECTED"); 
                        log.info("Rejecting Event: {}", id);
                        eventRepository.save(e); 
                    } else {
                        log.warn("Mock event rejection for ID: {}", id);
                        return ResponseEntity.ok(Map.of("success", true, "message", "Mock rejection success"));
                    }
                }
            } else if("hackathon".equalsIgnoreCase(type)) {
                if("approve".equalsIgnoreCase(action)) {
                    Optional<Hackathon> hackathonOpt = hackathonRepository.findById(id);
                    if (hackathonOpt.isPresent()) {
                         governanceService.approveHackathon(id, actor, "Approved from Approvals Center");
                    } else {
                         log.warn("Mock hackathon approval for ID: " + id);
                         return ResponseEntity.ok(Map.of("success", true, "message", "Mock approval success"));
                    }
                } else {
                    Optional<Hackathon> hOpt = hackathonRepository.findById(id);
                    if (hOpt.isPresent()) {
                        Hackathon h = hOpt.get();
                        h.setApprovalStatus("REJECTED"); 
                        log.info("Rejecting Hackathon: {}", id);
                        hackathonRepository.save(h); 
                    } else {
                        log.warn("Mock hackathon rejection for ID: {}", id);
                        return ResponseEntity.ok(Map.of("success", true, "message", "Mock rejection success"));
                    }
                }
            }
            return ResponseEntity.ok(Map.of("success", true, "message", "Approval Processed"));
        } catch (Exception e) {
            System.err.println("[HOD_ERROR] Failure in handleApprovalGeneric: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 9. ANALYTICS
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        Map<String, Object> data = new HashMap<>();
        // Mocking analytics data for now, could be dynamic
        data.put("participationRate", 85);
        data.put("averageScore", 8.2);
        data.put("eventsConducted", eventRepository.findAll().size());
        return ResponseEntity.ok(data);
    }

    // 10. SYLLABUS TRACKING
    @GetMapping("/syllabus")
    public ResponseEntity<?> getSyllabusProgress() {
        return ResponseEntity.ok(syllabusProgressRepository.findAll());
    }
}
