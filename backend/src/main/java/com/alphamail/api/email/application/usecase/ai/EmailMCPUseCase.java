package com.alphamail.api.email.application.usecase.ai;

import com.alphamail.api.email.domain.entity.EmailMCP;
import com.alphamail.api.email.domain.repository.EmailMCPRepository;
import com.alphamail.api.assistants.presentation.dto.ai.EmailMCPRequest;
import com.alphamail.api.assistants.presentation.dto.ai.EmailMCPResponse;
import com.alphamail.api.email.presentation.dto.ReceiveEmailRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailMCPUseCase {

	private final EmailMCPRepository emailMCPRepository;

	public Mono<EmailMCP> execute(ReceiveEmailRequest request, Integer emailId) {

		String query = "from : " + request.from() + "\nto : " + request.actualRecipient() + "\nsubject: " + request.subject()
			+ "\n mailContent: " + request.html()
			+ "\n emailId=" + emailId + "\nuserEmail=" + request.actualRecipient();
		log.info("MCP에서 날리는 쿼리={}", query);
		return emailMCPRepository.registMCP(query);
	}

}
