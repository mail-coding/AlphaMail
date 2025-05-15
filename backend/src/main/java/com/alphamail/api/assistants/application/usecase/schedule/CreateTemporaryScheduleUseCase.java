package com.alphamail.api.assistants.application.usecase.schedule;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.assistants.domain.repository.TemporaryScheduleRepository;
import com.alphamail.api.assistants.presentation.dto.schedule.CreateTemporaryScheduleRequest;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.user.application.port.LoadUserPort;
import com.alphamail.api.user.domain.valueobject.UserId;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class CreateTemporaryScheduleUseCase {

	private final TemporaryScheduleRepository temporaryScheduleRepository;
	private final LoadUserPort loadUserPort;
	private final EmailRepository emailRepository;

	public TemporarySchedule execute(CreateTemporaryScheduleRequest temporaryScheduleRequest) {
		String recipientEmail = temporaryScheduleRequest.userEmail();

		UserId userId = loadUserPort.loadUserIdByEmail(recipientEmail);

		if (userId == null) {
			throw new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND);
		}
		Email email = emailRepository.findByIdAndUserId(temporaryScheduleRequest.emailId(), userId.getValue())
			.orElseThrow
				(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));
		return temporaryScheduleRepository.save(
			TemporarySchedule.create(temporaryScheduleRequest, userId.getValue(), email));
	}
}
