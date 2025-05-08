package com.alphamail.api.auth.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.auth.application.usecase.LoginUseCase;
import com.alphamail.api.auth.presentation.dto.LoginRequest;
import com.alphamail.api.auth.presentation.dto.TokenResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {

	private final LoginUseCase loginUseCase;

	@PostMapping("/login")
	public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest loginRequest) {
		TokenResponse response = loginUseCase.execute(loginRequest);

		return ResponseEntity.ok(response);

	}

}
