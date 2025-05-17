package com.alphamail.api.assistants.infrastructure.repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.alphamail.api.assistants.domain.entity.EmailSummary;
import com.alphamail.api.assistants.domain.repository.EmailSummarizeRepository;
import com.alphamail.api.assistants.infrastructure.entity.response.SummaryResponse;
import reactor.core.publisher.Mono;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Repository
@Slf4j
public class EmailSummarizeRepositoryImpl implements EmailSummarizeRepository {

	private final WebClient ragWebClient;

	@Override
	public Mono<EmailSummary> summarizeEmail(String emailId, String userId) {
		MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
		formData.add("thread_id", emailId);
		formData.add("user_id", userId);

		return ragWebClient.post()
			.uri("/summarizemail")
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.body(BodyInserters.fromFormData(formData))
			.retrieve()
			.bodyToMono(SummaryResponse.class)
			.map(response -> new EmailSummary(
				response.getVectorId(),
				response.getSummary()
			))
			.doOnError(e -> log.error("Error while summarizing email: {}", e.getMessage()));
	}
}
