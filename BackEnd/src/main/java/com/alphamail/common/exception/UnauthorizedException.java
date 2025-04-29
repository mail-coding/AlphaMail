package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends BaseException {
	public UnauthorizedException(ErrorMessage errorMessage) {
		super(HttpStatus.UNAUTHORIZED, errorMessage);
	}
}
