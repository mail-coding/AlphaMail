package com.alphamail.api.user.presentation.dto;

import com.alphamail.common.exception.ErrorMessage;

public record PasswordChangeResult(
	boolean success,
	String message
) {

	public static final PasswordChangeResult SUCCESS =
		new PasswordChangeResult(true, "");

	public static PasswordChangeResult failure(ErrorMessage errorMessage) {
		return new PasswordChangeResult(false, errorMessage.getMessage());
	}
}
