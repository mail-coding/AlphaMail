package com.alphamail.api.chatbot.infrastructure.adapter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VectorSearchClient {

	private final RestTemplate restTemplate;

	public List<String> searchByEmbedding(Integer userId, String query) {
		Map<String, Object> body = Map.of(
			"query", query,
			"user_id", userId
		);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

		ResponseEntity<List> response = restTemplate.exchange(
			"http://localhost:5001/api/vector/search",
			HttpMethod.POST,
			request,
			List.class
		);

		return response.getBody();
	}
}
