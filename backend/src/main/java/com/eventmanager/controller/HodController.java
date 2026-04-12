package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.ApprovalRequest;
import com.eventmanager.service.HodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hod")
@PreAuthorize("hasRole('DIRECTOR') or hasRole('HOD')")
public class HodController {

    @Autowired
    private HodService hodService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(@RequestParam String departmentId) {
        return ResponseEntity.ok(ApiResponse.success(hodService.getDashboardStats(departmentId)));
    }

    @GetMapping("/faculty")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFacultyMonitoring(@RequestParam String departmentId) {
        return ResponseEntity.ok(ApiResponse.success(hodService.getFacultyMonitoring(departmentId)));
    }

    @GetMapping("/approvals")
    public ResponseEntity<ApiResponse<List<ApprovalRequest>>> getPendingApprovals(@RequestParam String hodId) {
        return ResponseEntity.ok(ApiResponse.success(hodService.getPendingApprovals(hodId)));
    }

    @PostMapping("/approvals/{id}/process")
    public ResponseEntity<ApiResponse<String>> processApproval(
            @PathVariable String id,
            @RequestParam ApprovalRequest.RequestStatus status,
            @RequestBody(required = false) Map<String, String> body) {
        String remarks = body != null ? body.get("remarks") : "";
        hodService.processApproval(id, status, remarks);
        return ResponseEntity.ok(ApiResponse.success("Approval processed successfully"));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStudentMonitoring(@RequestParam String departmentId) {
        return ResponseEntity.ok(ApiResponse.success(hodService.getStudentMonitoring(departmentId)));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDepartmentHealth(@RequestParam String departmentId) {
        return ResponseEntity.ok(ApiResponse.success(hodService.getDetailedHealth(departmentId)));
    }
}
