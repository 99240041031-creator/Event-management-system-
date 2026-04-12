package com.eventmanager.repository;

import com.eventmanager.model.ClubMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, String> {
    List<ClubMembership> findByUserId(String userId);

    List<ClubMembership> findByClubId(String clubId);

    Optional<ClubMembership> findByUserIdAndClubId(String userId, String clubId);
    Optional<ClubMembership> findByClubIdAndUserId(String clubId, String userId);
    
    long countByClubId(String clubId);
}
