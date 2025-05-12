package com.alphamail.api.chatbot.infrastructure.adapter;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LlmScheduleExtractor {

	private final ClaudeApiClient claudeApiClient;

	public String extractJson(String message) {
		String prompt = """
			다음 문장에서 일정 정보를 JSON 형태로 추출해줘. 형식은 다음과 같아:
			```
			{
				"name" : "...",
				"description" : "...",
				"startTime" : "YYYY-MM-DDTHH:MM:SS",
				"endTime" : "YYYY-MM-DDTHH:MM:SS"
			}
			```
			제약사항은 다음과 같아:
			1. name은 일정명을 의미해 null 값이면 안돼.
			2. description은 일정에 대한 간략한 설명이야. 입력에 제공되어 있지 않다면 null 값이어도 돼.
			3. startTime과 endTime은 특정 년도가 언급이 되어있지 않다면 당해를 기준으로 해.
			예를 들어, 당해는 2025년이고 '5월 24일 10시 기획회의 일정 잡아줘'라는 입력이 들어오면 startTime을 2025-05-24T10:00:00"로 설정하면 돼.
			
			입력: %s
			""".formatted(message);
		return claudeApiClient.askClaude(prompt);
	}
}
