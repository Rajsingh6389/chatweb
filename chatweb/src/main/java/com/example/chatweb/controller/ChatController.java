package com.example.chatweb.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.chatweb.model.ChatMessage;

@Controller
public class ChatController {
    private final SimpMessagingTemplate template;

    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/send")
    public void sendMessage(ChatMessage message) {
        template.convertAndSend("/topic/" + message.getRoomCode(), message);
    }
}
