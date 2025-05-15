package com.alphamail.api.assistants.presentation.dto.schedule;


public record CreateTemporaryScheduleRequest(
        String title,
        String userEmail,
        Integer emailId,
        String name,
        String startTime,
        String endTime,
        String description
) {
}
