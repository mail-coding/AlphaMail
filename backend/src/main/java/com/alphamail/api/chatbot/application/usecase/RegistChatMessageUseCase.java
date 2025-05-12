package com.alphamail.api.chatbot.application.usecase;

import org.springframework.stereotype.Service;

import com.alphamail.api.chatbot.domain.entity.ChatBot;
import com.alphamail.api.chatbot.domain.repository.ChatBotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistChatMessageUseCase {

	private final ChatBotRepository chatBotRepository;

	public void execute(ChatBot chatBot) {
		chatBotRepository.save(chatBot);
	}
}
