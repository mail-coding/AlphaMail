package com.alphamail.api.user.application.usecase;

import org.springframework.stereotype.Service;

import com.alphamail.api.user.domain.entity.User;
import com.alphamail.api.user.domain.repository.UserRepository;
import com.alphamail.api.user.presentation.dto.ChangePasswordRequest;
import com.alphamail.api.user.presentation.dto.PasswordChangeResult;
import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.ErrorMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChangePasswordUseCase {
	private final UserRepository userRepository;

	public PasswordChangeResult execute(Integer userId, ChangePasswordRequest request) {
		User user = userRepository.findById(userId);

		if (!user.verifyPassword(request.currPassword())) {
			return PasswordChangeResult.failure(ErrorMessage.CURRENT_PASSWORD_MISMATCH);
		}

		if (request.newPassword().equals(request.currPassword())) {
			return PasswordChangeResult.failure(ErrorMessage.SAME_AS_CURRENT_PASSWORD);
		}

		try {
			userRepository.save(user.updatePassword(request.newPassword()));
			return PasswordChangeResult.SUCCESS;
		} catch (BadRequestException e) {
			return PasswordChangeResult.failure(ErrorMessage.PASSWORD_EMPTY);
		}
	}
}
