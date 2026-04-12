package com.eventmanager.controller;

import com.eventmanager.model.User;
import com.eventmanager.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ambassador/core")
public class AmbassadorCoreController {

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @Autowired
    private RewardCalculationService rewardCalculationService;

    @Autowired
    private AmbassadorRankingService rankingService;

    @Autowired
    private AmbassadorNetworkService networkService;

    @Autowired
    private UserService userService;

    @PostMapping("/track-referral")
    @PreAuthorize("hasRole('AMBASSADOR')")
    public ResponseEntity<?> trackReferral(
            @RequestParam String ambassadorId,
            @RequestParam String campaignId,
            @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
            @RequestHeader(value = "X-Device-Fingerprint") String fingerprint,
            @RequestBody Map<String, String> registrationData) {
        
        User ambassador = userService.getUserById(ambassadorId);
        String email = registrationData.get("email");

        // 1. Anti-Fraud Check
        int fraudScore = fraudDetectionService.calculateFraudScore(ambassador, ip, fingerprint, email);
        
        if (fraudScore > 10) {
            return ResponseEntity.status(403).body("Action blocked due to suspicious activity patterns.");
        }

        // 2. Track Multi-College Impact
        String sourceCollegeId = registrationData.get("sourceCollegeId");
        String targetCollegeId = registrationData.get("targetCollegeId");
        if (sourceCollegeId != null && targetCollegeId != null) {
            networkService.trackInterCollegeReferral(ambassador, sourceCollegeId, targetCollegeId);
        }

        // 3. Trigger Calculation & Ranking
        rewardCalculationService.calculateAndSetRewardPoints(ambassador);
        rankingService.updateGlobalRankings();

        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "fraudScore", fraudScore,
            "message", "Referral tracked and ranking updated."
        ));
    }

    @GetMapping("/ranking/refresh")
    @PreAuthorize("hasRole('ADMIN') or hasRole('AMBASSADOR')")
    public ResponseEntity<?> forceRefreshRankings() {
        rankingService.updateGlobalRankings();
        return ResponseEntity.ok("Global rankings refreshed and broadcasted.");
    }
}
