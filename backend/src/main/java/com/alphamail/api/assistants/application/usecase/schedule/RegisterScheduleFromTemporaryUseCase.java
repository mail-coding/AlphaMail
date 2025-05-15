package com.alphamail.api.assistants.application.usecase.schedule;

import com.alphamail.api.assistants.domain.repository.TemporaryScheduleRepository;
import com.alphamail.api.assistants.domain.service.ScheduleStore;
import com.alphamail.api.assistants.presentation.dto.schedule.RegisterScheduleRequest;
import com.alphamail.api.schedule.domain.entity.Schedule;
import com.alphamail.api.schedule.presentation.dto.CreateScheduleRequest;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class RegisterScheduleFromTemporaryUseCase {

    private final TemporaryScheduleRepository temporaryScheduleRepository;
    private final ScheduleStore scheduleStore;

    public void execute(RegisterScheduleRequest registerScheduleRequest, Integer userId) {

        CreateScheduleRequest createRequest = registerScheduleRequest.toCreateScheduleRequest();
        Schedule schedule = Schedule.create(createRequest, userId);
        scheduleStore.save(schedule);

        temporaryScheduleRepository.findByIdAndUserId(registerScheduleRequest.temporaryScheduleId(),userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        temporaryScheduleRepository.deleteById(registerScheduleRequest.temporaryScheduleId());

    }


}
