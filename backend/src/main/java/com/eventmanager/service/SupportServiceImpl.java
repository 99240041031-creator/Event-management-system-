package com.eventmanager.service;

import com.eventmanager.dto.AddMessageRequest;
import com.eventmanager.dto.CreateTicketRequest;
import com.eventmanager.model.SupportMessage;
import com.eventmanager.model.SupportTicket;
import com.eventmanager.model.User;
import com.eventmanager.repository.SupportMessageRepository;
import com.eventmanager.repository.SupportTicketRepository;
import com.eventmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupportServiceImpl implements SupportService {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private SupportMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public SupportTicket createTicket(String userId, CreateTicketRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus("OPEN");
        ticket.setRelatedEntityId(request.getRelatedEntityId());
        
        return ticketRepository.save(ticket);
    }

    @Override
    public List<SupportTicket> getUserTickets(String userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public SupportTicket getTicketDetails(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public List<SupportTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    @Transactional
    public SupportMessage addMessage(String userId, String ticketId, AddMessageRequest request) {
        SupportTicket ticket = getTicketDetails(ticketId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportMessage message = new SupportMessage();
        message.setTicket(ticket);
        message.setSender(user);
        message.setMessage(request.getMessage());
        message.setAttachmentUrl(request.getAttachmentUrl());
        message.setSentAt(LocalDateTime.now());
        
        // Check if user is admin
        boolean isAdmin = "ambassador".equalsIgnoreCase(user.getRole()) || "college_admin".equalsIgnoreCase(user.getRole());
        message.setAdminReply(isAdmin);

        return messageRepository.save(message);
    }

    @Override
    @Transactional
    public SupportTicket updateTicketStatus(String ticketId, String status, String userId) {
        SupportTicket ticket = getTicketDetails(ticketId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only admins can close/resolve tickets for others, or users can close their own? 
        // Typically support staff updates status. Users might be able to "Resolve" or "Close" their own.
        // For now, allowing admins or the ticket owner.
        boolean isAdmin = "ambassador".equalsIgnoreCase(user.getRole()) || "college_admin".equalsIgnoreCase(user.getRole());
        boolean isOwner = ticket.getUser().getId().equals(userId);

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Unauthorized: You cannot update this ticket status");
        }

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}
