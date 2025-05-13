package com.alphamail.api.chatbot.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.chatbot.application.dto.ChatBotResult;
import com.alphamail.api.chatbot.application.service.RegistScheduleService;
import com.alphamail.api.chatbot.application.service.SearchScheduleService;
import com.alphamail.api.chatbot.infrastructure.extractor.SummarizeScheduleExtractor;
import com.alphamail.api.chatbot.presentation.dto.ChatBotRequest;
import com.alphamail.api.chatbot.presentation.dto.ChatBotResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatBotController {

	private final RegistScheduleService registScheduleService;
	private final SearchScheduleService searchScheduleService;

	@PostMapping("/regist/schedule")
	public ResponseEntity<ChatBotResponse> registSchedule(@RequestBody ChatBotRequest request) {
		ChatBotResult result = registScheduleService.execute(request);

		return ResponseEntity.ok(ChatBotResponse.from(result));
	}

	@PostMapping("/search/summary")
	public ResponseEntity<ChatBotResponse> searchAndSummarize(@RequestBody ChatBotRequest request) {
		ChatBotResponse response = searchScheduleService.searchWithSummary(request.userId(), request.message());

		return ResponseEntity.ok(response);
	}
}
