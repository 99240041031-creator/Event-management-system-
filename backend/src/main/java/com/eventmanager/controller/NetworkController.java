package com.eventmanager.controller;

import com.eventmanager.service.AmbassadorService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/network")
@PreAuthorize("hasAnyRole('AMBASSADOR')")
public class NetworkController {

    @Autowired
    private AmbassadorService ambassadorService;

    @GetMapping("/graph")
    public ResponseEntity<?> getGraph() {
        return ResponseEntity.ok(ambassadorService.getNetworkGraph());
    }
}
