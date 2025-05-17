package com.alphamail.api.assistants.application.usecase.emailsummarize;

import java.time.Duration;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.alphamail.api.assistants.domain.entity.EmailSummary;
import com.alphamail.api.assistants.domain.repository.EmailSummarizeRepository;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.repository.EmailRepository;
import jakarta.persistence.EntityNotFoundException;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSummarizeUseCase {

	private final EmailSummarizeRepository emailSummarizeRepository;
	// 진짜 이거 쓰면 안되는데 급하니까 일단 쓴다.
	private final EmailRepository emailRepository;

	public EmailSummary execute(Integer emailId, Integer userId) {
		log.info("동기식 이메일 요약을 시작합니다. emailId: {}, userId: {}", emailId, userId);
		try {
			Optional<Email> emailOpt = emailRepository.findByIdAndUserId(emailId, userId);
			if (emailOpt.isEmpty()) {
				throw new EntityNotFoundException("이메일을 찾을 수 없습니다: " + emailId);
			}
			Email email = emailOpt.get();
			String threadId = email.getThreadId();
			if (threadId == null || threadId.isEmpty()) {
				throw new IllegalStateException("이메일에 ThreadId가 없습니다: " + emailId);
			}
			EmailSummary summary = emailSummarizeRepository.summarizeEmail(threadId, userId.toString())
				.block(Duration.ofSeconds(30));
			return summary;

		} catch (Exception e) {
			log.info("이메일 요약 중 오류가 발생했습니다. emailId: {}, 오류: {}", emailId, e.getMessage(), e);
			if (e instanceof RuntimeException) {
				log.info("요약하는데 너무 많은 시간이 걸립니다. : {}", e.getClass().getName());
			}
			throw e; // 오류를 상위로 전파
		}
	}
}