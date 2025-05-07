package com.alphamail.api.email.domain.repository;

import java.util.List;

import com.alphamail.api.email.domain.entity.EmailFolder;

public interface EmailFolderRepository {

	Integer getSentFolderId(Integer userId);

	Integer getInboxFolderId(Integer userId);

	EmailFolder findById(Integer id);

	String getFolderNameById(Integer folderId);

	List<EmailFolder> findAllByUserId(Integer userId);

	EmailFolder findByUserIdAndFolderName(Integer userId, String folderName);

	EmailFolder save(EmailFolder emailFolder);

	List<EmailFolder> saveAll(List<EmailFolder> emailFolders);

}
