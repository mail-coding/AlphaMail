package com.alphamail.api.chatbot.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.alphamail.api.chatbot.application.dto.ChatBotResult;
import com.alphamail.api.chatbot.infrastructure.adapter.ClaudeApiClient;
import com.alphamail.api.chatbot.infrastructure.adapter.VectorSearchClient;
import com.alphamail.api.chatbot.infrastructure.extractor.SummarizeScheduleExtractor;
import com.alphamail.api.chatbot.presentation.dto.ChatBotResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchScheduleService {

	private final VectorSearchClient vectorSearchClient;
	private final SummarizeScheduleExtractor summarizeScheduleExtractor;

	public ChatBotResponse searchWithSummary(Integer userId, String query) {
		List<String> matched = vectorSearchClient.searchByEmbedding(userId, query);
		ChatBotResult result = ChatBotResult.complete(summarizeScheduleExtractor.extractList(matched));

		return ChatBotResponse.from(result);
	}

}
