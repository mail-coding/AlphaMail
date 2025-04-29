package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends BaseException {
	public ForbiddenException(ErrorMessage errorMessage) {
		super(HttpStatus.FORBIDDEN, errorMessage);
	}
}
