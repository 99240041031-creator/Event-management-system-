package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.dto.CertificateDto;
import com.eventmanager.model.User;
import com.eventmanager.service.CertificateService;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/student/certificates")
    public ResponseEntity<ApiResponse<List<CertificateDto>>> getStudentCertificates(@RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.getUserCertificates(userId)));
    }

    @GetMapping("/certificates/{id}")
    public ResponseEntity<ApiResponse<CertificateDto>> getCertificate(@PathVariable String id, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.getCertificateById(id, userId)));
    }

    @GetMapping("/certificates/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String id, @RequestParam String userId) {
        byte[] pdf = certificateService.downloadCertificatePdf(id, userId);
        CertificateDto dto = certificateService.getCertificateById(id, userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Certificate_" + dto.getCertificateId() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PostMapping("/certificates/seed")
    public ResponseEntity<ApiResponse<String>> seedCertificates(@RequestParam String userId) {
        try {
            certificateService.seedCertificateData(userId);
            return ResponseEntity.ok(ApiResponse.success("Certificates seeded successfully", null));
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.internalServerError().body(ApiResponse.error("Seed failed: " + e.getMessage()));
        }
    }

    @PostMapping("/certificates/seed-all")
    public ResponseEntity<ApiResponse<String>> seedAllCertificates() {
        try {
            certificateService.seedAllCertificates();
            return ResponseEntity.ok(ApiResponse.success("Certificates seeded for all users", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Global seed failed: " + e.getMessage()));
        }
    }

    @GetMapping("/certificates/debug/user-id")
    public ResponseEntity<ApiResponse<String>> getUserIdByName(@RequestParam String name) {
        try {
            return userRepository.findAll().stream()
                    .filter(u -> u.getName() != null && u.getName().equalsIgnoreCase(name))
                    .findFirst()
                    .map(u -> ResponseEntity.ok(ApiResponse.success(u.getId())))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found: " + name)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/certificates/debug/id-list")
    public void listIds(jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        response.setContentType("text/plain");
        for (User u : userRepository.findAll()) {
            response.getWriter().println(u.getId() + " : " + u.getName());
        }
    }
}
