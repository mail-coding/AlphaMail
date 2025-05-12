package com.alphamail.api.chatbot.presentation.dto;

public record ChatBotRequest(
	Integer userId,
	String message
) {
}
