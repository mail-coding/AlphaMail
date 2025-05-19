package com.alphamail.api.email.infrastructure.repository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailStatus;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.api.email.infrastructure.entity.EmailEntity;
import com.alphamail.api.email.infrastructure.mapper.EmailMapper;
import com.alphamail.api.email.presentation.dto.EmailThreadItem;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmailRepositoryImpl implements EmailRepository {
	private final EmailJpaRepository emailJpaRepository;
	private final EmailMapper emailMapper;

	@Override
	public Email save(Email email) {
		EmailEntity entity = emailMapper.toEntity(email);
		EmailEntity savedEntity = emailJpaRepository.save(entity);

		return emailMapper.toDomain(savedEntity);
	}

	@Override
	public Email updateStatus(Integer emailId, EmailStatus status) {
		EmailEntity entity = emailJpaRepository.findById(emailId).orElse(null);

		entity.updateStatus(status);

		return emailMapper.toDomain(emailJpaRepository.save(entity));

	}

	@Override
	public int countByFolderIdAndUserId(Integer folderId, Integer userId) {
		return (int)emailJpaRepository.countByFolder_EmailFolderIdAndUser_UserId(folderId, userId);
	}

	@Override
	public int countReadByFolderIdAndUserId(Integer folderId, Integer userId) {
		return (int)emailJpaRepository.countByFolder_EmailFolderIdAndUser_UserIdAndReadStatusTrue(folderId, userId);
	}

	@Override
	public Optional<Email> findByIdAndUserId(Integer emailId, Integer userId) {
		return emailJpaRepository.findByEmailIdAndUser_UserId(emailId, userId)
			.map(emailMapper::toDomain);

	}

	@Override
	public void updateFolder(List<Integer> emailIds, Integer folderId) {
		emailJpaRepository.updateFolderByEmailIds(emailIds, folderId);

	}

	@Override
	public boolean validateEmailOwnership(List<Integer> emailIds, Integer userId) {
		long count = emailJpaRepository.countByEmailIdInAndUser_UserId(emailIds, userId);
		return count == emailIds.size();
	}

	@Override
	public Boolean existsByIdAndUserId(Integer emailId, Integer userId) {
		return emailJpaRepository.existsByEmailIdAndUser_UserId(emailId, userId);
	}

	@Override
	public Integer deleteByFolderId(Integer folderId, Integer userId) {
		List<EmailEntity> emails = emailJpaRepository.findAllWithAttachmentsByFolderIdAndUserId(folderId, userId);
		for (EmailEntity email : emails) {
			email.getAttachments().clear(); // orphanRemoval 트리거
			emailJpaRepository.delete(email);
		}
		return emails.size();
	}

	@Override
	public List<EmailThreadItem> findByThreadIdAndUserId(String threadId, Integer userId) {

		return emailJpaRepository.findByThreadIdAndUserUserIdOrderByReceivedDateTimeAsc(threadId, userId)
			.stream()
			.map(entity -> new EmailThreadItem(
				entity.getEmailId(),
				entity.getSender(),
				entity.getSubject(),
				entity.getSentDateTime() != null ? entity.getSentDateTime() : entity.getReceivedDateTime(),
				entity.getOriginalFolderId(),
				entity.getFolder().getName()
			))
			.collect(Collectors.toList());
	}

	@Override
	public void updateSesMessageId(Integer emailId, String sesMessageId) {
		emailJpaRepository.updateSesMessageId(emailId, sesMessageId);
	}

	@Override
	public void updateMessageIdThreadIdAndStatus(Integer emailId, String messageId, String threadId,
		EmailStatus status) {
		emailJpaRepository.updateMessageIdThreadIdAndStatus(emailId, messageId, threadId, status);
	}

	@Override
	public void updateThreadId(Integer emailId, String threadId) {
		emailJpaRepository.updateThreadId(emailId, threadId);
	}

	@Override
	public Email findByMessageId(String messageId) {
		return emailJpaRepository.findByMessageId(messageId)
			.map(emailMapper::toDomain)
			.orElse(null);
	}

	@Override
	public void updateReadStatus(Integer emailId, Boolean readStatus) {
		emailJpaRepository.updateReadStatusById(emailId, readStatus);
	}

	@Override
	public Page<Email> findByFolderIdAndUserId(Integer folderId, Integer userId, Pageable pageable) {
		Page<EmailEntity> emailEntities = emailJpaRepository.findByFolder_EmailFolderIdAndUser_UserId(folderId, userId,
			pageable);

		return emailEntities.map(emailMapper::toDomain);
	}

	@Override
	public Page<Email> searchByFolderIdAndUserId(Integer folderId, Integer userId, String query, Pageable pageable) {
		Page<EmailEntity> emailEntities = emailJpaRepository
			.findByFolder_EmailFolderIdAndUser_UserIdAndSubjectContaining(
				folderId, userId, query, pageable);

		return emailEntities.map(emailMapper::toDomain);
	}

}
