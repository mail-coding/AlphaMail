package com.alphamail.api.email.presentation.dto;

import java.util.List;

public record RecentEmailListResponse(
	List<RecentEmailResponse> recentEmails
) {

	public static RecentEmailListResponse from(List<RecentEmailResponse> recentEmails) {
		return new RecentEmailListResponse(recentEmails);
	}
}
