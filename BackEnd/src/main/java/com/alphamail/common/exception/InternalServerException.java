package com.alphamail.common.exception;

import org.springframework.http.HttpStatus;

public class InternalServerException extends BaseException {
	public InternalServerException(ErrorMessage errorMessage) {
		super(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
	}
}
