package com.alphamail.api.chatbot.infrastructure.adapter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ClaudeApiClient {

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper;

	@Value("${claude.api.key}")
	private String apiKey;
	@Value("${claude.base-url}")
	private String baseUrl;

	public String askClaude(String userMessage) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("x-api-key", apiKey);
			headers.set("anthropic-version", "2023-06-01");

			Map<String, Object> request = new HashMap<>();
			request.put("model", "claude-3-5-sonnet-20241022");
			request.put("max_tokens", 1000);
			request.put("temperature", 0.7);
			request.put("messages", List.of(
				Map.of("role", "user", "content", userMessage)
			));

			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

			ResponseEntity<String> response = restTemplate.postForEntity(baseUrl, entity, String.class);

			JsonNode root = objectMapper.readTree(response.getBody());
			return root.get("content").get(0).get("text").asText();
		} catch (Exception e) {
			e.printStackTrace();
			return "Claude 응답실패: " + e.getMessage();
		}
	}
}
