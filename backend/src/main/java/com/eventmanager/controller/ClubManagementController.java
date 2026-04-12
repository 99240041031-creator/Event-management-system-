package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.*;
import com.eventmanager.service.ClubManagementService;
import com.eventmanager.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty/clubs")
@PreAuthorize("hasRole('FACULTY')")
public class ClubManagementController {

    @Autowired
    private ClubManagementService clubManagementService;

    // --- Club Overview ---
    @GetMapping("/{clubId}")
    public ResponseEntity<ApiResponse<Club>> getClubDetails(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getClubDetails(clubId)));
    }

    @PutMapping("/{clubId}")
    public ResponseEntity<ApiResponse<Club>> updateClubDetails(@PathVariable String clubId, @RequestBody Club club) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.updateClubDetails(clubId, club)));
    }

    // --- Member Management ---
    @GetMapping("/{clubId}/members")
    public ResponseEntity<ApiResponse<List<ClubMembership>>> getMembers(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getMembers(clubId)));
    }

    @PostMapping("/{clubId}/members")
    public ResponseEntity<ApiResponse<ClubMembership>> addMember(@PathVariable String clubId, @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String role = request.get("role");
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.addMember(clubId, userId, role)));
    }

    @DeleteMapping("/{clubId}/members/{userId}")
    public ResponseEntity<ApiResponse<String>> removeMember(@PathVariable String clubId, @PathVariable String userId) {
        clubManagementService.removeMember(clubId, userId);
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully"));
    }

    @PutMapping("/{clubId}/members/{userId}")
    public ResponseEntity<ApiResponse<String>> updateMemberRole(@PathVariable String clubId, @PathVariable String userId, @RequestBody Map<String, String> request) {
        String role = request.get("role");
        clubManagementService.updateMemberRole(clubId, userId, role);
        return ResponseEntity.ok(ApiResponse.success("Member role updated successfully"));
    }

    // --- Events ---
    @GetMapping("/{clubId}/events")
    public ResponseEntity<ApiResponse<List<ClubEvent>>> getClubEvents(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getClubEvents(clubId)));
    }

    @PostMapping("/{clubId}/events")
    public ResponseEntity<ApiResponse<ClubEvent>> createEvent(@PathVariable String clubId, @RequestBody ClubEvent event) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.createEvent(clubId, event)));
    }

    // --- Hackathons ---
    @GetMapping("/{clubId}/hackathons")
    public ResponseEntity<ApiResponse<List<ClubHackathon>>> getClubHackathons(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getClubHackathons(clubId)));
    }

    @PostMapping("/{clubId}/hackathons")
    public ResponseEntity<ApiResponse<ClubHackathon>> createHackathon(@PathVariable String clubId, @RequestBody ClubHackathon hackathon) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.createHackathon(clubId, hackathon)));
    }
    
    // Hackathon Teams (Public/Student access might be needed, but sticking to faculty logic for now or overrides)
    @GetMapping("/hackathons/{hackathonId}/teams")
    public ResponseEntity<ApiResponse<List<ClubHackathonTeam>>> getHackathonTeams(@PathVariable String hackathonId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getHackathonTeams(hackathonId)));
    }
    
    // Register team (Likely studnet action, but maybe faculty adds manually?)
    @PostMapping("/hackathons/{hackathonId}/teams")
    public ResponseEntity<ApiResponse<ClubHackathonTeam>> registerTeam(@PathVariable String hackathonId, @RequestBody ClubHackathonTeam team) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.registerTeam(hackathonId, team)));
    }
    
    // Score Team
    @PostMapping("/hackathons/teams/{teamId}/score")
    public ResponseEntity<ApiResponse<String>> scoreTeam(@PathVariable String teamId, @RequestBody HackathonScore score, Authentication authentication) {
        String judgeId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        clubManagementService.scoreTeam(teamId, judgeId, score);
        return ResponseEntity.ok(ApiResponse.success("Score submitted successfully"));
    }
    
    @GetMapping("/hackathons/{hackathonId}/leaderboard")
    public ResponseEntity<ApiResponse<List<ClubHackathonTeam>>> getLeaderboard(@PathVariable String hackathonId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getHackathonLeaderboard(hackathonId)));
    }

    // --- Posts ---
    @GetMapping("/{clubId}/posts")
    public ResponseEntity<ApiResponse<List<ClubPost>>> getClubPosts(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getClubPosts(clubId)));
    }

    @PostMapping("/{clubId}/posts")
    public ResponseEntity<ApiResponse<ClubPost>> createPost(@PathVariable String clubId, @RequestBody ClubPost post) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.createPost(clubId, post)));
    }

    // --- Budget ---
    @GetMapping("/{clubId}/budget")
    public ResponseEntity<ApiResponse<ClubBudget>> getBudget(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getBudget(clubId)));
    }

    // --- Ambassadors ---
    @GetMapping("/{clubId}/ambassadors")
    public ResponseEntity<ApiResponse<List<Ambassador>>> getAmbassadors(@PathVariable String clubId) {
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.getAmbassadors(clubId)));
    }

    @PostMapping("/{clubId}/ambassadors")
    public ResponseEntity<ApiResponse<Ambassador>> addAmbassador(@PathVariable String clubId, @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        return ResponseEntity.ok(ApiResponse.success(clubManagementService.addAmbassador(clubId, userId)));
    }
}
