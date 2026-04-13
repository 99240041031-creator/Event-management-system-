package com.eventmanager.controller;

import com.eventmanager.dto.*;
import com.eventmanager.service.ChatService;
import com.eventmanager.service.TeamService;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class TeamController {

    private final TeamService teamService;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public TeamController(TeamService teamService, ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.teamService = teamService;
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/teams")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getMyTeams(@RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getMyTeams(userId)));
    }

    @GetMapping("/team/{id}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeam(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeam(id)));
    }

    @PostMapping("/team/create")
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(@RequestBody CreateTeamRequest request, @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(teamService.createTeam(userId, request)));
    }

    @GetMapping("/team/invites")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getMyInvites(@RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getMyInvites(userId)));
    }

    @PostMapping("/team/{id}/invite")
    public ResponseEntity<ApiResponse<Void>> inviteMember(@PathVariable String id, @RequestBody InviteRequest request) {
        teamService.inviteMember(id, request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Member invited", null));
    }

    @PostMapping("/team/{id}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptInvite(@PathVariable String id, @RequestParam String userId) {
        teamService.acceptInvite(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Invite accepted", null));
    }

    @PostMapping("/team/{id}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveTeam(@PathVariable String id, @RequestParam String userId) {
        teamService.leaveTeam(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Left team successfully", null));
    }

    @PostMapping("/team/{id}/submit")
    public ResponseEntity<ApiResponse<Void>> submitProject(@PathVariable String id, @RequestBody SubmissionRequest request) {
        teamService.submitProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project submitted successfully", null));
    }

    @PostMapping("/team/{id}/chat")
    public ResponseEntity<ApiResponse<com.eventmanager.model.ChatMessage>> sendChatMessage(@PathVariable String id, @RequestBody Map<String, String> payload, @RequestParam String userId) {
        String content = payload.get("content");
        String type = payload.get("type"); // TEXT, IMAGE, FILE
        
        // Find or create the team chat room correctly
        com.eventmanager.model.ChatRoom room = chatService.getOrCreateRoom("TEAM", id, "TEAM_" + id);
        
        com.eventmanager.model.ChatMessage message = chatService.saveMessage(room.getId(), userId, content, type);
        messagingTemplate.convertAndSend("/topic/messages/TEAM_" + id, message);
        
        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
