package com.alphamail.api.chatbot.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.chatbot.application.dto.ChatBotResult;
import com.alphamail.api.chatbot.application.service.ChatBotService;
import com.alphamail.api.chatbot.application.usecase.RegistChatMessageUseCase;
import com.alphamail.api.chatbot.domain.entity.ChatBot;
import com.alphamail.api.chatbot.domain.entity.ChatRole;
import com.alphamail.api.chatbot.presentation.dto.ChatBotRequest;
import com.alphamail.api.chatbot.presentation.dto.ChatBotResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatBotController {

	private final ChatBotService chatBotService;
	private final RegistChatMessageUseCase registChatMessageUseCase;

	@PostMapping("/message")
	public ResponseEntity<ChatBotResponse> sendMessage(@RequestBody ChatBotRequest request) {
		registChatMessageUseCase.execute(ChatBot.ofUser(request.userId(), request.message()));

		ChatBotResult result = chatBotService.execute(request);

		registChatMessageUseCase.execute(ChatBot.ofBot(request.userId(), result.reply()));

		return ResponseEntity.ok(ChatBotResponse.from(result));
	}
}
