package com.alphamail.api.chatbot.application.dto;

import java.time.LocalDateTime;

public record ScheduleExtractionResult(
	String name,
	String description,
	LocalDateTime startTime,
	LocalDateTime endTime
) {
}
