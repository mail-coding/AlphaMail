package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {
	private final HttpStatus status;
	private final ErrorMessage errorMessage;

	public BaseException(HttpStatus status, ErrorMessage errorMessage) {
		super(errorMessage.getMessage());
		this.status = status;
		this.errorMessage = errorMessage;
	}
}
