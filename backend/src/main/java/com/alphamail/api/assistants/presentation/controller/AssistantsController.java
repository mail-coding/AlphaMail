package com.alphamail.api.assistants.presentation.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.assistants.application.usecase.assistant.GetAIAssistantUseCase;
import com.alphamail.api.assistants.domain.entity.TemporaryItem;;
import com.alphamail.api.global.dto.GetPageResponse;
import com.alphamail.common.annotation.Auth;
import com.alphamail.common.constants.ApiPaths;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(ApiPaths.ASSISTANTS_BASE_API)
public class AssistantsController {

	private final GetAIAssistantUseCase getAIAssistantUseCase;

	@GetMapping
	public ResponseEntity<GetPageResponse<TemporaryItem>> getAIAssistants(
		@Auth Integer userId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "0") int sort
	) {
		// Pageable 객체를 생성
		Pageable pageable = PageRequest.of(page, size, Sort.by(
			sort == 0 ? Sort.Order.asc("emailTime") : Sort.Order.desc("emailTime")
		));

		// 서비스로 전달하여 처리
		GetPageResponse<TemporaryItem> response = getAIAssistantUseCase.execute(userId, pageable);

		return ResponseEntity.ok(response);
	}
}