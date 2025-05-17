package com.alphamail.api.assistants.infrastructure.entity.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class SummaryResponse {
	private String status;

	@JsonProperty("vector_id")
	private String vectorId;

	private String summary;
}