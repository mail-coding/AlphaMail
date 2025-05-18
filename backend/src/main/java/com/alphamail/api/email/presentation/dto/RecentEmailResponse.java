package com.alphamail.api.email.presentation.dto;

import java.time.LocalDateTime;

import com.alphamail.api.email.domain.entity.RecentUsedEmail;

public record RecentEmailResponse(
	String email,
	String owner,
	LocalDateTime lastUpdatedTime
) {
	public static RecentEmailResponse from(RecentUsedEmail recentEmail) {
		return new RecentEmailResponse(
			recentEmail.getRecentEmail(),
			recentEmail.getEmailOwner(),
			recentEmail.getLastUpdatedTime()
		);
	}
}
