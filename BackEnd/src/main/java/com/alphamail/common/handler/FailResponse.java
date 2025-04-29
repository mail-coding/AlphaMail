package com.alphamail.common.handler;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class FailResponse {

	int status;
	String message;

	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	List<FieldErrorDetail> errors;

	public static FailResponse fail(int status, String message) {
		return FailResponse.builder()
			.status(status)
			.message(message)
			.build();
	}

	public static FailResponse failWithFieldErrors(int status, String message, List<FieldErrorDetail> errors) {
		return FailResponse.builder()
			.status(status)
			.message(message)
			.errors(errors)
			.build();
	}
}