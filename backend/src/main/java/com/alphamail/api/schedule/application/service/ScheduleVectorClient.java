package com.alphamail.api.schedule.application.service;

import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alphamail.api.schedule.domain.entity.Schedule;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduleVectorClient {

	private final RestTemplate restTemplate;

	public void upsertSchedule(Schedule schedule) {
		String text = toNaturalText(schedule);

		Map<String, Object> body = Map.of(
			"schedule_id", schedule.getScheduleId(),
			"user_id", schedule.getUserId(),
			"text", text
		);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

		restTemplate.postForEntity("http://localhost:5001/api/vector/upsert", request, Void.class);
	}

	private String toNaturalText(Schedule schedule) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일 a h시 m분", Locale.KOREA);

		String name = schedule.getName();
		String desc = schedule.getDescription() != null && !schedule.getDescription().isBlank()
			? schedule.getDescription()
			: "설명은 따로 없습니다.";

		String start = schedule.getStartTime().format(formatter);
		String end = schedule.getEndTime().format(formatter);

		String done = schedule.getIsDone() ? "이 일정은 완료되었습니다." : "이 일정은 아직 완료되지 않았습니다.";

		return """
        일정 제목: %s
        설명: %s
        시작 시간은 %s이고, 종료 시간은 %s입니다.
        %s
        """.formatted(name, desc, start, end, done);
	}
}
