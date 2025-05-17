package com.alphamail.api.assistants.application.usecase.client;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.assistants.domain.entity.TemporaryClient;
import com.alphamail.api.assistants.domain.repository.TemporaryClientRepository;
import com.alphamail.api.assistants.domain.service.EmailAttachmentReader;
import com.alphamail.api.assistants.domain.service.EmailReader;
import com.alphamail.api.assistants.presentation.dto.client.TemporaryClientResponse;
import com.alphamail.api.assistants.presentation.dto.client.UpdateTemporaryClientRequest;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.ForbiddenException;
import com.alphamail.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateTemporaryClientUseCase {

	private final TemporaryClientRepository temporaryClientRepository;
	private final EmailAttachmentReader emailAttachmentReader;

	public TemporaryClientResponse execute(UpdateTemporaryClientRequest updateTemporaryClientRequest, Integer userId,
		Integer temporaryClientId) {

		TemporaryClient existingClient = temporaryClientRepository.findById(temporaryClientId)
			.orElseThrow(() -> new NotFoundException(
				ErrorMessage.RESOURCE_NOT_FOUND));

		if (!existingClient.getUserId().equals(userId)) {
			throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);
		}

		TemporaryClient updatedClient = TemporaryClient.update(updateTemporaryClientRequest, existingClient);
		TemporaryClient savedClient = temporaryClientRepository.save(updatedClient);

		List<EmailAttachment> emailAttachment = emailAttachmentReader.findAllByEmailId(savedClient.getEmail().getEmailId());

		return TemporaryClientResponse.from(savedClient, emailAttachment);
	}
}