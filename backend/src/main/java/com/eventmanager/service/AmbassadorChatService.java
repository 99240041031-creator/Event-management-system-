package com.eventmanager.service;

import com.eventmanager.model.ChatMessage;
import com.eventmanager.model.ChatRoom;
import com.eventmanager.model.User;
import com.eventmanager.repository.ChatMessageRepository;
import com.eventmanager.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmbassadorChatService {

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private ChatRoomRepository roomRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ChatMessage sendMessage(User sender, String content, String roomId) {
        ChatRoom room = roomRepository.findById(roomId).orElseThrow();
        
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setContent(content);
        message.setRoom(room);
        message.setType("TEXT");
        
        ChatMessage saved = messageRepository.save(message);
        
        // Broadcast to specific room topic
        messagingTemplate.convertAndSend("/topic/room/" + roomId, saved);
        
        return saved;
    }

    public List<ChatMessage> getRoomHistory(String roomId) {
        return messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
    }
}
