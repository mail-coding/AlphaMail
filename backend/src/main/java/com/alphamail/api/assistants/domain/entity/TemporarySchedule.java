package com.alphamail.api.assistants.domain.entity;

import com.alphamail.api.assistants.domain.util.ScheduleTimeParser;
import com.alphamail.api.assistants.presentation.dto.schedule.CreateTemporaryScheduleRequest;
import com.alphamail.api.assistants.presentation.dto.schedule.UpdateTemporaryScheduleRequest;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.ErrorMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporarySchedule {
	private Integer temporaryScheduleId;
	private String title;
	private Email email;
	private Integer userId; // UserEntity가 아닌 userId
	private String name;
	private String description;
	private LocalDateTime startTime;
	private LocalDateTime endTime;

	public static TemporarySchedule create(CreateTemporaryScheduleRequest temporaryScheduleRequest, Integer userId,
		Email newEmail) {
		LocalDateTime parsedStart = ScheduleTimeParser.parseStart(temporaryScheduleRequest.startTime());
		LocalDateTime parsedEnd = ScheduleTimeParser.parseEnd(temporaryScheduleRequest.endTime());

		validateTime(parsedStart, parsedEnd);
		validateFutureLimit(parsedStart, parsedEnd);

		return TemporarySchedule.builder()
			.title(temporaryScheduleRequest.title())
			.email(newEmail)
			.userId(userId)
			.name(temporaryScheduleRequest.name())
			.startTime(parsedStart)
			.endTime(parsedEnd)
			.description(temporaryScheduleRequest.description())
			.build();
	}

	public TemporarySchedule update(UpdateTemporaryScheduleRequest updateTemporaryScheduleRequest) {
		LocalDateTime newStartTime =
			updateTemporaryScheduleRequest.startTime() != null ? updateTemporaryScheduleRequest.startTime() :
				this.startTime;
		LocalDateTime newEndTime =
			updateTemporaryScheduleRequest.endTime() != null ? updateTemporaryScheduleRequest.endTime() : this.endTime;

		validateTime(newStartTime, newEndTime);
		validateFutureLimit(newStartTime, newEndTime);

		return TemporarySchedule.builder()
			.temporaryScheduleId(temporaryScheduleId)
			.title(this.title)
			.email(this.email)
			.userId(this.userId)
			.temporaryScheduleId(this.temporaryScheduleId)
			.name(updateTemporaryScheduleRequest.name() != null ? updateTemporaryScheduleRequest.name() : this.name)
			.startTime(newStartTime)
			.endTime(newEndTime)
			.description(
				updateTemporaryScheduleRequest.description() != null ? updateTemporaryScheduleRequest.description() :
					this.description)
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

		if (startTime.toLocalDate().isAfter(maxFutureDate)
			|| endTime.toLocalDate().isAfter(maxFutureDate)) {
			throw new BadRequestException(ErrorMessage.SCHEDULE_DATE_TOO_FAR);
		}
	}

}
