package com.alphamail.api.auth.application.usecase;

import org.springframework.stereotype.Service;

import com.alphamail.api.auth.domain.repository.TokenRepository;
import com.alphamail.api.user.domain.valueobject.UserId;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogoutUseCase {

	private final TokenRepository tokenRepository;

	public void execute(UserId userId) {
		tokenRepository.removeAccessToken(userId);

	}
}
