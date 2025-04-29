package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends BaseException {
	public BadRequestException(ErrorMessage errorMessage) {
		super(HttpStatus.BAD_REQUEST, errorMessage);
	}
}
