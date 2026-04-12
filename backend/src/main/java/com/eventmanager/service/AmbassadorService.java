package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AmbassadorService {

    @Autowired
    private AmbassadorMetricsRepository metricsRepository;
    
    @Autowired
    private RewardTransactionRepository rewardTransactionRepository;

    @Autowired
    private ReferralCampaignRepository campaignRepository;

    @Autowired
    private ReferralRecordRepository recordRepository;

    @Autowired
    private ExternalCampusRepository campusRepository;

    @Autowired
    private AmbassadorNetworkRepository networkRepository;

    @Autowired
    private ReferralClickRepository clickRepository;

    @Autowired
    private FraudLogRepository fraudLogRepository;

    @Autowired
    private EventRepository eventRepository;

    public AmbassadorMetrics getOrCreateMetrics(User user) {
        return metricsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    AmbassadorMetrics m = new AmbassadorMetrics();
                    m.setUser(user);
                    return metricsRepository.save(m);
                });
    }

    public Map<String, Object> getReferralFunnel(User ambassador) {
        long totalClicks = clickRepository.countByCampaignAmbassadorId(ambassador.getId());
        long registrations = recordRepository.countByCampaignAmbassadorId(ambassador.getId());
        long participations = recordRepository.countByCampaignAmbassadorIdAndConversionStatus(ambassador.getId(), "PARTICIPATED");
        long completions = recordRepository.countByCampaignAmbassadorIdAndConversionStatus(ambassador.getId(), "COMPLETED");

        return Map.of(
            "clicks", totalClicks,
            "registrations", registrations,
            "participations", participations,
            "completions", completions,
            "dropOffRate", totalClicks > 0 ? (1.0 - (double)registrations/totalClicks) * 100 : 0.0
        );
    }

    public Map<String, String> getReferralLink(User ambassador) {
        List<ReferralCampaign> campaigns = campaignRepository.findByAmbassadorId(ambassador.getId());
        if (campaigns.isEmpty()) {
            ReferralCampaign c = createCampaign(ambassador, "Primary Protocol", "Global Matrix", null);
            return Map.of("link", c.getReferralLink(), "code", c.getReferralToken());
        }
        ReferralCampaign primary = campaigns.get(0);
        return Map.of("link", primary.getReferralLink(), "code", primary.getReferralToken());
    }

    public String generateQRCodeBase64(String text) throws Exception {
        com.google.zxing.qrcode.QRCodeWriter qrCodeWriter = new com.google.zxing.qrcode.QRCodeWriter();
        com.google.zxing.common.BitMatrix bitMatrix = qrCodeWriter.encode(text, com.google.zxing.BarcodeFormat.QR_CODE, 200, 200);
        
        java.io.ByteArrayOutputStream pngOutputStream = new java.io.ByteArrayOutputStream();
        com.google.zxing.client.j2se.MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        return java.util.Base64.getEncoder().encodeToString(pngData);
    }

    public Map<String, Object> getRewardBreakdown(User ambassador) {
        List<RewardTransaction> txs = rewardTransactionRepository.findByAmbassadorIdOrderByAwardedAtDesc(ambassador.getId());
        
        int registrationPoints = txs.stream().filter(t -> "REGISTRATION".equals(t.getEventType())).mapToInt(RewardTransaction::getPointsAwarded).sum();
        int participationPoints = txs.stream().filter(t -> "PARTICIPATION".equals(t.getEventType())).mapToInt(RewardTransaction::getPointsAwarded).sum();
        int clickPoints = txs.stream().filter(t -> "CLICK".equals(t.getEventType())).mapToInt(RewardTransaction::getPointsAwarded).sum();
        int bonus = txs.stream().filter(t -> "BONUS".equals(t.getEventType())).mapToInt(RewardTransaction::getPointsAwarded).sum();
        int penalty = txs.stream().filter(t -> "PENALTY".equals(t.getEventType())).mapToInt(RewardTransaction::getPointsAwarded).sum();

        return Map.of(
            "registrationPoints", registrationPoints,
            "participationPoints", participationPoints,
            "clickPoints", clickPoints,
            "bonus", bonus,
            "penalty", penalty,
            "total", registrationPoints + participationPoints + clickPoints + bonus - penalty
        );
    }

    public Map<String, Object> getFraudStatus(User ambassador) {
        AmbassadorMetrics metrics = getOrCreateMetrics(ambassador);
        List<FraudLog> logs = fraudLogRepository.findByAmbassadorId(ambassador.getId());
        
        return Map.of(
            "suspiciousCount", logs.size(),
            "status", metrics.getValidationStatus(),
            "fraudScore", metrics.getFraudScore(),
            "alerts", logs
        );
    }

    public Map<String, Object> getRankingDetails(User ambassador) {
        AmbassadorMetrics metrics = getOrCreateMetrics(ambassador);
        return Map.of(
            "currentRank", metrics.getAmbassadorRank(),
            "rawScore", metrics.getRawRankingScore(),
            "consistency", metrics.getConsistencyScore(),
            "reachScore", metrics.getNetworkReachScore(),
            "movement", "UP" // Prototype movement logic
        );
    }

    public Map<String, Object> getNetworkGraph() {
        List<ExternalCampus> campuses = campusRepository.findAll();
        List<AmbassadorNetwork> connections = networkRepository.findAll(); // Campus connectivity matrix
        
        return Map.of(
            "nodes", campuses.stream().map(c -> Map.of(
                "id", c.getId(),
                "name", c.getName(),
                "rank", 1, // Default tier for prototype
                "students", c.getStudentReach()
            )).toList(),
            "links", connections.stream().map(l -> Map.of(
                "source", l.getSourceCampus().getId(),
                "target", l.getTargetCampus().getId(),
                "value", l.getTransferVolume()
            )).toList()
        );
    }

    public List<Event> getAssignedEvents() {
        return eventRepository.findAll(); // Promotion deck events
    }

    public List<ReferralCampaign> getActiveCampaigns(User ambassador) {
        return campaignRepository.findByAmbassadorId(ambassador.getId());
    }

    public ReferralCampaign createCampaign(User ambassador, String name, String target, Event event) {
        ReferralCampaign campaign = new ReferralCampaign();
        campaign.setAmbassador(ambassador);
        campaign.setName(name);
        campaign.setTargetAudience(target);
        campaign.setEvent(event);
        
        String rawContent = ambassador.getId() + (event != null ? event.getId() : "platform") + System.currentTimeMillis();
        String token = org.springframework.util.DigestUtils.md5DigestAsHex(rawContent.getBytes()).substring(0, 12).toUpperCase();
        
        campaign.setReferralToken(token);
        campaign.setReferralLink("http://localhost:5173/referral/" + token);
        
        return campaignRepository.save(campaign);
    }

    public List<ReferralRecord> getReferredStudents(User ambassador) {
        return recordRepository.findByCampaignAmbassadorId(ambassador.getId());
    }

    public List<RewardTransaction> getRewardHistory(User ambassador) {
        return rewardTransactionRepository.findByAmbassadorIdOrderByAwardedAtDesc(ambassador.getId());
    }

    public List<ExternalCampus> getAllCampuses() {
        return campusRepository.findAll();
    }

    public void addPoints(User user, int points, String type, String source) {
        AmbassadorMetrics metrics = getOrCreateMetrics(user);
        metrics.setRewardPoints(metrics.getRewardPoints() + points);
        metricsRepository.save(metrics);

        RewardTransaction tx = new RewardTransaction();
        tx.setAmbassador(user);
        tx.setPointsAwarded(points);
        tx.setEventType(type);
        tx.setSourceReference(source);
        rewardTransactionRepository.save(tx);
    }
}
