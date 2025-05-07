package com.alphamail.api.schedule.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.alphamail.api.schedule.presentation.dto.CreateScheduleRequest;
import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.ErrorMessage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {
	private Integer scheduleId;
	private Integer userId;
	private String name;
	private String description;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private Boolean isDone;
	private LocalDateTime createdAt;


	public static Schedule create(CreateScheduleRequest request, Integer userId) {
		validateTime(request.startTime(), request.endTime());
		validateFutureLimit(request.startTime(), request.endTime());

		return Schedule.builder()
			.userId(userId)
			.name(request.name())
			.description(request.description())
			.startTime(request.startTime())
			.endTime(request.endTime())
			.isDone(false)
			.build();
	}

	public Schedule updateIsDone(Boolean isDone) {
		return Schedule.builder()
			.scheduleId(this.scheduleId)
			.userId(this.userId)
			.name(this.name)
			.description(this.description)
			.startTime(this.startTime)
			.endTime(this.endTime)
			.isDone(isDone)
			.build();
	}

	public Schedule update(String name, String description, LocalDateTime startTime, LocalDateTime endTime) {

		LocalDateTime newStartTime = startTime != null ? startTime : this.startTime;
		LocalDateTime newEndTime = endTime != null ? endTime : this.endTime;

		validateTime(newStartTime, newEndTime);
		validateFutureLimit(newStartTime, newEndTime);

		return Schedule.builder()
			.scheduleId(this.scheduleId)
			.userId(this.userId)
			.name(name != null ? name : this.name)
			.description(description != null ? description : this.description)
			.startTime(newStartTime)
			.endTime(newEndTime)
			.isDone(this.isDone)
			.build();
	}

	// 시간 검증
	private static void validateTime(LocalDateTime startTime, LocalDateTime endTime) {
		if (startTime.isAfter(endTime)) {
			throw new BadRequestException(ErrorMessage.SCHEDULE_TIME_INVALID);
		}
	}

	private static void validateFutureLimit(LocalDateTime startTime, LocalDateTime endTime) {
		LocalDate maxFutureDate = LocalDate.now().plusYears(20);

		if (startTime.toLocalDate().isAfter(maxFutureDate) ||
			endTime.toLocalDate().isAfter(maxFutureDate)) {
			throw new BadRequestException(ErrorMessage.SCHEDULE_DATE_TOO_FAR);
		}
	}


}
