package com.eventmanager.service;

import com.eventmanager.model.AmbassadorMetrics;
import com.eventmanager.model.User;
import com.eventmanager.repository.AmbassadorMetricsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RewardCalculationService {

    @Autowired
    private AmbassadorMetricsRepository metricsRepository;

    public void calculateAndSetRewardPoints(User ambassador) {
        AmbassadorMetrics metrics = metricsRepository.findByUserId(ambassador.getId())
                .orElse(new AmbassadorMetrics());
        
        // Base Calculation
        // CLICK = 1, REG = 5, PART = 10, COMP = 20
        double basePoints = (metrics.getTotalReferrals() * 1.0) +
                         (metrics.getSuccessfulRegistrations() * 5.0) +
                         (metrics.getSuccessfulParticipations() * 10.0);
                         // Note: Completion points would be added here if tracked separately
        
        double finalPoints = basePoints;

        // Bonus: High Conversion (> 50%)
        if (metrics.getConversionRate() > 50.0) {
            finalPoints *= 1.20;
        }

        // Bonus: Consistency
        if (metrics.getConsistencyScore() > 10.0) { // Assume normalized scale
            finalPoints *= 1.15;
        }

        // Penalty: Fraud
        if (metrics.getFraudScore() > 5.0) { // Threshold for penalty
            finalPoints *= 0.60; // 40% reduction
            metrics.setValidationStatus("SUSPICIOUS");
        } else if (metrics.getFraudScore() > 10.0) {
            metrics.setValidationStatus("BLOCKED");
        }

        metrics.setRewardPoints((int) finalPoints);
        metricsRepository.save(metrics);
    }
}
