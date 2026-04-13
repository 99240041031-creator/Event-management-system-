package com.eventmanager.service;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClubManagementService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubMembershipRepository clubMembershipRepository;



    @Autowired
    private ClubEventRepository clubEventRepository;

    @Autowired
    private ClubHackathonRepository clubHackathonRepository;

    @Autowired
    private ClubHackathonTeamRepository clubHackathonTeamRepository;

    @Autowired
    private HackathonScoreRepository hackathonScoreRepository;

    @Autowired
    private ClubPostRepository clubPostRepository;

    @Autowired
    private ClubBudgetRepository clubBudgetRepository;

    @Autowired
    private AmbassadorRepository ambassadorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    // --- Club Overview ---
    public Club getClubDetails(String clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club", "id", clubId));
    }

    @Transactional
    public Club updateClubDetails(String clubId, Club clubDetails) {
        Club club = getClubDetails(clubId);
        club.setName(clubDetails.getName());
        club.setDescription(clubDetails.getDescription());
        // Update other fields as needed
        return clubRepository.save(club);
    }

    // --- Member Management ---
    public List<ClubMembership> getMembers(String clubId) {
        return clubMembershipRepository.findByClubId(clubId);
    }

    @Transactional
    public ClubMembership addMember(String clubId, String userId, String role) {
        if (clubMembershipRepository.findByUserIdAndClubId(userId, clubId).isPresent()) {
            throw new RuntimeException("User is already a member");
        }
        Club club = getClubDetails(clubId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ClubMembership membership = new ClubMembership();
        membership.setClub(club);
        membership.setUser(user);
        membership.setRole(role);
        membership.setStatus("ACTIVE");
        
        // Log action
        auditLogService.log("ADD_MEMBER", "CLUB", clubId, 
            "Added user " + user.getEmail() + " as " + role, null);
            
        return clubMembershipRepository.save(membership);
    }

    @Transactional
    public void removeMember(String clubId, String userId) {
        ClubMembership membership = clubMembershipRepository.findByUserIdAndClubId(userId, clubId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        clubMembershipRepository.delete(membership);
        
        auditLogService.log("REMOVE_MEMBER", "CLUB", clubId, 
            "Removed user " + userId, null);
    }
    
    @Transactional
    public void updateMemberRole(String clubId, String userId, String newRole) {
        ClubMembership membership = clubMembershipRepository.findByUserIdAndClubId(userId, clubId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        membership.setRole(newRole);
        clubMembershipRepository.save(membership);
        
        auditLogService.log("UPDATE_MEMBER_ROLE", "CLUB", clubId, 
            "Updated user " + userId + " role to " + newRole, null);
    }

    // --- Club Events ---
    public List<ClubEvent> getClubEvents(String clubId) {
        return clubEventRepository.findByClubId(clubId);
    }

    @Transactional
    public ClubEvent createEvent(String clubId, ClubEvent event) {
        Club club = getClubDetails(clubId);
        event.setClub(club);
        event.setStatus("SCHEDULED");
        return clubEventRepository.save(event);
    }
    
    // --- Club Hackathons ---
    public List<ClubHackathon> getClubHackathons(String clubId) {
        return clubHackathonRepository.findByClubId(clubId);
    }
    
    @Transactional
    public ClubHackathon createHackathon(String clubId, ClubHackathon hackathon) {
        Club club = getClubDetails(clubId);
        hackathon.setClub(club);
        hackathon.setStatus("SCHEDULED");
        return clubHackathonRepository.save(hackathon);
    }
    
    // --- Club Posts ---
    public List<ClubPost> getClubPosts(String clubId) {
        return clubPostRepository.findByClubIdOrderByCreatedAtDesc(clubId);
    }
    
    @Transactional
    public ClubPost createPost(String clubId, ClubPost post) {
        Club club = getClubDetails(clubId);
        post.setClub(club);
        return clubPostRepository.save(post);
    }
    
    // --- Budget ---
    public ClubBudget getBudget(String clubId) {
        return clubBudgetRepository.findByClubId(clubId)
                .orElseGet(() -> {
                    ClubBudget budget = new ClubBudget();
                    budget.setClub(getClubDetails(clubId));
                    budget.setAllocated(0.0);
                    budget.setSpent(0.0);
                    return clubBudgetRepository.save(budget);
                });
    }
    
    // --- Ambassadors ---
    public List<Ambassador> getAmbassadors(String clubId) {
        return ambassadorRepository.findByClubId(clubId);
    }
    
    @Transactional
    public Ambassador addAmbassador(String clubId, String userId) {
        Club club = getClubDetails(clubId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                
        Ambassador ambassador = new Ambassador();
        ambassador.setClub(club);
        ambassador.setStudent(user);
        ambassador.setStatus("ACTIVE");
        return ambassadorRepository.save(ambassador);
    }
    
    // --- Hackathon Teams & Scoring ---
    @Transactional
    public ClubHackathonTeam registerTeam(String hackathonId, ClubHackathonTeam team) {
        ClubHackathon hackathon = clubHackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", hackathonId));
        team.setHackathon(hackathon);
        return clubHackathonTeamRepository.save(team);
    }
    
    public List<ClubHackathonTeam> getHackathonTeams(String hackathonId) {
        return clubHackathonTeamRepository.findByHackathonId(hackathonId);
    }
    
    @Transactional
    public void scoreTeam(String teamId, String judgeId, HackathonScore score) {
        ClubHackathonTeam team = clubHackathonTeamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", teamId));
        User judge = userRepository.findById(judgeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", judgeId));
                
        score.setTeam(team);
        score.setJudge(judge);
        hackathonScoreRepository.save(score);
        
        // Update team total score (simple average or sum logic)
        updateTeamTotalScore(team);
    }
    
    private void updateTeamTotalScore(ClubHackathonTeam team) {
        List<HackathonScore> scores = hackathonScoreRepository.findByTeamId(team.getId());
        double total = scores.stream().mapToDouble(HackathonScore::getTotalScore).average().orElse(0.0);
        team.setTotalScore(total);
        clubHackathonTeamRepository.save(team);
    }
    
    public List<ClubHackathonTeam> getHackathonLeaderboard(String hackathonId) {
        return clubHackathonTeamRepository.findByHackathonIdOrderByTotalScoreDesc(hackathonId);
    }

}
