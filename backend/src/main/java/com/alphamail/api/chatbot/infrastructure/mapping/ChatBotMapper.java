package com.alphamail.api.chatbot.infrastructure.mapping;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.alphamail.api.chatbot.domain.entity.ChatBot;
import com.alphamail.api.chatbot.infrastructure.entity.ChatBotEntity;

@Mapper(componentModel = "spring")
public interface ChatBotMapper {

	@Mapping(source = "id", target = "messageId")
	ChatBot toDomain(ChatBotEntity chatBotEntity);

	@Mapping(source = "messageId", target = "id")
	ChatBotEntity toEntity(ChatBot chatBot);
}
