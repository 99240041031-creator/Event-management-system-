package com.eventmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AmbassadorNotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyAmbassador(String ambassadorId, String type, String message, Object payload) {
        Map<String, Object> data = new HashMap<>();
        data.put("type", type);
        data.put("message", message);
        data.put("payload", payload);
        
        messagingTemplate.convertAndSend("/topic/ambassador/" + ambassadorId, data);
    }
    
    public void notifyReferralSuccess(String ambassadorId, String referredName, int pointsGained) {
        notifyAmbassador(ambassadorId, "REFERRAL_SUCCESS", 
            "Success! " + referredName + " registered using your link.", 
            Map.of("points", pointsGained, "referred", referredName)
        );
    }
}
