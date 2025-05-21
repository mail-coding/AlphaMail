package com.alphamail.api.assistants.presentation.dto.schedule;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;

import java.time.LocalDateTime;
import java.util.List;

public record TemporaryScheduleResponse(
        Integer temporaryScheduleId,
        Email email,
        String name,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String description,
        List<EmailAttachment> emailAttachments
) {
    public static TemporaryScheduleResponse from(TemporarySchedule temporarySchedule, List<EmailAttachment> newEmailAttachments) {
        return new TemporaryScheduleResponse(
                temporarySchedule.getTemporaryScheduleId(),
                temporarySchedule.getEmail(),
                temporarySchedule.getName(),
                temporarySchedule.getStartTime(),
                temporarySchedule.getEndTime(),
                temporarySchedule.getDescription(),
                newEmailAttachments
        );
    }
}

