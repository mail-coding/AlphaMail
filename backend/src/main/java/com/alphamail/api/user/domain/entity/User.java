package com.alphamail.api.user.domain.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCrypt;

import com.alphamail.api.email.domain.entity.EmailFolder;
import com.alphamail.api.user.domain.valueobject.UserId;
import com.alphamail.api.user.presentation.dto.CreateUserRequest;
import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.ErrorMessage;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {

	private static final String DEFAULT_USER_IMAGE =
		"https://your-s3-bucket.com/default-user-image.jpg";

	private static final String[] DEFAULT_EMAIL_FOLDERS =
		{"INBOX", "SENT", "TRASH"};

	private UserId id;
	private Integer groupId;
	private String position;
	private String name;
	private String email;
	private String phoneNum;
	private String hashedPassword;
	private String image;
	private LocalDateTime updatedAt;
	private LocalDateTime deletedAt;

	public static User create(CreateUserRequest request) {
		return User.builder()
			.groupId(request.groupId())
			.position(request.position())
			.name(request.name())
			.email(request.email())
			.phoneNum(request.phoneNum())
			.hashedPassword(hashPassword(request.password()))
			.image(DEFAULT_USER_IMAGE)
			.build();
	}

	public List<EmailFolder> createDefaultEmailFolders() {
		List<EmailFolder> folders = new ArrayList<>();
		for (String folderName : DEFAULT_EMAIL_FOLDERS) {
			folders.add(EmailFolder.createDefault(id.getValue(), folderName));
		}

		return folders;
	}

	private static String hashPassword(String password) {
		return BCrypt.hashpw(password, BCrypt.gensalt(12)); // 12는 반복 횟수
	}

	public boolean verifyPassword(String plainPassword) {
		return BCrypt.checkpw(plainPassword, hashedPassword);
	}


	public User updatePassword(String newPassword) {
		if (newPassword == null || newPassword.isEmpty()) {
			throw new BadRequestException(ErrorMessage.PASSWORD_EMPTY);
		}
		return User.builder()
			.id(this.id)
			.groupId(this.groupId)
			.position(this.position)
			.name(this.name)
			.email(this.email)
			.phoneNum(this.phoneNum)
			.hashedPassword(hashPassword(newPassword))
			.image(this.image)
			.updatedAt(LocalDateTime.now())
			.deletedAt(this.deletedAt)
			.build();
	}
}
