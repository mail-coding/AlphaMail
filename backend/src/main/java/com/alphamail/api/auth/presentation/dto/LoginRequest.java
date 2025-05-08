package com.alphamail.api.auth.presentation.dto;

public record LoginRequest(
	String email,
	String password
) {
}
