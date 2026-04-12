package com.eventmanager.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class AmbassadorWsController {

    @MessageMapping("/ambassador.ping")
    public void handlePing(@Payload String message) {
        // Optional two-way heartbeat capture 
        System.out.println("Received WS Ping from ambassador client: " + message);
    }
}
