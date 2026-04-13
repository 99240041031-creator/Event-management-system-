package com.eventmanager.controller;


import com.eventmanager.model.User;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.service.AmbassadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/referrals")
@PreAuthorize("hasAnyRole('AMBASSADOR')")
public class ReferralController {

    @Autowired
    private AmbassadorService ambassadorService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/funnel")
    public ResponseEntity<?> getFunnel(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(ambassadorService.getReferralFunnel(user));
    }

    @GetMapping("/link")
    public ResponseEntity<?> getLink(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(ambassadorService.getReferralLink(user));
    }

    @GetMapping("/qr")
    public ResponseEntity<?> getQR(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
            Map<String, String> linkData = ambassadorService.getReferralLink(user);
            String qrBase64 = ambassadorService.generateQRCodeBase64(linkData.get("link"));
            return ResponseEntity.ok(Map.of("qrCode", "data:image/png;base64," + qrBase64));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to generate QR");
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(ambassadorService.getReferredStudents(user));
    }
}
