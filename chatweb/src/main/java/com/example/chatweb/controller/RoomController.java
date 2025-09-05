package com.example.chatweb.controller;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/room")
public class RoomController {
    private final Set<String> activeRooms = new HashSet<>();

    @PostMapping("/create")
    public String createRoom() {
        String code = UUID.randomUUID().toString().substring(0, 6);
        activeRooms.add(code);
        return code;
    }

    @GetMapping("/exists/{code}")
    public boolean checkRoom(@PathVariable String code) {
        return activeRooms.contains(code);
    }
}
