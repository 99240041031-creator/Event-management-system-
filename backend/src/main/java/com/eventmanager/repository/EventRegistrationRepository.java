package com.eventmanager.repository;

import com.eventmanager.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, String> {
    List<EventRegistration> findByUserId(String userId);
    long countByUserId(String userId);

    List<EventRegistration> findByEventId(String eventId);

    long countByEventId(String eventId);
    
    List<EventRegistration> findByEventIdIn(List<String> eventIds);
    
    long countByEventIdInAndCreatedAtAfter(List<String> eventIds, LocalDateTime createdAt);
    
    List<EventRegistration> findTop10ByEventIdInOrderByCreatedAtDesc(List<String> eventIds);
    
    long countByEventIdAndAttended(String eventId, Boolean attended);
    
    List<EventRegistration> findByUserIdAndEventIdIn(String userId, List<String> eventIds);
    
    boolean existsByUserIdAndEventId(String userId, String eventId);
}
