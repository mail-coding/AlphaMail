package com.alphamail.api.assistants.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.assistants.application.usecase.emailsummarize.EmailSummarizeUseCase;
import com.alphamail.api.assistants.domain.entity.EmailSummary;
import com.alphamail.api.assistants.presentation.dto.summary.EmailSummaryResponse;
import com.alphamail.common.annotation.Auth;
import com.alphamail.common.constants.ApiPaths;
import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Mono;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@RestController
@RequestMapping(ApiPaths.ASSISTANTS_BASE_API + ApiPaths.EMAIL_SUMMARIZE_API)
@Slf4j
public class EmailSummarizeController {

	private final EmailSummarizeUseCase emailSummarizeUseCase;

	@GetMapping("/{emailId}")
	public EmailSummaryResponse summarizeEmail(@PathVariable Integer emailId, @Auth Integer userId) {
		log.info("Email summarize request received for emailId: {}, userId: {}", emailId, userId);

		try {
			// 동기식 UseCase 메소드 호출
			EmailSummary summary = emailSummarizeUseCase.execute(emailId, userId);

			return new EmailSummaryResponse(
				"success",
				summary.getThreadId(),
				summary.getContent()
			);
		} catch (Exception e) {
			// 예외 처리 로직
			log.error("컨트롤러: 요약 중 오류: {}", e.getMessage(), e);

			// 각 예외 유형에 맞는 응답 생성
			if (e instanceof EntityNotFoundException) {
				return new EmailSummaryResponse("error", emailId.toString(), "이메일을 찾을 수 없습니다.");
			} else if (e instanceof IllegalStateException) {
				return new EmailSummaryResponse("error", emailId.toString(), "이메일 스레드 정보가 올바르지 않습니다.");
			} else {
				return new EmailSummaryResponse("error", emailId.toString(), "요약 생성 중 오류가 발생했습니다: " + e.getMessage());
			}
		}
	}
}


