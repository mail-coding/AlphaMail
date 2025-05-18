package com.alphamail.api.email.domain.entity;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder(toBuilder = true)
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RecentUsedEmail {
	private Integer id;
	private Integer userId;
	private String recentEmail;
	private String emailOwner;
	private LocalDateTime lastUpdatedTime;

	public static RecentUsedEmail create(Integer userId, String email, String owner) {
		return RecentUsedEmail.builder()
			.userId(userId)
			.recentEmail(email)
			.emailOwner(owner)
			.lastUpdatedTime(LocalDateTime.now())
			.build();
	}

	public RecentUsedEmail updateLastUsedTime() {
		return this.toBuilder()
			.lastUpdatedTime(LocalDateTime.now())
			.build();
	}

}
