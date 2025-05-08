package com.alphamail.api.email.application.usecase;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.email.domain.repository.EmailAttachmentRepository;
import com.alphamail.api.email.domain.repository.EmailFolderRepository;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.email.presentation.dto.ReceiveEmailRequest;
import com.alphamail.api.user.application.port.LoadUserPort;
import com.alphamail.api.user.domain.valueobject.UserId;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReceiveEmailUseCase {

	private final EmailRepository emailRepository;
	private final LoadUserPort loadUserPort;
	private final EmailFolderRepository emailFolderRepository;
	private final EmailAttachmentRepository emailAttachmentRepository;

	public void excute(ReceiveEmailRequest request) {
		String recipientEmail = request.actualRecipient();

		UserId userId = loadUserPort.loadUserIdByEmail(recipientEmail);

		Integer folderId = emailFolderRepository.getInboxFolderId(userId.getValue());

		Email email = Email.createForReceiving(request, userId.getValue(), folderId);

		Email savedEmail = emailRepository.save(email);

		List<EmailAttachment> emailAttachmentList = EmailAttachment.createAttachments(
			request.attachments(),
			savedEmail.getEmailId()
		);

		if (!emailAttachmentList.isEmpty()) {
			emailAttachmentRepository.saveAll(emailAttachmentList);
		}
	}
}
