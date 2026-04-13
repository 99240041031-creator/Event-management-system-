package com.eventmanager.service;

import com.eventmanager.model.ReferralCampaign;
import com.eventmanager.model.ReferralRecord;
import com.eventmanager.model.User;
import com.eventmanager.repository.ReferralCampaignRepository;
import com.eventmanager.repository.ReferralRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ReferralTrackingService {

    @Autowired
    private ReferralRecordRepository recordRepository;
    
    @Autowired
    private ReferralCampaignRepository campaignRepository;
    
    @Autowired
    private AmbassadorService ambassadorService;
    
    @Autowired
    private AmbassadorNotificationService notificationService;
    
    @Autowired
    private RewardCalculationService rewardService;
    
    @Autowired
    private AmbassadorRankingService rankingService;

    public void trackClick(String campaignId, String ipAddress) {
        Optional<ReferralCampaign> optCampaign = campaignRepository.findById(campaignId);
        if(optCampaign.isPresent()) {
            ReferralCampaign campaign = optCampaign.get();
            campaign.setClickCount(campaign.getClickCount() + 1);
            campaignRepository.save(campaign);
            
            ReferralRecord record = new ReferralRecord();
            record.setCampaign(campaign);
            record.setVisitorIp(ipAddress);
            record.setConversionStatus("CLICKED");
            recordRepository.save(record);
        }
    }

    public void processRegistration(String campaignId, User newUser) {
        Optional<ReferralCampaign> optCampaign = campaignRepository.findById(campaignId);
        if(optCampaign.isPresent()) {
            ReferralCampaign campaign = optCampaign.get();
            campaign.setRegistrationCount(campaign.getRegistrationCount() + 1);
            campaignRepository.save(campaign);
            
            ReferralRecord record = new ReferralRecord();
            record.setCampaign(campaign);
            record.setReferredUser(newUser);
            record.setConversionStatus("REGISTERED");
            record.setRegisteredAt(LocalDateTime.now());
            recordRepository.save(record);
            
            ambassadorService.addPoints(campaign.getAmbassador(), 50, "REGISTRATION", "Successful sign up via campaign " + campaign.getName());
            
            // Advanced Core Logic Hooks
            rewardService.calculateAndSetRewardPoints(campaign.getAmbassador());
            rankingService.updateGlobalRankings();
            
            notificationService.notifyReferralSuccess(campaign.getAmbassador().getId(), newUser.getFirstName(), 50);
        }
    }
}
