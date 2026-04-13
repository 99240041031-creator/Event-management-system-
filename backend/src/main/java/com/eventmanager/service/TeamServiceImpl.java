package com.eventmanager.service;

import com.eventmanager.dto.*;
import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    private final ChatService chatService;

    public TeamServiceImpl(TeamRepository teamRepository, TeamMemberRepository teamMemberRepository, 
                           UserRepository userRepository, HackathonRepository hackathonRepository,
                           EventRepository eventRepository, NotificationService notificationService,
                           ActivityService activityService, ChatService chatService) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.hackathonRepository = hackathonRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
        this.activityService = activityService;
        this.chatService = chatService;
    }

    @Override
    public List<TeamDto> getMyTeams(String userId) {
        return teamMemberRepository.findByUserIdAndStatus(userId, "ACCEPTED").stream()
                .map(tm -> convertToDto(tm.getTeam()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDto> getMyInvites(String userId) {
        return teamMemberRepository.findByUserIdAndStatus(userId, "PENDING").stream()
                .map(tm -> convertToDto(tm.getTeam()))
                .collect(Collectors.toList());
    }

    @Override
    public TeamDto getTeam(String teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return convertToDto(team);
    }

    @Override
    public TeamDto createTeam(String userId, CreateTeamRequest request) {
        User leader = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team();
        team.setName(request.getName());
        team.setLeader(leader);
        team.setMaxMembers(request.getMaxMembers());
        team.setRequiredSkills(request.getRequiredSkills());
        team.setProjectDescription(request.getDescription());
        team.setJoinCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        team.setStatus("ACTIVE");
        team.setSubmissionStatus("NOT_SUBMITTED");

        if (request.getHackathonId() != null) {
            Hackathon h = hackathonRepository.findById(request.getHackathonId())
                    .orElseThrow(() -> new RuntimeException("Hackathon not found"));
            team.setHackathon(h);
        } else if (request.getEventId() != null) {
            Event e = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            team.setEvent(e);
        }

        Team savedTeam = teamRepository.save(team);

        TeamMember member = new TeamMember();
        member.setTeam(savedTeam);
        member.setUser(leader);
        member.setRole("LEADER");
        member.setStatus("ACCEPTED");
        teamMemberRepository.save(member);

        activityService.logActivity(userId, "TEAM_CREATED",
                "Created team " + team.getName(), savedTeam.getId(), team.getName());

        // Create Chat Room
        chatService.getOrCreateRoom("TEAM", savedTeam.getId(), "TEAM_" + savedTeam.getId());

        return convertToDto(savedTeam);
    }

    @Override
    public void inviteMember(String teamId, String email) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));

        if (teamMemberRepository.findByTeamAndUser(team, user).isPresent()) {
            throw new RuntimeException("User is already in the team or invited");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(user);
        member.setRole("MEMBER");
        member.setStatus("PENDING");
        teamMemberRepository.save(member);

        notificationService.createNotification(user.getId(), "Team Invitation", 
            "You have been invited to join team " + team.getName(), "TEAM_INVITE", teamId);
    }

    @Override
    public void acceptInvite(String teamId, String userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TeamMember member = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        if (!"PENDING".equals(member.getStatus())) {
            throw new RuntimeException("Invalid invitation status");
        }

        member.setStatus("ACCEPTED");
        teamMemberRepository.save(member);

        notificationService.createNotification(team.getLeader().getId(), "Invite Accepted", 
            user.getName() + " accepted your invite to " + team.getName(), "INVITE_ACCEPTED", teamId);
            
        activityService.logActivity(userId, "TEAM_JOINED", "Joined team " + team.getName(), team.getId(), team.getName());
    }

    @Override
    public void leaveTeam(String teamId, String userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TeamMember member = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if ("LEADER".equals(member.getRole())) {
            throw new RuntimeException("Leader cannot leave team. Transfer leadership or delete team.");
        }

        teamMemberRepository.delete(member);
        
        notificationService.createNotification(team.getLeader().getId(), "Member Left", 
            user.getName() + " left the team " + team.getName(), "TEAM_LEFT", teamId);
    }

    @Override
    public void submitProject(String teamId, SubmissionRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setGithubUrl(request.getProjectUrl());
        team.setDemoUrl(request.getDemoUrl());
        team.setFileUrl(request.getFileUrl());
        if (request.getDescription() != null) team.setProjectDescription(request.getDescription());
        
        team.setSubmissionStatus("SUBMITTED");
        team.setStatus("SUBMITTED");
        teamRepository.save(team);
    }

    private TeamDto convertToDto(Team team) {
        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        if (team.getHackathon() != null) {
            dto.setHackathonId(team.getHackathon().getId());
            dto.setHackathonName(team.getHackathon().getTitle());
        }
        if (team.getEvent() != null) {
            dto.setEventId(team.getEvent().getId());
            dto.setEventName(team.getEvent().getTitle());
        }
        if (team.getLeader() != null) {
            dto.setLeaderId(team.getLeader().getId());
            dto.setLeaderName(team.getLeader().getName());
        }
        dto.setProjectName(team.getProjectName());
        dto.setProjectDescription(team.getProjectDescription());
        dto.setGithubUrl(team.getGithubUrl());
        dto.setSubmissionStatus(team.getSubmissionStatus());
        dto.setJoinCode(team.getJoinCode());
        dto.setStatus(team.getStatus());
        dto.setMaxMembers(team.getMaxMembers());
        dto.setRequiredSkills(team.getRequiredSkills());
        dto.setDemoUrl(team.getDemoUrl());
        dto.setFileUrl(team.getFileUrl());
        dto.setCreatedAt(team.getCreatedAt());

        if (team.getMembers() != null) {
            dto.setMembers(team.getMembers().stream().map(m -> {
                TeamDto.TeamMemberDto md = new TeamDto.TeamMemberDto();
                md.setUserId(m.getUser().getId());
                md.setName(m.getUser().getName());
                md.setEmail(m.getUser().getEmail());
                md.setRole(m.getRole());
                md.setStatus(m.getStatus());
                md.setAvatar(m.getUser().getAvatar());
                return md;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
