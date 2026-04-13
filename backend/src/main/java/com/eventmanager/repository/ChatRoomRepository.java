package com.eventmanager.repository;

import com.eventmanager.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    Optional<ChatRoom> findByTypeAndTargetId(String type, String targetId);

    Optional<ChatRoom> findByName(String name);

    List<ChatRoom> findByType(String type);
}
