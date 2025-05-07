package com.alphamail.api.schedule.application.usecase;

import org.springframework.stereotype.Service;

import com.alphamail.api.schedule.domain.entity.Schedule;
import com.alphamail.api.schedule.domain.repository.ScheduleRepository;
import com.alphamail.api.schedule.presentation.dto.CreateScheduleRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateScheduleUseCase {

	private final ScheduleRepository scheduleRepository;

	public void execute(CreateScheduleRequest request, Integer userId) {

		Schedule schedule = Schedule.create(request, userId);

		scheduleRepository.save(schedule);
	}
}
