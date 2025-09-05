package com.example.chatweb.model;

public class ChatMessage {
    private String roomCode;
    private String sender;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(String roomCode, String sender, String content) {
        this.roomCode = roomCode;
        this.sender = sender;
        this.content = content;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
