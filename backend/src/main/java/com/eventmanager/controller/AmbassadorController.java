package com.eventmanager.controller;

import com.eventmanager.model.AmbassadorMetrics;
import com.eventmanager.model.ReferralCampaign;
import com.eventmanager.model.User;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.service.AmbassadorChatService;
import com.eventmanager.service.AmbassadorCertificateService;
import com.eventmanager.service.AmbassadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ambassador")
@PreAuthorize("hasAnyRole('AMBASSADOR')")
public class AmbassadorController {

    @Autowired
    private AmbassadorService ambassadorService;

    @Autowired
    private AmbassadorCertificateService certificateService;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmbassadorChatService chatService;

    @GetMapping("/metrics")
    public ResponseEntity<AmbassadorMetrics> getMyMetrics(Authentication authentication) {
        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ambassadorService.getOrCreateMetrics(userOpt.get()));
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<ReferralCampaign>> getMyCampaigns(Authentication authentication) {
        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ambassadorService.getActiveCampaigns(userOpt.get()));
    }

    @PostMapping("/campaigns")
    public ResponseEntity<ReferralCampaign> createCampaign(Authentication authentication, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();
        
        String name = payload.get("name");
        String target = payload.get("targetAudience");
        
        ReferralCampaign created = ambassadorService.createCampaign(userOpt.get(), name, target, null);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/certificate/download")
    public ResponseEntity<byte[]> downloadCertificate(Authentication authentication) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();
            User user = userOpt.get();
            
            AmbassadorMetrics metrics = ambassadorService.getOrCreateMetrics(user);
            byte[] pdfBytes = certificateService.generateAmbassadorCertificate(user, metrics.getAmbassadorRank(), metrics.getSuccessfulRegistrations());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Ambassador_Certificate.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getMyStudents(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(ambassadorService.getReferredStudents(user));
    }

    @GetMapping("/rewards/history")
    public ResponseEntity<?> getRewardHistory(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(ambassadorService.getRewardHistory(user));
    }

    @GetMapping("/campuses")
    public ResponseEntity<?> getCampuses() {
        return ResponseEntity.ok(ambassadorService.getAllCampuses());
    }

    @GetMapping("/chat/messages/{roomId}")
    public ResponseEntity<?> getChatHistory(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getRoomHistory(roomId));
    }

    @PostMapping("/chat/send")
    public ResponseEntity<?> sendMessage(Authentication authentication, @RequestBody Map<String, String> payload) {
        User sender = userRepository.findByEmail(authentication.getName()).orElseThrow();
        String content = payload.get("content");
        String roomId = payload.get("roomId");
        return ResponseEntity.ok(chatService.sendMessage(sender, content, roomId));
    }
}
