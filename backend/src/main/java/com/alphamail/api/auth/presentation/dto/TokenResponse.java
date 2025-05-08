package com.alphamail.api.auth.presentation.dto;

public record TokenResponse(
	String accessToken,
	String refreshToken,
	Long expiresIn
) {
	public static TokenResponse of(String accessToken, Long expiresIn) {
		return new TokenResponse(accessToken, null, expiresIn);
	}
}
