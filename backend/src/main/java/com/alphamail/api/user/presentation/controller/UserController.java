package com.alphamail.api.user.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.user.application.usecase.ChangePasswordUseCase;
import com.alphamail.api.user.application.usecase.RegistUserUseCase;
import com.alphamail.api.user.presentation.dto.ChangePasswordRequest;
import com.alphamail.api.user.presentation.dto.CreateUserRequest;
import com.alphamail.api.user.presentation.dto.PasswordChangeResult;
import com.alphamail.common.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	private final RegistUserUseCase registUserUseCase;
	private final ChangePasswordUseCase changePasswordUseCase;

	@PostMapping
	public ResponseEntity<Boolean> regist(@RequestBody CreateUserRequest request) {
		return ResponseEntity.ok(registUserUseCase.execute(request));
	}

	@PatchMapping("/password")
	public ResponseEntity<?> update(@Auth Integer userId, @RequestBody ChangePasswordRequest request) {
		PasswordChangeResult result = changePasswordUseCase.execute(userId, request);

		if (result.success()) {
			return ResponseEntity.ok(result);
		} else {
			return ResponseEntity.badRequest().body(result);
		}

	}

}
