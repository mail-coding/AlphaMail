package com.alphamail.api.chatbot.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alphamail.api.chatbot.infrastructure.entity.ChatBotEntity;

@Repository
public interface ChatBotJpaRepository extends JpaRepository<ChatBotEntity, Integer> {
}
