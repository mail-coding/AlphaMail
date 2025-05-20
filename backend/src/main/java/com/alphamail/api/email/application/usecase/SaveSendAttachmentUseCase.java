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

	public List<EmailAttachment> execute(List<MultipartFile> files, Email email) {

		Iterator<MultipartFile> fileIterator = files.iterator();

		List<EmailAttachment> attachmentsToSave = new ArrayList<>();

		while (fileIterator.hasNext()) {
			MultipartFile file = fileIterator.next();
			String s3Key = s3Service.uploadFile(file);
			EmailAttachment attachment = EmailAttachment.builder()
				.emailId(email.getEmailId())
				.name(file.getOriginalFilename())
				.size(file.getSize())
				.type(file.getContentType())
				.S3Key(s3Key)
				.build();

			attachmentsToSave.add(attachment);
		}

		emailAttachmentRepository.saveAll(attachmentsToSave);

		return attachmentsToSave;
	}
}
