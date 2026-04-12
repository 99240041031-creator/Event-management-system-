package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.User;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@PathVariable String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();
        Map<String, Object> profile = buildProfileMap(user);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();
        return ResponseEntity.ok(ApiResponse.success(buildProfileMap(user)));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @PathVariable String userId,
            @RequestBody Map<String, Object> updates,
            @AuthenticationPrincipal UserDetails userDetails) {

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();

        // Validate ownership
        if (!user.getEmail().equals(userDetails.getUsername())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));
        }

        // Apply updates
        if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
        if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
        if (updates.containsKey("bio")) user.setBio((String) updates.get("bio"));
        if (updates.containsKey("skills")) user.setSkills((String) updates.get("skills"));
        if (updates.containsKey("avatar")) user.setAvatar((String) updates.get("avatar"));
        if (updates.containsKey("department")) user.setDepartment((String) updates.get("department"));

        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", buildProfileMap(user)));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentStats(@PathVariable String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();

        Map<String, Object> stats = new HashMap<>();
        stats.put("points", user.getPoints() != null ? user.getPoints() : 0);
        stats.put("streak", user.getStreak() != null ? user.getStreak() : 0);
        stats.put("userId", userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    private Map<String, Object> buildProfileMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("firstName", user.getFirstName());
        map.put("lastName", user.getLastName());
        map.put("email", user.getEmail());
        map.put("avatar", user.getAvatar());
        map.put("bio", user.getBio());
        map.put("skills", user.getSkills());
        map.put("department", user.getDepartment());
        map.put("role", user.getRole());
        map.put("subRole", user.getSubRole());
        map.put("points", user.getPoints() != null ? user.getPoints() : 0);
        map.put("streak", user.getStreak() != null ? user.getStreak() : 0);
        map.put("academicYear", user.getAcademicYear());
        if (user.getCollege() != null) {
            map.put("collegeId", user.getCollege().getId());
            map.put("collegeName", user.getCollege().getName());
        }
        if (user.getDepartmentEntity() != null) {
            map.put("departmentId", user.getDepartmentEntity().getId());
            map.put("departmentName", user.getDepartmentEntity().getName());
        }
        return map;
    }
}
