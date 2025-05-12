package com.alphamail.api.chatbot.application.dto;

public record ChatBotResult(
	String reply,
	boolean requiresFollowUp
) {
	public static ChatBotResult followUp(String question) {
		return new ChatBotResult(question, true);
	}

	public static ChatBotResult complete(String message) {
		return new ChatBotResult(message, false);
	}
}
