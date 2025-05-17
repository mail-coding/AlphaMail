package com.alphamail.api.assistants.presentation.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailSummaryResponse {
	private String status;
	private String threadId;
	private String summary;
}