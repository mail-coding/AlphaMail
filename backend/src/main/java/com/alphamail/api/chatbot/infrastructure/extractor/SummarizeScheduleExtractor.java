package com.alphamail.api.chatbot.infrastructure.extractor;

import java.util.List;

import org.springframework.stereotype.Component;

import com.alphamail.api.chatbot.infrastructure.adapter.ClaudeApiClient;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SummarizeScheduleExtractor {

	private final ClaudeApiClient claudeApiClient;

	public String extractList(List<String> matchedSchedules) {
		String prompt;
		if (matchedSchedules == null || matchedSchedules.isEmpty()) {
			prompt = """
				벡터화된 일정에서 결과를 못찾았어.
				사용자가 더 구체적인 일정 검색 질문을 할 수 있도록 유도하는 말을 생성해줘.
				""";
			return claudeApiClient.askClaude(prompt);
		}
		String input = String.join("\n", matchedSchedules);
		prompt = """
			다음은 사용자의 일정 목록이야.
			이 중 검색된 일정들을 요약해서 간결하고 이해하기 쉽게 정리해줘.
			형식은 문장으로 친절하게 알려줘야 해.
			그리고 사용자가 추가 질의를 할 수 있도록 유도하는 문장으로 끝맺어줘
			%s
			""".formatted(input);

		return claudeApiClient.askClaude(prompt);
	}
}
