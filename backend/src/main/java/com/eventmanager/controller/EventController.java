package com.eventmanager.controller;

import com.eventmanager.dto.ApiResponse;
import com.eventmanager.model.Event;
import com.eventmanager.model.EventRegistration;
import com.eventmanager.repository.EventRepository;
import com.eventmanager.repository.EventRegistrationRepository;
import com.eventmanager.repository.UserRepository;
import com.eventmanager.security.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {
    
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<Event>>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(eventRepository.findAll(pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Event>> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(ApiResponse.success(eventRepository.save(event)));
    }

    // Register for an event
    @PostMapping("/{eventId}/register")
    public ResponseEntity<ApiResponse<String>> registerForEvent(
            @PathVariable String eventId,
            @RequestParam(required = false) String userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.status(404).body(ApiResponse.error("Event not found"));
        }

        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        com.eventmanager.model.User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
        }

        Event event = eventRepository.findById(eventId).get();

        // Check if already registered
        boolean alreadyRegistered = eventRegistrationRepository.findByEventId(eventId).stream()
                .anyMatch(r -> r.getUser().getId().equals(user.getId()));

        if (alreadyRegistered) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Already registered"));
        }

        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setUser(user);
        eventRegistrationRepository.save(registration);

        // Update count
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        return ResponseEntity.ok(ApiResponse.success("Registered successfully", null));
    }

    // Get events registered by student with DTO
    @GetMapping("/student/{userId}")
    public ResponseEntity<ApiResponse<List<com.eventmanager.dto.EventDto>>> getEventsByStudent(@PathVariable String userId) {
        List<com.eventmanager.dto.EventDto> events = eventRegistrationRepository.findByUserId(userId).stream()
            .map(reg -> {
                com.eventmanager.dto.EventDto dto = new com.eventmanager.dto.EventDto();
                Event event = reg.getEvent();
                dto.setId(event.getId());
                dto.setTitle(event.getTitle());
                dto.setDescription(event.getDescription());
                dto.setBannerImage(event.getBannerImage());
                dto.setMode(event.getMode());
                dto.setLocation(event.getLocation());
                dto.setStartDate(event.getStartDate());
                dto.setEndDate(event.getEndDate());
                dto.setStatus(event.getStatus()); // Event status
                dto.setRegistrationStatus(reg.getStatus()); // User specific status
                dto.setCertificateIssued(reg.getCertificateIssued());
                if (event.getOrganizer() != null) dto.setOrganizerName(event.getOrganizer().getName());
                if (event.getCollege() != null) dto.setCollegeName(event.getCollege().getName());
                dto.setRegisteredCount(event.getRegisteredCount());
                dto.setCapacity(event.getCapacity());
                return dto;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @PostMapping("/{eventId}/unregister")
    public ResponseEntity<ApiResponse<String>> unregisterFromEvent(
            @PathVariable String eventId,
            @RequestParam(required = false) String userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        com.eventmanager.model.User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
        }

        EventRegistration registration = eventRegistrationRepository.findByEventId(eventId).stream()
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElse(null);

        if (registration == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not registered"));
        }
        
        // Logic to allow/disallow based on time can go here
        
        registration.setStatus("CANCELLED");
        eventRegistrationRepository.save(registration);
        
        Event event = registration.getEvent();
        event.setRegisteredCount(event.getRegisteredCount() - 1);
        eventRepository.save(event);

        return ResponseEntity.ok(ApiResponse.success("Unregistered successfully", null));
    }

    @PostMapping("/{eventId}/attendance")
    public ResponseEntity<ApiResponse<String>> markAttendance(
            @PathVariable String eventId,
            @RequestParam String userId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        // Only Faculty, HOD, Director or Admin can mark attendance
        boolean hasPermission = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Roles.ROLE_FACULTY) ||
                        a.getAuthority().equals(Roles.ROLE_HOD) ||
                        a.getAuthority().equals(Roles.ROLE_DIRECTOR) ||
                        a.getAuthority().equals(Roles.ROLE_COLLEGE_ADMIN) ||
                        a.getAuthority().equals(Roles.ROLE_SUPER_ADMIN));

        if (!hasPermission) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden: Insufficient privileges"));
        }

        EventRegistration registration = eventRegistrationRepository.findByEventId(eventId).stream()
                .filter(r -> r.getUser().getId().equals(userId))
                .findFirst()
                .orElse(null);

        if (registration == null)
            return ResponseEntity.badRequest().body(ApiResponse.error("Not registered"));

        registration.setStatus("ATTENDED");
        eventRegistrationRepository.save(registration);

        return ResponseEntity.ok(ApiResponse.success("Attendance marked", null));
    }

    // Get events organized by faculty
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsByOrganizer(@PathVariable String organizerId) {
        List<Event> events = eventRepository.findAll().stream()
            .filter(e -> e.getOrganizer() != null && e.getOrganizer().getId().equals(organizerId))
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @PostMapping("/seed-registrations")
    public ResponseEntity<ApiResponse<Map<String, String>>> seedRegistrations(@RequestParam String userId) {
        try {
            com.eventmanager.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            List<Event> events = eventRepository.findAll();
            if (events.isEmpty()) return ResponseEntity.ok(ApiResponse.success(Map.of("message", "No events to seed")));

            int count = 0;
            for (Event event : events) {
                if (count >= 3) break;
                
                boolean alreadyRegistered = eventRegistrationRepository.findByEventId(event.getId()).stream()
                    .anyMatch(r -> r.getUser().getId().equals(userId));
                    
                if (!alreadyRegistered && !"COMPLETED".equalsIgnoreCase(event.getStatus())) {
                    EventRegistration registration = new EventRegistration();
                    registration.setEvent(event);
                    registration.setUser(user);
                    registration.setStatus("REGISTERED");
                    registration.setCertificateIssued(false);
                    eventRegistrationRepository.save(registration);
                    
                    event.setRegisteredCount(event.getRegisteredCount() + 1);
                    eventRepository.save(event);
                    count++;
                }
            }
            return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Seeded " + count + " event registrations")));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }
}
