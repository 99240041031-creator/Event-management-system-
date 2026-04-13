package com.eventmanager.service;

import com.eventmanager.model.ChatMessage;
import com.eventmanager.model.ChatRoom;
import com.eventmanager.model.User;
import com.eventmanager.repository.ChatMessageRepository;
import com.eventmanager.repository.ChatRoomRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRoomRepository roomRepository;

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ChatRoom getOrCreateRoom(String type, String targetId, String name) {
        return roomRepository.findByTypeAndTargetId(type, targetId)
                .orElseGet(() -> {
                    ChatRoom room = new ChatRoom();
                    room.setType(type);
                    room.setTargetId(targetId);
                    room.setName(name);
                    return roomRepository.save(room);
                });
    }

    @Override
    public ChatMessage saveMessage(String roomId, String senderId, String content, String type) {
        ChatRoom room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setRoom(room);
        message.setSender(sender);
        message.setContent(content);
        message.setType(type);

        return messageRepository.save(message);
    }

    @Override
    public List<ChatMessage> getMessages(String roomId) {
        List<ChatMessage> messages = messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
        
        // If no messages found by UUID, try resolving as room name (for frontend labels compatibility)
        if (messages.isEmpty()) {
            return roomRepository.findByName(roomId)
                    .map(room -> messageRepository.findByRoomIdOrderByCreatedAtAsc(room.getId()))
                    .orElse(List.of());
        }
        
        return messages;
    }

    @Override
    public List<ChatRoom> getRoomsByType(String type) {
        return roomRepository.findByType(type);
    }
}
