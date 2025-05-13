package com.alphamail.api.chatbot.presentation.dto;

import com.alphamail.api.chatbot.application.dto.ChatBotResult;

public record ChatBotResponse(
	String reply,
	boolean requiresFollowUp
) {
	public static ChatBotResponse from(ChatBotResult result) {
		return new ChatBotResponse(result.reply(), result.requiresFollowUp());
	}
}
