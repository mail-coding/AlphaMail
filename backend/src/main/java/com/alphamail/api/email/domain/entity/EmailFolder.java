package com.alphamail.api.email.domain.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailFolder {

	private Integer emailFolderId;
	private Integer userId;
	private String emailFolderName;

	public static EmailFolder createDefault(Integer userId, String folderName) {
		return EmailFolder.builder()
			.userId(userId)
			.emailFolderName(folderName)
			.build();

	}
}
