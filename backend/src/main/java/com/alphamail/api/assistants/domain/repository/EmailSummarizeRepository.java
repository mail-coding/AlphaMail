package com.alphamail.api.assistants.domain.repository;

import com.alphamail.api.assistants.domain.entity.EmailSummary;
import reactor.core.publisher.Mono;

public interface EmailSummarizeRepository {
	Mono<EmailSummary> summarizeEmail(String emailId, String userId);
}
