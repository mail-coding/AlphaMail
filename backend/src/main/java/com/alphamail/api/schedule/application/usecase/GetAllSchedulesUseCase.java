package com.alphamail.api.schedule.application.usecase;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.schedule.domain.entity.Schedule;
import com.alphamail.api.schedule.domain.repository.ScheduleRepository;
import com.alphamail.api.schedule.presentation.dto.ScheduleListResponse;
import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.ErrorMessage;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GetAllSchedulesUseCase {

	private final ScheduleRepository scheduleRepository;

	public ScheduleListResponse execute(LocalDate startDate, LocalDate endDate,
		String keyword, Pageable pageable, Integer userId) {

		boolean isSearchMode = keyword != null && !keyword.isEmpty();

		if ((startDate == null && endDate != null) || (startDate != null && endDate == null)) {
			throw new BadRequestException(ErrorMessage.SCHEDULE_DATE_PAIR_REQUIRED);
		}

		if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
			throw new BadRequestException(ErrorMessage.SCHEDULE_DATE_INVALID);
		}

		Pageable effectivePageable = isSearchMode ? pageable :
			PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		Page<Schedule> schedulePage;

		if (isSearchMode) {
			if (startDate == null || endDate == null) {
				schedulePage = scheduleRepository.findByKeyword(keyword, userId, effectivePageable);
			} else {
				schedulePage = scheduleRepository.findByPeriodAndKeyword(
					startDate, endDate, keyword, userId, effectivePageable);
			}
		} else {
			schedulePage = scheduleRepository.findByPeriod(startDate, endDate, userId, effectivePageable);
		}

		return ScheduleListResponse.from(schedulePage);

	}


}
