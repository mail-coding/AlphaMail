package com.alphamail.api.chatbot.domain.entity;

import java.time.LocalDateTime;

import com.alphamail.api.user.domain.entity.User;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ChatBot {
	private Integer messageId;
	private Integer userId;
	private int roleCode;
	private String content;
	private LocalDateTime createdAt;

	public ChatRole getRole() {
		return ChatRole.fromCode(this.roleCode);
	}

	public void setRole(ChatRole role) {
		this.roleCode = role.getCode();
	}

	public static ChatBot ofUser(Integer userId, String message) {
		return ChatBot.builder()
			.userId(userId)
			.roleCode(ChatRole.USER.getCode())
			.content(message)
			.build();
	}

	public static ChatBot ofBot(Integer userId, String reply) {
		return ChatBot.builder()
			.userId(userId)
			.roleCode(ChatRole.BOT.getCode())
			.content(reply)
			.build();
	}
}
