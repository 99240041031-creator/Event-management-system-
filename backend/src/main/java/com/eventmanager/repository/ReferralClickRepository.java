package com.eventmanager.repository;

import com.eventmanager.model.ReferralClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ReferralClickRepository extends JpaRepository<ReferralClick, String> {
    
    @Query("SELECT COUNT(rc) FROM ReferralClick rc WHERE rc.visitorIp = :ip AND rc.clickedAt > :since")
    long countByVisitorIpAndClickedAtAfter(@Param("ip") String ip, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(rc) FROM ReferralClick rc WHERE rc.deviceFingerprint = :fingerprint AND rc.clickedAt > :since")
    long countByDeviceFingerprintAndClickedAtAfter(@Param("fingerprint") String fingerprint, @Param("since") LocalDateTime since);

    long countByCampaignAmbassadorId(String ambassadorId);
}
