package com.alphamail.api.chatbot.infrastructure.repository;

import org.springframework.stereotype.Repository;

import com.alphamail.api.chatbot.domain.entity.ChatBot;
import com.alphamail.api.chatbot.domain.repository.ChatBotRepository;
import com.alphamail.api.chatbot.infrastructure.entity.ChatBotEntity;
import com.alphamail.api.chatbot.infrastructure.mapping.ChatBotMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatBotRepositoryImpl implements ChatBotRepository {

	private final ChatBotJpaRepository chatBotJpaRepository;
	private final ChatBotMapper chatBotMapper;

	@Override
	public ChatBot save(ChatBot chatBot) {
		ChatBotEntity entity = chatBotMapper.toEntity(chatBot);
		ChatBotEntity savedEntity = chatBotJpaRepository.save(entity);

		return chatBotMapper.toDomain(savedEntity);
	}
}
