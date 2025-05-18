package com.alphamail.api.email.application.usecase;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.RecentUsedEmail;
import com.alphamail.api.email.domain.repository.RecentUsedEmailRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaveRecentEmailUseCase {
	private final RecentUsedEmailRepository recentUsedEmailRepository;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void execute(Integer userId, String email, String owner) {
		// 이미 존재하면 timestamp만 업데이트
		Optional<RecentUsedEmail> existingEmail =
			recentUsedEmailRepository.findByUserIdAndRecentEmail(userId, email);

		if (existingEmail.isPresent()) {
			recentUsedEmailRepository.save(existingEmail.get().updateLastUsedTime());
		} else {
			RecentUsedEmail newRecentEmail = RecentUsedEmail.create(userId, email, owner);
			recentUsedEmailRepository.save(newRecentEmail);
		}
	}
}