package com.alphamail.api.email.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.EmailFolder;
import com.alphamail.api.email.domain.repository.EmailFolderRepository;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.email.presentation.dto.DeleteMailsRequest;
import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.ForbiddenException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteMailsUseCase {

	private final EmailFolderRepository emailFolderRepository;
	private final EmailRepository emailRepository;

	public void execute(DeleteMailsRequest request, Integer userId) {

		if (request.mailList() == null || request.mailList().isEmpty()) {
			throw new BadRequestException(ErrorMessage.NO_MAIL_SELECTED);
		}

		if (!emailRepository.validateEmailOwnership(request.mailList(), userId)) {
			throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);
		}

		EmailFolder trashFolder = emailFolderRepository.findByUserIdAndFolderName(userId, "TRASH");
		emailRepository.updateFolder(request.mailList(), trashFolder.getEmailFolderId());
	}
}
