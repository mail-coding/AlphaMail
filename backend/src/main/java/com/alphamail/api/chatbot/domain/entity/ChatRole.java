package com.alphamail.api.chatbot.domain.entity;

import java.util.Arrays;

public enum ChatRole {
	USER(0),
	BOT(1);

	private final int code;

	ChatRole(int code) {
		this.code = code;
	}

	public int getCode() {
		return code;
	}

	public static ChatRole fromCode(int code) {
		return Arrays.stream(ChatRole.values())
			.filter(r -> r.code == code)
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("Invalid role code: " + code));
	}
}
