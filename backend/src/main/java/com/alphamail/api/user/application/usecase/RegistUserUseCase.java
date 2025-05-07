package com.alphamail.api.user.application.usecase;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.email.domain.entity.EmailFolder;
import com.alphamail.api.email.domain.repository.EmailFolderRepository;
import com.alphamail.api.user.domain.entity.User;
import com.alphamail.api.user.domain.repository.UserRepository;
import com.alphamail.api.user.presentation.dto.CreateUserRequest;
import com.alphamail.common.exception.DuplicateResourceException;
import com.alphamail.common.exception.ErrorMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistUserUseCase {

	private final UserRepository userRepository;
	private final EmailFolderRepository emailFolderRepository;

	@Transactional
	public boolean execute(CreateUserRequest request) {

		if (userRepository.findByEmail(request.email()).isPresent()) {
			throw new DuplicateResourceException(ErrorMessage.EMAIL_ALREADY_EXISTS);
		}

		User user = User.create(request);
		User savedUser = userRepository.save(user);

		List<EmailFolder> folders = savedUser.createDefaultEmailFolders();
		emailFolderRepository.saveAll(folders);
		return savedUser != null; // 저장 성공 여부를 반환
	}

}
