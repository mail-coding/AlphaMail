package com.alphamail.api.user.presentation.dto;

public record ChangePasswordRequest(
	String currPassword,
	String newPassword
) {
}
