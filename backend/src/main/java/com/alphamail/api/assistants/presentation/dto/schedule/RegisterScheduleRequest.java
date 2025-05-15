package com.alphamail.api.assistants.presentation.dto.schedule;

import com.alphamail.api.schedule.presentation.dto.CreateScheduleRequest;

import java.time.LocalDateTime;


public record RegisterScheduleRequest(
        String name,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String description,
        Integer temporaryScheduleId
) {
    public CreateScheduleRequest toCreateScheduleRequest() {
        return new CreateScheduleRequest(
                this.name(),
                this.startTime(),
                this.endTime(),
                this.description()
        );
    }

}
