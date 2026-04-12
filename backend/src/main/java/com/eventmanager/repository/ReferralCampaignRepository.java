package com.eventmanager.repository;

import com.eventmanager.model.ReferralCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReferralCampaignRepository extends JpaRepository<ReferralCampaign, String> {
    List<ReferralCampaign> findByAmbassadorId(String ambassadorId);
}
