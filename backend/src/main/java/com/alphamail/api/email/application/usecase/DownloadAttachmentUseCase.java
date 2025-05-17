package com.alphamail.api.email.application.usecase;

import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.email.domain.repository.EmailAttachmentRepository;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.email.presentation.dto.AttachmentDownloadResponse;
import com.alphamail.api.global.s3.service.S3Service;
import com.alphamail.api.user.domain.valueobject.UserId;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.ForbiddenException;
import com.alphamail.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DownloadAttachmentUseCase {

	private final EmailAttachmentRepository emailAttachmentRepository;
	private final EmailRepository emailRepository;
	private final S3Service s3Service;

	@Transactional(readOnly = true)
	public AttachmentDownloadResponse execute(Integer emailId, Integer attachmentId, UserId userId) {

		// 1. 첨부파일 조회
		log.info("첨부파일 조회 시작: attachmentId={}", attachmentId);
		EmailAttachment attachment = emailAttachmentRepository.findById(attachmentId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

		log.debug("조회된 첨부파일: {}", attachment);
		// 2. 이메일 소유자 확인
		log.info("이메일 소유자 확인: emailId={}, userId={}", emailId, userId.getValue());
		if (!emailRepository.existsByIdAndUserId(emailId, userId.getValue())) {
			throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);
		}

		// 3. 첨부파일이 해당 이메일에 속하는지 확인
		if (!attachment.getEmailId().equals(emailId)) {
			throw new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND);
		}

		// 4. S3에서 파일 다운로드
		InputStream inputStream = s3Service.downloadFile(attachment.getS3Key());
		log.debug("S3에서 파일 다운로드 완료: 파일명={}, 크기={}", attachment.getName(), attachment.getSize());

		return AttachmentDownloadResponse.builder()
			.inputStream(inputStream)
			.filename(attachment.getName())
			.size(attachment.getSize())
			.contentType(attachment.getType())
			.build();
	}
}
