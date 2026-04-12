package com.eventmanager.repository;

import com.eventmanager.model.AmbassadorNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbassadorNetworkRepository extends JpaRepository<AmbassadorNetwork, String> {
    List<AmbassadorNetwork> findByAmbassadorId(String ambassadorId);
    
    Optional<AmbassadorNetwork> findByAmbassadorIdAndSourceCampusIdAndTargetCampusId(
            String ambassadorId, String sourceCampusId, String targetCampusId);
}
