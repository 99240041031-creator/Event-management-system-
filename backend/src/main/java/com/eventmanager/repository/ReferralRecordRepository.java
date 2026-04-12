package com.eventmanager.repository;

import com.eventmanager.model.ReferralRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRecordRepository extends JpaRepository<ReferralRecord, String> {
    List<ReferralRecord> findByCampaignId(String campaignId);
    Optional<ReferralRecord> findByReferredUserId(String referredUserId);
    Long countByCampaignIdAndConversionStatus(String campaignId, String status);
    List<ReferralRecord> findByCampaignAmbassadorId(String ambassadorId);
    long countByCampaignAmbassadorId(String ambassadorId);
    long countByCampaignAmbassadorIdAndConversionStatus(String ambassadorId, String status);
}
