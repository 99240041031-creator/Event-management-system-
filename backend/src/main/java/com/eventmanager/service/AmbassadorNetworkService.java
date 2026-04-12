package com.eventmanager.service;

import com.eventmanager.model.AmbassadorNetwork;
import com.eventmanager.model.ExternalCampus;
import com.eventmanager.model.User;
import com.eventmanager.repository.AmbassadorNetworkRepository;
import com.eventmanager.repository.ExternalCampusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AmbassadorNetworkService {

    @Autowired
    private AmbassadorNetworkRepository networkRepository;

    @Autowired
    private ExternalCampusRepository campusRepository;

    public void trackInterCollegeReferral(User ambassador, String sourceCampusId, String targetCampusId) {
        Optional<AmbassadorNetwork> optEdge = networkRepository
                .findByAmbassadorIdAndSourceCampusIdAndTargetCampusId(ambassador.getId(), sourceCampusId, targetCampusId);

        AmbassadorNetwork edge;
        if (optEdge.isPresent()) {
            edge = optEdge.get();
            edge.setReferralsCount(edge.getReferralsCount() + 1);
        } else {
            edge = new AmbassadorNetwork();
            edge.setAmbassador(ambassador);
            
            ExternalCampus source = campusRepository.findById(sourceCampusId).orElseThrow();
            ExternalCampus target = campusRepository.findById(targetCampusId).orElseThrow();
            
            edge.setSourceCampus(source);
            edge.setTargetCampus(target);
            edge.setReferralsCount(1);
        }

        // Calculation of weighted influence based on referrals count
        edge.setWeight(1.0 + Math.log10(edge.getReferralsCount() + 1));
        edge.setTransferVolume(edge.getReferralsCount());
        
        networkRepository.save(edge);
    }
}
