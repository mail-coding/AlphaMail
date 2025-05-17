package com.alphamail.api.email.application.usecase;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.email.domain.repository.EmailAttachmentRepository;
import com.alphamail.api.email.presentation.dto.SendEmailRequest;
import com.alphamail.api.global.s3.service.S3Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaveSendAttachmentUseCase {
	private final EmailAttachmentRepository emailAttachmentRepository;
	private final S3Service s3Service;

	public List<EmailAttachment> execute(List<MultipartFile> files, List<SendEmailRequest.Attachment> metadataList,
		Email email) {

		if (files.size() != metadataList.size()) {
			throw new IllegalArgumentException("첨부파일 개수와 메타데이터 개수가 일치하지 않습니다.");
		}

		Iterator<MultipartFile> fileIterator = files.iterator();
		Iterator<SendEmailRequest.Attachment> metaIterator = metadataList.iterator();

		List<EmailAttachment> attachmentsToSave = new ArrayList<>();

		while (fileIterator.hasNext() && metaIterator.hasNext()) {
			MultipartFile file = fileIterator.next();
			SendEmailRequest.Attachment metadata = metaIterator.next();

			String s3Key = s3Service.uploadFile(file);

			// 일단 MultipartFile의 데이터에서도 확인 가능하지만
			// 나중에 추후에 Front의 요청값과 같은지 Check할 여부가 있기에 둘다 받는걸로 처리함.
			// metadataList와 files의 비교가 매우 중요할 수도..?
			EmailAttachment attachment = EmailAttachment.builder()
				.emailId(email.getEmailId())
				.name(metadata.name())
				.size(metadata.size())
				.type(metadata.type())
				.S3Key(s3Key)
				.build();

			attachmentsToSave.add(attachment);
		}

		emailAttachmentRepository.saveAll(attachmentsToSave);

		return attachmentsToSave;
	}
}
