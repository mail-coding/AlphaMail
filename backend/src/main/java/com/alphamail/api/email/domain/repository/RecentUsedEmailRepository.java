package com.alphamail.api.email.domain.repository;

import java.util.List;
import java.util.Optional;

import com.alphamail.api.email.domain.entity.RecentUsedEmail;

public interface RecentUsedEmailRepository {

	List<RecentUsedEmail> findTop10ByUserId(Integer userId);

	Optional<RecentUsedEmail> findByUserIdAndRecentEmail(Integer userId, String email);

	RecentUsedEmail save(RecentUsedEmail recentUsedEmail);
}
