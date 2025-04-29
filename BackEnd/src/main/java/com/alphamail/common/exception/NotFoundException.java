package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseException {
	public NotFoundException(ErrorMessage errorMessage) {
		super(HttpStatus.NOT_FOUND, errorMessage);
	}
}
