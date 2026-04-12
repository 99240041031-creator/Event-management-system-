package com.eventmanager.service;

import com.eventmanager.model.AmbassadorMetrics;
import com.eventmanager.repository.AmbassadorMetricsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class AmbassadorRankingService {

    @Autowired
    private AmbassadorMetricsRepository metricsRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void updateGlobalRankings() {
        List<AmbassadorMetrics> allMetrics = metricsRepository.findAll();
        if (allMetrics.isEmpty()) return;

        // 1. Calculate Min/Max for Normalization
        double maxReferrals = allMetrics.stream().mapToDouble(AmbassadorMetrics::getTotalReferrals).max().orElse(1.0);
        double minReferrals = allMetrics.stream().mapToDouble(AmbassadorMetrics::getTotalReferrals).min().orElse(0.0);
        
        // 2. Calculate Raw Scores with Weights
        for (AmbassadorMetrics metrics : allMetrics) {
            double normReferrals = (metrics.getTotalReferrals() - minReferrals) / (maxReferrals - minReferrals + 0.001);
            
            // Formula Logic
            // (0.25 * Referrals) + (0.20 * Conversion) + (0.20 * Participation) + (0.15 * Consistency) + (0.10 * Reach) - (0.10 * Fraud)
            double score = (0.25 * normReferrals) +
                         (0.20 * (metrics.getConversionRate() / 100.0)) +
                         (0.20 * (metrics.getSuccessfulParticipations() / 100.0)) + // Dummy scale for participation
                         (0.15 * metrics.getConsistencyScore()) +
                         (0.10 * metrics.getNetworkReachScore()) -
                         (0.10 * metrics.getFraudScore() / 10.0);
            
            metrics.setRawRankingScore(score);
        }

        // 3. Sort and Assign Ranks
        allMetrics.sort(Comparator.comparing(AmbassadorMetrics::getRawRankingScore).reversed());
        
        for (int i = 0; i < allMetrics.size(); i++) {
            AmbassadorMetrics m = allMetrics.get(i);
            m.setAmbassadorRank(i + 1);
            metricsRepository.save(m);
        }

        // 4. Real-time Broadcast
        messagingTemplate.convertAndSend("/topic/ambassador/ranking", allMetrics);
    }
}
