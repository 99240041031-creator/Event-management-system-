package com.eventmanager.controller;

import com.eventmanager.model.User;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.service.AmbassadorService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ranking")
@PreAuthorize("hasAnyRole('AMBASSADOR')")
public class RankingController {

    @Autowired
    private AmbassadorService ambassadorService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/details")
    public ResponseEntity<?> getDetails(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(ambassadorService.getRankingDetails(user));
    }
}
