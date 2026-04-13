package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.dto.EventTeamMemberDto;
import com.eventmanager.model.Event;
import com.eventmanager.model.EventTeam;
import com.eventmanager.model.User;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.EventTeamRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events/{eventId}/team")
public class EventTeamController {

    @Autowired
    private EventTeamRepository eventTeamRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventTeamMemberDto>>> getTeamMembers(@PathVariable String eventId) {
        List<EventTeam> team = eventTeamRepository.findByEventId(eventId);
        List<EventTeamMemberDto> dtos = team.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventTeamMemberDto>> addTeamMember(
            @PathVariable String eventId,
            @RequestBody EventTeamMemberDto request) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already assigned
        if (eventTeamRepository.findByEventIdAndUserId(eventId, user.getId()).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User is already a team member"));
        }

        EventTeam teamMember = new EventTeam();
        teamMember.setEvent(event);
        teamMember.setUser(user);
        teamMember.setRole(request.getRole());

        // Set assigned by current user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            userRepository.findByEmail(auth.getName()).ifPresent(teamMember::setAssignedBy);
        }

        EventTeam savedMember = eventTeamRepository.save(teamMember);
        return ResponseEntity.ok(ApiResponse.success(convertToDto(savedMember)));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeTeamMember(
            @PathVariable String eventId,
            @PathVariable String userId) {

        EventTeam member = eventTeamRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        eventTeamRepository.delete(member);
        return ResponseEntity.ok(ApiResponse.success("Member removed", null));
    }

    private EventTeamMemberDto convertToDto(EventTeam member) {
        EventTeamMemberDto dto = new EventTeamMemberDto();
        dto.setId(member.getId());
        dto.setEventId(member.getEvent().getId());
        dto.setUserId(member.getUser().getId());
        dto.setUserName(member.getUser().getName());
        dto.setUserEmail(member.getUser().getEmail());
        dto.setRole(member.getRole());
        dto.setAssignedAt(member.getAssignedAt());

        if (member.getAssignedBy() != null) {
            dto.setAssignedById(member.getAssignedBy().getId());
            dto.setAssignedByName(member.getAssignedBy().getName());
        }

        return dto;
    }
}
