package com.eventmanager.controller;

import com.eventmanager.model.ChatMessage;
import com.eventmanager.model.ChatRoom;
import com.eventmanager.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/messages/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable String roomId, ChatMessage message) {
        return chatService.saveMessage(roomId, message.getSender().getId(), message.getContent(), message.getType());
    }

    @GetMapping("/rooms/{type}/{targetId}")
    public ChatRoom getRoom(@PathVariable String type, @PathVariable String targetId, @RequestParam String name) {
        return chatService.getOrCreateRoom(type, targetId, name);
    }

    @GetMapping("/messages/{roomId}")
    public List<ChatMessage> getMessages(@PathVariable String roomId) {
        return chatService.getMessages(roomId);
    }
}
