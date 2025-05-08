package com.alphamail.api.user.infrastructure.adapter;

import org.springframework.stereotype.Component;

import com.alphamail.api.user.application.port.LoadUserPort;
import com.alphamail.api.user.domain.repository.UserRepository;
import com.alphamail.api.user.domain.valueobject.UserId;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class LoadUserAdapter implements LoadUserPort {

	private final UserRepository userRepository;

	@Override
	public UserId loadUserIdByEmail(String email) {
		return userRepository.findByEmail(email)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND))
			.getId();
	}
}
