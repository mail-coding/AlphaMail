package com.alphamail.api.user.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.user.application.usecase.RegistUserUseCase;
import com.alphamail.api.user.presentation.dto.CreateUserRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	private final RegistUserUseCase registUserUseCase;

	@PostMapping
	public ResponseEntity<Boolean> regist(@RequestBody CreateUserRequest request) {
		return ResponseEntity.ok(registUserUseCase.execute(request));
	}

}
