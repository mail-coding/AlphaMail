package com.alphamail.api.email.infrastructure.repository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.alphamail.api.email.domain.entity.EmailFolder;
import com.alphamail.api.email.domain.repository.EmailFolderRepository;
import com.alphamail.api.email.infrastructure.entity.EmailFolderEntity;
import com.alphamail.api.email.infrastructure.mapper.EmailFolderMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EmailFolderRepositoryImpl implements EmailFolderRepository {

	private final EmailFolderJpaRepository emailFolderJpaRepository;
	private final EmailFolderMapper emailFolderMapper;

	@Override
	public Integer getSentFolderId(Integer userId) {
		EmailFolderEntity folderEntity = emailFolderJpaRepository.findByUser_UserIdAndName(userId, "SENT");

		return folderEntity.getEmailFolderId();

	}

	@Override
	public Integer getInboxFolderId(Integer userId) {
		EmailFolderEntity folderEntity = emailFolderJpaRepository.findByUser_UserIdAndName(userId, "INBOX");
		return folderEntity.getEmailFolderId();
	}

	@Override
	public String getFolderNameById(Integer folderId) {
		EmailFolderEntity folderEntity = emailFolderJpaRepository.findById(folderId).orElse(null);
		return folderEntity.getName();
	}

	@Override
	public List<EmailFolder> findAllByUserId(Integer userId) {
		List<EmailFolderEntity> folders = emailFolderJpaRepository.findAllByUser_UserId(userId);
		return folders.stream()
			.map(emailFolderMapper::toDomain)
			.collect(Collectors.toList());
	}

	@Override
	public EmailFolder findByUserIdAndFolderName(Integer userId, String folderName) {
		EmailFolderEntity folderEntity = emailFolderJpaRepository.findByUser_UserIdAndName(userId, folderName);
		return emailFolderMapper.toDomain(folderEntity);
	}

	@Override
	public EmailFolder save(EmailFolder emailFolder) {
		EmailFolderEntity savedEntity = emailFolderJpaRepository.save(emailFolderMapper.toEntity(emailFolder));
		return emailFolderMapper.toDomain(savedEntity);
	}

	@Override
	public List<EmailFolder> saveAll(List<EmailFolder> emailFolders) {
		List<EmailFolderEntity> entities = emailFolders.stream()
			.map(emailFolderMapper::toEntity)
			.collect(Collectors.toList());

		List<EmailFolderEntity> savedEntities = emailFolderJpaRepository.saveAll(entities);

		return savedEntities.stream()
			.map(emailFolderMapper::toDomain)
			.collect(Collectors.toList());
	}

	@Override
	public EmailFolder findById(Integer folderId) {
		EmailFolderEntity folderEntity = emailFolderJpaRepository.findById(folderId).orElse(null);

		return emailFolderMapper.toDomain(folderEntity);
	}

}
