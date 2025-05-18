package com.alphamail.api.email.application.usecase;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.RecentUsedEmail;
import com.alphamail.api.email.domain.repository.RecentUsedEmailRepository;
import com.alphamail.api.email.presentation.dto.RecentEmailListResponse;
import com.alphamail.api.email.presentation.dto.RecentEmailResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetRecentEmailUseCase {

	private final RecentUsedEmailRepository recentUsedEmailRepository;

	public RecentEmailListResponse execute(Integer userId) {
		List<RecentUsedEmail> emails = recentUsedEmailRepository.findTop10ByUserId(userId);

		List<RecentEmailResponse> responseList = emails.stream()
			.map(RecentEmailResponse::from)
			.collect(Collectors.toList());

		return RecentEmailListResponse.from(responseList);
	}
}
