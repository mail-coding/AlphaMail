package com.alphamail.api.assistants.application.usecase.schedule;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.assistants.domain.repository.TemporaryScheduleRepository;
import com.alphamail.api.assistants.presentation.dto.schedule.TemporaryScheduleResponse;
import com.alphamail.api.assistants.presentation.dto.schedule.UpdateTemporaryScheduleRequest;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateTemporaryScheduleUseCase {

    private final TemporaryScheduleRepository temporaryScheduleRepository;

    public TemporaryScheduleResponse execute(UpdateTemporaryScheduleRequest updateTemporaryScheduleRequest, Integer userId) {

        TemporarySchedule temporarySchedule = temporaryScheduleRepository.findByIdAndUserId(updateTemporaryScheduleRequest.temporaryScheduleId(),userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        TemporarySchedule updateTemporarySchedule = temporarySchedule.update(updateTemporaryScheduleRequest);

        return TemporaryScheduleResponse.from(temporaryScheduleRepository.save(updateTemporarySchedule));
    }
}
