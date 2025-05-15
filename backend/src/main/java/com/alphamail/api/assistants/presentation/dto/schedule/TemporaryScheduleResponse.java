package com.alphamail.api.assistants.presentation.dto.schedule;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.email.domain.entity.Email;

import java.time.LocalDateTime;

public record TemporaryScheduleResponse(
        Integer temporaryScheduleId,
        Email email,
        String name,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String description
) {
    public static TemporaryScheduleResponse from(TemporarySchedule temporarySchedule) {
        return new TemporaryScheduleResponse(
                temporarySchedule.getTemporaryScheduleId(),
                temporarySchedule.getEmail(),
                temporarySchedule.getName(),
                temporarySchedule.getStartTime(),
                temporarySchedule.getEndTime(),
                temporarySchedule.getDescription()
        );
    }
}

