package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HodService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private DepartmentHealthRepository departmentHealthRepository;

    @Autowired
    private DepartmentBudgetRepository departmentBudgetRepository;

    @Autowired
    private ApprovalRequestRepository approvalRequestRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;


    public Map<String, Object> getDashboardStats(String departmentId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalStudents = userRepository.countByDepartmentAndRole(departmentId, "STUDENT");
        long totalFaculty = userRepository.countByDepartmentAndRole(departmentId, "FACULTY");
        long activeClubs = clubRepository.countByDepartment_IdAndStatus(departmentId, "ACTIVE");
        long runningEvents = eventRepository.countByDepartment_IdAndStatus(departmentId, "ACTIVE");
        long ongoingHackathons = hackathonRepository.countByDepartment_IdAndStatus(departmentId, "ONGOING");
        
        stats.put("totalStudents", totalStudents);
        stats.put("totalFaculty", totalFaculty);
        stats.put("activeClubs", activeClubs);
        stats.put("runningEvents", runningEvents);
        stats.put("ongoingHackathons", ongoingHackathons);
        
        Optional<DepartmentHealth> health = departmentHealthRepository.findByDepartment(new Department() {{ setId(departmentId); }});
        stats.put("healthScore", health.map(DepartmentHealth::getTotalHealthScore).orElse(0.0));
        
        return stats;
    }

    public List<Map<String, Object>> getFacultyMonitoring(String departmentId) {
        List<User> facultyList = userRepository.findByDepartmentAndRole(departmentId, "FACULTY");
        
        return facultyList.stream().map(f -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("name", f.getName());
            map.put("email", f.getEmail());
            
            long eventCount = eventRepository.countByFacultyId(f.getId());
            map.put("eventsManaged", eventCount);
            
            // Simplified performance logic
            double performance = (eventCount * 10.0); // Dummy calc, replace with real metrics
            map.put("performanceScore", Math.min(performance, 100.0));
            map.put("status", performance < 20 ? "RISK" : "STABLE");
            
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void processApproval(String requestId, ApprovalRequest.RequestStatus status, String remarks) {
        ApprovalRequest request = approvalRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Approval request not found"));
        
        request.setStatus(status);
        request.setRemarks(remarks);
        approvalRequestRepository.save(request);
        
        // Handle side effects
        if (status == ApprovalRequest.RequestStatus.APPROVED) {
            updateEntityStatus(request.getType(), request.getReferenceId(), "ACTIVE");
        } else if (status == ApprovalRequest.RequestStatus.REJECTED) {
            updateEntityStatus(request.getType(), request.getReferenceId(), "REJECTED");
        }
    }

    private void updateEntityStatus(ApprovalRequest.RequestType type, String id, String status) {
        switch (type) {
            case EVENT:
                eventRepository.findById(id).ifPresent(e -> { e.setStatus(status); eventRepository.save(e); });
                break;
            case HACKATHON:
                hackathonRepository.findById(id).ifPresent(h -> { h.setStatus(status); hackathonRepository.save(h); });
                break;
            case CLUB:
                clubRepository.findById(id).ifPresent(c -> { c.setStatus(status); clubRepository.save(c); });
                break;
        }
    }

    public List<Map<String, Object>> getStudentMonitoring(String departmentId) {
        List<User> studentList = userRepository.findByDepartmentAndRole(departmentId, "STUDENT");
        
        return studentList.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("email", s.getEmail());
            map.put("year", s.getYear());
            
            long participationCount = eventRegistrationRepository.countByUserId(s.getId());
            map.put("participationCount", participationCount);
            
            double engagement = (participationCount * 5.0); // Dummy calc
            map.put("engagementScore", Math.min(engagement, 100.0));
            map.put("status", engagement < 10 ? "LOW_ENGAGEMENT" : "ACTIVE");
            
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getDetailedHealth(String departmentId) {
        Department department = new Department();
        department.setId(departmentId);
        
        DepartmentHealth health = departmentHealthRepository.findByDepartment(department)
            .orElseGet(() -> {
                DepartmentHealth newHealth = new DepartmentHealth();
                newHealth.setDepartment(department);
                return departmentHealthRepository.save(newHealth);
            });
            
        Map<String, Object> details = new HashMap<>();
        details.put("totalHealthScore", health.getTotalHealthScore());
        details.put("participationRate", health.getParticipationRate());
        details.put("facultyPerformance", health.getFacultyPerformance());
        details.put("studentEngagement", health.getStudentEngagement());
        details.put("clubPerformance", health.getClubPerformance());
        details.put("budgetEfficiency", health.getBudgetEfficiency());
        
        return details;
    }

    public List<ApprovalRequest> getPendingApprovals(String hodId) {
        User hod = new User();
        hod.setId(hodId);
        return approvalRequestRepository.findByHodAndStatus(hod, ApprovalRequest.RequestStatus.PENDING);
    }
}
