package com.eventmanager.service;

import com.eventmanager.dto.*;
import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class WebinarServiceImpl implements WebinarService {

    private final WebinarRepository webinarRepository;
    private final WebinarRegistrationRepository registrationRepository;
    private final WebinarFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    private final CertificateService certificateService;

    public WebinarServiceImpl(WebinarRepository webinarRepository,
                              WebinarRegistrationRepository registrationRepository,
                              WebinarFeedbackRepository feedbackRepository,
                              UserRepository userRepository,
                              NotificationService notificationService,
                              ActivityService activityService,
                              CertificateService certificateService) {
        this.webinarRepository = webinarRepository;
        this.registrationRepository = registrationRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.activityService = activityService;
        this.certificateService = certificateService;
    }

    @Override
    public List<WebinarDto> getAllWebinars(String userId) {
        return webinarRepository.findAll().stream()
                .map(w -> convertToDto(w, userId))
                .collect(Collectors.toList());
    }

    @Override
    public WebinarDto getWebinar(String id, String userId) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        return convertToDto(webinar, userId);
    }

    @Override
    public WebinarDto createWebinar(String userId, CreateWebinarRequest request) {
        Webinar webinar = new Webinar();
        webinar.setTitle(request.getTitle());
        webinar.setDescription(request.getDescription());
        webinar.setSpeakerName(request.getSpeakerName());
        webinar.setSpeakerBio(request.getSpeakerBio());
        webinar.setHostCollege(request.getHostCollege());
        webinar.setMode(request.getMode());
        webinar.setMeetingLink(request.getMeetingLink());
        webinar.setStartDate(request.getStartDate());
        webinar.setEndDate(request.getEndDate());
        webinar.setDuration(request.getDuration());
        webinar.setMaxParticipants(request.getMaxParticipants());
        webinar.setBannerImage(request.getBannerImage());
        webinar.setAgenda(request.getAgenda());
        webinar.setCreatedBy(userId);
        
        Webinar saved = webinarRepository.save(webinar);
        activityService.logActivity(userId, "WEBINAR_CREATED", "Created webinar: " + saved.getTitle(), saved.getId(), saved.getTitle());
        
        return convertToDto(saved, userId);
    }

    @Override
    public WebinarDto updateWebinar(String id, CreateWebinarRequest request) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        webinar.setTitle(request.getTitle());
        webinar.setDescription(request.getDescription());
        webinar.setSpeakerName(request.getSpeakerName());
        webinar.setSpeakerBio(request.getSpeakerBio());
        webinar.setHostCollege(request.getHostCollege());
        webinar.setMode(request.getMode());
        webinar.setMeetingLink(request.getMeetingLink());
        webinar.setStartDate(request.getStartDate());
        webinar.setEndDate(request.getEndDate());
        webinar.setDuration(request.getDuration());
        webinar.setMaxParticipants(request.getMaxParticipants());
        if (request.getBannerImage() != null) webinar.setBannerImage(request.getBannerImage());
        if (request.getAgenda() != null) webinar.setAgenda(request.getAgenda());
        
        return convertToDto(webinarRepository.save(webinar), webinar.getCreatedBy());
    }

    @Override
    public void deleteWebinar(String id) {
        webinarRepository.deleteById(id);
    }

    @Override
    public void cancelWebinar(String id) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        webinar.setStatus("CANCELLED");
        webinarRepository.save(webinar);
        
        // Notify registered students
        List<WebinarRegistration> regs = registrationRepository.findByWebinarId(id);
        for (WebinarRegistration reg : regs) {
            notificationService.createNotification(reg.getStudent().getId(), "Webinar Cancelled", 
                "The webinar '" + webinar.getTitle() + "' has been cancelled.", "WEBINAR_CANCELLED", id);
        }
    }

    @Override
    public void registerForWebinar(String userId, String webinarId) {
        Webinar webinar = webinarRepository.findById(webinarId)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (registrationRepository.findByWebinarAndStudent(webinar, student).isPresent()) {
            throw new RuntimeException("Already registered for this webinar");
        }

        if (webinar.getRegisteredCount() >= webinar.getMaxParticipants()) {
            throw new RuntimeException("Webinar is full");
        }

        WebinarRegistration reg = new WebinarRegistration();
        reg.setWebinar(webinar);
        reg.setStudent(student);
        registrationRepository.save(reg);

        webinar.setRegisteredCount(webinar.getRegisteredCount() + 1);
        webinarRepository.save(webinar);

        notificationService.createNotification(userId, "Registration Successful", 
            "You have registered for '" + webinar.getTitle() + "'.", "WEBINAR_REGISTERED", webinarId);
            
        activityService.logActivity(userId, "WEBINAR_REGISTERED", "Registered for webinar: " + webinar.getTitle(), webinarId, webinar.getTitle());
    }

    @Override
    public void unregisterForWebinar(String userId, String webinarId) {
        Webinar webinar = webinarRepository.findById(webinarId)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WebinarRegistration reg = registrationRepository.findByWebinarAndStudent(webinar, student)
                .orElseThrow(() -> new RuntimeException("Not registered for this webinar"));

        registrationRepository.delete(reg);

        if (webinar.getRegisteredCount() > 0) {
            webinar.setRegisteredCount(webinar.getRegisteredCount() - 1);
            webinarRepository.save(webinar);
        }

        activityService.logActivity(userId, "WEBINAR_UNREGISTERED", "Cancelled registration for webinar: " + webinar.getTitle(), webinarId, webinar.getTitle());
    }

    @Override
    public List<WebinarRegistrationDto> getStudentRegistrations(String userId) {
        return registrationRepository.findByStudentId(userId).stream()
                .map(this::convertToRegDto)
                .collect(Collectors.toList());
    }

    @Override
    public void submitFeedback(String userId, String webinarId, Integer rating, String comment) {
        Webinar webinar = webinarRepository.findById(webinarId)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WebinarFeedback feedback = new WebinarFeedback();
        feedback.setWebinar(webinar);
        feedback.setStudent(student);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedbackRepository.save(feedback);
        
        activityService.logActivity(userId, "WEBINAR_FEEDBACK", "Submitted feedback for webinar: " + webinar.getTitle(), webinarId, webinar.getTitle());
    }

    @Override
    public List<WebinarDto> getUpcomingWebinars(String userId) {
        return webinarRepository.findByStatus("UPCOMING").stream()
                .map(w -> convertToDto(w, userId))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        long totalWebinars = webinarRepository.count();
        long totalRegistrations = registrationRepository.count();
        
        stats.put("totalWebinars", totalWebinars);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("averageAttendance", totalWebinars > 0 ? (double)totalRegistrations / totalWebinars : 0);
        
        return stats;
    }

    @Override
    public void seedWebinars() {
        if (webinarRepository.count() >= 25) return;

        String[] titles = {
            "Future of AI", "Web3 Revolution", "Cybersecurity Essentials", "Data Science Career Path",
            "Cloud Computing 101", "Blockchain for Beginners", "UI/UX Design Masterclass", "Digital Marketing Trends",
            "Software Engineering Best Practices", "Product Management for Tech", "Ethics in Artificial Intelligence",
            "Introduction to Quantum Computing", "Mastering React.js", "Backend Scalability with Java",
            "Mobile App Development with Flutter", "DevOps and CI/CD Pipelines", "IOT and Smart Systems",
            "AR/VR Development Basics", "Machine Learning at Scale", "Functional Programming Intro",
            "Microservices Architecture", "Graph Databases Explained", "Open Source Contribution Guide",
            "Agile Methodologies in 2024", "Preparing for Tech Interviews"
        };

        String[] speakers = {
            "Dr. Sarah Johnson", "Mark Thompson", "Alex Rivera", "Priya Sharma",
            "John Doe", "Jane Smith", "Robert Brown", "Emily White",
            "Michael Green", "Sophia Lee", "Chris Black", "Olivia Gray",
            "Daniel Blue", "Emma Red", "Liam Gold", "Noah Silver",
            "Ethan Bronze", "Ava Diamond", "Mia Ruby", "Lucas Emerald",
            "James Sapphire", "Isabella Topaz", "Benjamin Crystal", "Charlotte Pearl", "William Jade"
        };

        String[] colleges = {
            "MIT", "Stanford University", "IIT Delhi", "Oxford University",
            "Harvard University", "National University of Singapore", "IIT Bombay", "BITS Pilani"
        };

        String[] modes = {"Online", "Offline", "Hybrid"};


        Random random = new Random();

        for (int i = 0; i < 25; i++) {
            Webinar w = new Webinar();
            w.setTitle(titles[i % titles.length]);
            w.setDescription("Detailed discussion about " + titles[i % titles.length] + " with industry experts.");
            w.setSpeakerName(speakers[i % speakers.length]);
            w.setSpeakerBio("Leading expert in " + titles[i % titles.length] + " with 10+ years of experience.");
            w.setHostCollege(colleges[random.nextInt(colleges.length)]);
            w.setMode(modes[random.nextInt(modes.length)]);
            w.setMeetingLink("https://zoom.us/j/example" + i);
            
            // Generate varied dates
            LocalDateTime now = LocalDateTime.now();
            if (i % 3 == 0) { // COMPLETED
                w.setStartDate(now.minusDays(random.nextInt(30) + 1));
                w.setStatus("COMPLETED");
            } else if (i % 3 == 1) { // ONGOING
                w.setStartDate(now.minusHours(1));
                w.setStatus("ONGOING");
            } else { // UPCOMING
                w.setStartDate(now.plusDays(random.nextInt(30) + 1));
                w.setStatus("UPCOMING");
            }
            w.setEndDate(w.getStartDate().plusHours(2));
            w.setDuration(120);
            w.setMaxParticipants(100 + random.nextInt(400));
            w.setRegisteredCount(random.nextInt(w.getMaxParticipants()));
            w.setBannerImage("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop");
            w.setAgenda("1. Introduction (15 mins)\n2. Key Concepts & Theory (30 mins)\n3. Case Studies & Real-world examples (30 mins)\n4. Live Demo/Workshop (30 mins)\n5. Q&A and Networking (15 mins)");
            w.setCreatedBy("admin-id");
            
            webinarRepository.save(w);
        }
    }

    private WebinarDto convertToDto(Webinar w, String userId) {
        WebinarDto dto = new WebinarDto();
        dto.setId(w.getId());
        dto.setTitle(w.getTitle());
        dto.setDescription(w.getDescription());
        dto.setSpeakerName(w.getSpeakerName());
        dto.setSpeakerBio(w.getSpeakerBio());
        dto.setHostCollege(w.getHostCollege());
        dto.setMode(w.getMode());
        dto.setMeetingLink(w.getMeetingLink());
        dto.setStartDate(w.getStartDate());
        dto.setEndDate(w.getEndDate());
        dto.setDuration(w.getDuration());
        dto.setMaxParticipants(w.getMaxParticipants());
        dto.setRegisteredCount(w.getRegisteredCount());
        dto.setBannerImage(w.getBannerImage());
        dto.setStatus(w.getStatus());
        dto.setCreatedBy(w.getCreatedBy());
        dto.setCreatedAt(w.getCreatedAt());
        dto.setAgenda(w.getAgenda());
        
        if (userId != null) {
            dto.setIsRegistered(registrationRepository.findByWebinarId(w.getId()).stream()
                .anyMatch(r -> r.getStudent().getId().equals(userId)));
        }
        
        return dto;
    }

    private WebinarRegistrationDto convertToRegDto(WebinarRegistration r) {
        WebinarRegistrationDto dto = new WebinarRegistrationDto();
        dto.setId(r.getId());
        dto.setWebinarId(r.getWebinar().getId());
        dto.setWebinarTitle(r.getWebinar().getTitle());
        dto.setSpeakerName(r.getWebinar().getSpeakerName());
        dto.setStartDate(r.getWebinar().getStartDate());
        dto.setStatus(r.getWebinar().getStatus());
        dto.setAttendanceStatus(r.getAttendanceStatus());
        dto.setCertificateGenerated(r.getCertificateGenerated());
        dto.setRegisteredAt(r.getRegisteredAt());
        return dto;
    }


    @Override
    public String joinWebinar(String userId, String webinarId) {
        Webinar webinar = webinarRepository.findById(webinarId)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        WebinarRegistration reg = registrationRepository.findByWebinarAndStudent(webinar, student)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        // Update attendance
        if (!"PRESENT".equals(reg.getAttendanceStatus())) {
            reg.setAttendanceStatus("PRESENT");
            registrationRepository.save(reg);
            
            activityService.logActivity(userId, "WEBINAR_JOINED", "Joined webinar: " + webinar.getTitle(), webinarId, webinar.getTitle());

            // Auto-generate certificate for participation
            certificateService.generateCertificate(userId, webinarId, "WEBINAR", "PARTICIPANT");
        }
        
        return webinar.getMeetingLink();
    }

    @Override
    public String generateCertificate(String userId, String webinarId) {
        CertificateDto cert = certificateService.generateCertificate(userId, webinarId, "WEBINAR", "PARTICIPANT");
        return cert.getCertificateId();
    }

    @Override
    public byte[] downloadCertificate(String userId, String webinarId) {
        // Find certificate for this user and webinar
        List<CertificateDto> certs = certificateService.getUserCertificates(userId);
        CertificateDto cert = certs.stream()
                .filter(c -> webinarId.equals(c.getEventId()) && "WEBINAR".equals(c.getCategory()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Certificate not found for this webinar"));
        
        return certificateService.downloadCertificatePdf(cert.getId(), userId);
    }
}
