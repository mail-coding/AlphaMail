package com.alphamail.api.chatbot.domain.repository;

import com.alphamail.api.chatbot.domain.entity.ChatBot;

public interface ChatBotRepository {

	ChatBot save(ChatBot chatBot);
}
