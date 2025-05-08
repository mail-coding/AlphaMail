package com.alphamail.api.auth.application.usecase;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.alphamail.api.auth.domain.repository.TokenRepository;
import com.alphamail.api.auth.infrastructure.security.jwt.JwtTokenProvider;
import com.alphamail.api.auth.presentation.dto.LoginRequest;
import com.alphamail.api.auth.presentation.dto.TokenResponse;
import com.alphamail.api.user.domain.entity.User;
import com.alphamail.api.user.domain.repository.UserRepository;
import com.alphamail.api.user.domain.valueobject.UserId;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginUseCase {

	private final UserRepository userRepository;
	private final TokenRepository tokenRepository;
	private final JwtTokenProvider jwtTokenProvider;

	public TokenResponse execute(LoginRequest loginRequest) {
		//이메일로 사용자 찾기
		User user = userRepository.findByEmail(loginRequest.email())
			.orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
		//비밀번호 검증
		if (!user.verifyPassword(loginRequest.password())) {
			throw new BadCredentialsException("Invalid email or password");
		}

		//jwt토큰 생성
		UserId userId = user.getId();
		String accessToken = jwtTokenProvider.createAccessToken(userId);
		Long expiresIn = jwtTokenProvider.getAccessTokenValidityInSeconds();

		//저장
		tokenRepository.saveAccessToken(userId, accessToken, expiresIn);

		//반환
		return TokenResponse.of(accessToken, expiresIn);

	}
}
