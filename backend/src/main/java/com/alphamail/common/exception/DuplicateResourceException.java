package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BaseException {
	public DuplicateResourceException(ErrorMessage errorMessage) {
		super(HttpStatus.CONFLICT, errorMessage);
	}
}
