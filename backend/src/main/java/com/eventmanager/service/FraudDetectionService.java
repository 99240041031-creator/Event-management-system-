package com.eventmanager.service;

import com.eventmanager.model.FraudLog;
import com.eventmanager.model.User;
import com.eventmanager.repository.FraudLogRepository;
import com.eventmanager.repository.ReferralClickRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
public class FraudDetectionService {

    @Autowired
    private ReferralClickRepository clickRepository;

    @Autowired
    private FraudLogRepository fraudLogRepository;

    private static final Pattern TEMP_EMAIL_PATTERN = Pattern.compile(".*(yopmail|mailinator|tempmail|guerrillamail).*");

    public int calculateFraudScore(User ambassador, String ip, String fingerprint, String email) {
        int score = 0;

        // Rule 1: Duplicate IP (More than 5 clicks in 10 mins)
        long ipClicks = clickRepository.countByVisitorIpAndClickedAtAfter(ip, LocalDateTime.now().minusMinutes(10));
        if (ipClicks > 5) {
            score += 2;
            logFraud(ambassador, "DUPLICATE_IP", 2, "High frequency clicks from IP: " + ip);
        }

        // Rule 2: Device Fingerprint reuse
        long deviceUsage = clickRepository.countByDeviceFingerprintAndClickedAtAfter(fingerprint, LocalDateTime.now().minusHours(1));
        if (deviceUsage > 3) {
            score += 3;
            logFraud(ambassador, "DEVICE_REUSE", 3, "Suspicious device reuse: " + fingerprint);
        }

        // Rule 3: Fake email pattern
        if (email != null && TEMP_EMAIL_PATTERN.matcher(email.toLowerCase()).matches()) {
            score += 2;
            logFraud(ambassador, "FAKE_EMAIL", 2, "Disposable email detected: " + email);
        }
        
        // Rule 5: Rapid registrations (simulated via recent click log if needed)
        // This is handled better during the registration flow specifically

        return score;
    }

    private void logFraud(User ambassador, String type, int risk, String reason) {
        FraudLog log = new FraudLog();
        log.setAmbassador(ambassador);
        log.setActivityType(type);
        log.setRiskScore(risk);
        log.setReason(reason);
        fraudLogRepository.save(log);
    }
}
