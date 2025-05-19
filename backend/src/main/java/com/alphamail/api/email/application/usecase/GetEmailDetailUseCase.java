package com.alphamail.api.email.application.usecase;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.email.domain.repository.EmailAttachmentRepository;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.email.presentation.dto.EmailDetailResponse;
import com.alphamail.api.email.presentation.dto.EmailThreadItem;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class GetEmailDetailUseCase {
	private final EmailRepository emailRepository;
	private final EmailAttachmentRepository emailAttachmentRepository;

	public EmailDetailResponse execute(Integer emailId, Integer userId) {

		// email 가져오기
		Email email = emailRepository.findByIdAndUserId(emailId, userId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

		// email 상세보기 가져오기
		List<EmailAttachment> attachments = emailAttachmentRepository.findAllByEmailId(emailId);


		List<EmailThreadItem> threadList = Collections.emptyList();
		if(email.hasValidThreadId()) {
			threadList = emailRepository.findByThreadIdAndUserId(email.getThreadId(), userId);
		}

		// 읽음 표시가 필요한 경우에만 업데이트
		if (email.getReadStatus() == null || !email.getReadStatus()) {
			emailRepository.updateReadStatus(emailId, true);
		}

		return EmailDetailResponse.from(email, attachments, threadList);

	}
}
