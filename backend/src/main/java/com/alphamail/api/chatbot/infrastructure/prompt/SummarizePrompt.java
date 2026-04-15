package com.alphamail.api.chatbot.infrastructure.prompt;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.alphamail.api.chatbot.infrastructure.claude.ClaudeApiClient;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SummarizePrompt {

	private final ClaudeApiClient claudeApiClient;

	public String generateAnswer(String documentType, String userQuery, String timezone,
		List<Map<String, String>> matchedSchedules) {
		String input = String.valueOf(matchedSchedules);
		String prompt = """
			다음은 %s 목록입니다. 사용자의 질문에 해당하는 항목만 골라서 전체 요약을 해주세요.
			그리고 요약에 실제로 사용된 항목의 `id`만 추려서 함께 표시하세요.
			
			**요약문(`reply`)에 등장한 항목만 `ids` 배열에 포함해야 합니다.**
			
			형식은 반드시 아래 JSON 구조를 따르세요:
			
			```
			{
			  "reply": "여기에 한 문단으로 작성한 요약이 들어갑니다...",
			  "ids": ["23", "25"]
			}
			```
			
			요약 규칙:
			1. 사용자 질문은 **UTC 기준으로 이미 날짜가 보정된 상태**입니다.
			   → 따라서 항목의 날짜(UTC 기준)와 사용자 질문을 **직접 비교**하여 일치 여부를 판단하세요.
			2. 항목에 있는 날짜는 문자열이며, 포맷은 다음과 같습니다:
			   - `"yyyy년 MM월 dd일 HH시 mm분"` (예: "2025년 05월 19일 06시 00분")
			   - **이 값은 모두 UTC 기준입니다.**
			3. 사용자 질문에서 원하는 조건(날짜, 종류, 장소, 참석자 등)에 **정확히** 일치하는 항목만 선택해 주세요.
			4. 날짜가 불일치하거나 관련 없는 항목은 절대 포함하지 마세요.
			4. 요약문(`reply`)에는 **사용자 시간대 기준의 날짜와 시간**으로 변환하여 설명을 작성해 주세요.
			   - 항목의 날짜(UTC): 2025년 05월 19일 06시 00분
			   - 사용자 시간대: UTC+0900
			   -> 변환된 시간: 2025년 05월 19일 15시 00분
			6. 요약문은 사용자에게 보여질 문장이므로, **친절한 존댓말**로 작성하고 **Markdown 형식**을 사용하세요.
			7. 요약의 끝은 사용자가 추가 질문을 할 수 있도록 유도하는 문장으로 마무리하세요.
			
			[사용자 질문]
			%s
			
			[사용자 시간대]
			UTC%s
			
			[%s 목록]
			%s
			""".formatted(documentType, userQuery, timezone, documentType, input);

		return claudeApiClient.askClaude(prompt);
	}
}
