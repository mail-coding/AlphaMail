package com.alphamail.api.email.application.service;

import java.io.InputStream;
import java.util.List;

import com.alphamail.api.assistants.application.usecase.client.CreateTemporaryClientUseCase;
import com.alphamail.api.email.application.usecase.ai.EmailMCPUseCase;
import com.alphamail.api.email.application.usecase.ai.EmailVectorUseCase;
import com.alphamail.api.email.domain.entity.EmailOCR;
import com.alphamail.api.email.domain.repository.EmailOCRRespository;
import com.alphamail.api.email.presentation.dto.AttachmentRequest;
import com.alphamail.api.email.presentation.dto.VectorDBRequest;
import com.alphamail.api.global.s3.service.S3Service;
import org.springframework.stereotype.Service;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.email.domain.repository.EmailAttachmentRepository;
import com.alphamail.api.email.domain.repository.EmailFolderRepository;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.email.domain.valueobject.ThreadId;
import com.alphamail.api.email.presentation.dto.ReceiveEmailRequest;
import com.alphamail.api.user.application.port.LoadUserPort;
import com.alphamail.api.user.domain.valueobject.UserId;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceiveEmailService {

	private final EmailRepository emailRepository;
	private final LoadUserPort loadUserPort;
	private final EmailFolderRepository emailFolderRepository;
	private final EmailAttachmentRepository emailAttachmentRepository;
	private final EmailOCRRespository emailOCRRespository;
	private final S3Service s3Service;
	private final EmailMCPUseCase emailMCPUseCase;
	private final EmailVectorUseCase emailVectorUseCase;
	private final CreateTemporaryClientUseCase createTemporaryClientUseCase;

	public void excute(ReceiveEmailRequest request) {
		log.info("이메일 수신 시작 - messageId: {}, inReplyTo: {}, references: {}",
				request.messageId(), request.inReplyTo(), request.references());

		UserId userId = loadUserPort.loadUserIdByEmail(request.actualRecipient());
		Integer folderId = emailFolderRepository.getInboxFolderId(userId.getValue());

		String threadId = resolveThreadId(request);

		emailVectorUseCase.execute(VectorDBRequest.fromReceiveEmailRequest(request), userId.getValue(), threadId)
				.onErrorContinue((error, item) -> {
					log.warn("벡터 저장 실패 : {}", item, error);
				})
				.subscribe();

		Email email = Email.createForReceiving(request, userId.getValue(), folderId, threadId);
		Email savedEmail = emailRepository.save(email);
		log.info("이메일 저장 완료: emailId={}", savedEmail.getEmailId());

		Mono.fromRunnable(() -> {
			try {
				List<AttachmentRequest> ocrTargets = request.attachments().stream()
						.filter(att -> isBusinessLicense(att.filename()) && isSupportedFileType(att.contentType()))
						.toList();

				Flux.fromIterable(ocrTargets)
						.concatMap(attachment -> {
							try {
								InputStream fileStream = s3Service.downloadFile(attachment.s3Key());
								return emailOCRRespository.registOCR(fileStream, attachment.filename(),
												attachment.contentType().split("/")[1], userId.getValue().toString())
										.doOnNext(emailOCR -> {
											log.info("OCR 호출 성공 : {}", emailOCR.toString());
											if (emailOCR.success()) {
												createTemporaryClientUseCase.execute(
														EmailOCR.toTemporaryClientRequest(
																emailOCR, savedEmail.getEmailId(), savedEmail.getSender(), attachment.s3Key()
														),
														userId.getValue()
												);
											}
										})
										.onErrorResume(error -> {
											log.warn("OCR 호출 실패", error);
											return Mono.empty(); // 에러 무시
										});
							} catch (Exception e) {
								log.error("첨부파일 OCR 처리 중 오류 발생", e);
								return Mono.empty();
							}
						})
						.then()  // 전체 흐름 완료 기다리기
						.subscribe();
			} catch (Exception e) {
				log.error("첨부파일 처리 중 오류 발생", e);
			}
		}).subscribe();

		Flux.just(request)
				.flatMap(req -> emailMCPUseCase.execute(req, savedEmail.getEmailId())
						.onErrorContinue((error, item) -> {
							log.warn("MCP 호출 실패 : {}", item, error);
						}), 2)
				.subscribe();

		// 첨부파일 DB 저장
		List<EmailAttachment> emailAttachmentList = EmailAttachment.createAttachments(
				request.attachments(), savedEmail.getEmailId());
		if (!emailAttachmentList.isEmpty()) {
			emailAttachmentRepository.saveAll(emailAttachmentList);
		}
	}
	private String resolveThreadId(ReceiveEmailRequest request) {
		if (request.inReplyTo() != null && !request.inReplyTo().isEmpty()) {
			log.info("inReplyTo에서 원본 이메일 찾기: {}", request.inReplyTo());
			List<Email> originals = emailRepository.findAllByMessageId(request.inReplyTo());
			if (originals != null && !originals.isEmpty()) {
				Email firstEmail = originals.get(0);
				if (firstEmail.getThreadId() != null) {
					log.info("원본 이메일에서 스레드 ID 찾음: {}", firstEmail.getThreadId());
					return firstEmail.getThreadId();
				}
			}
		}
		return ThreadId.fromEmailHeaders(request.references(), request.inReplyTo(), request.messageId()).getValue();
	}

	private void processAttachments(List<AttachmentRequest> attachments, Email savedEmail, UserId userId) {
		if (attachments == null || attachments.isEmpty()) return;
		for (AttachmentRequest attachment :  attachments) {
			if (isBusinessLicense(attachment.filename()) && isSupportedFileType(attachment.contentType())) {
				try {
					InputStream downloadFile = s3Service.downloadFile(attachment.s3Key());
					emailOCRRespository.registOCR(downloadFile, attachment.filename(), attachment.contentType().split("/")[1],userId.getValue().toString())
							.onErrorContinue((error, item) -> {
								log.warn("OCR 호출 실패 : {}", item,error);
							})
							.subscribe(emailOCR -> {
								log.info("OCR 호출 성공 : {}", emailOCR.toString());
								if (emailOCR.success()) {
									createTemporaryClientUseCase.execute(
											EmailOCR.toTemporaryClientRequest(
													emailOCR, savedEmail.getEmailId(), savedEmail.getSender(), attachment.s3Key()
											),
											userId.getValue()
									);
								}
							});
				} catch (Exception e) {
					log.error("첨부파일 OCR 처리 중 오류 발생", e);
				}
			}
		}
	}

	private boolean isBusinessLicense(String filename) {
		return filename.contains("사업자 등록증") || filename.contains("사업자등록증");
	}

	private boolean isSupportedFileType(String contentType) {
		String type = contentType.split("/")[1];
		return List.of("pdf", "jpg", "jpeg", "png", "tiff").contains(type);
	}
}

