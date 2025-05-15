package com.alphamail.api.assistants.domain.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;

public class ScheduleTimeParser {

    private static final LocalTime DEFAULT_START_TIME = LocalTime.of(9, 0);    // 09:00
    private static final LocalTime DEFAULT_END_TIME = LocalTime.of(9, 59);    // 09:59

    public static LocalDateTime parseStart(String rawStart) {
        return parseDateTime(rawStart, DEFAULT_START_TIME);
    }

    public static LocalDateTime parseEnd(String rawEnd) {
        return parseDateTime(rawEnd, DEFAULT_END_TIME);
    }

    private static LocalDateTime parseDateTime(String raw, LocalTime defaultTime) {
        if (raw == null) {
            return LocalDateTime.of(LocalDate.now(), defaultTime);
        }

        try {
            return LocalDateTime.parse(raw);
        } catch (DateTimeParseException e) {
            try {
                if (raw.contains("T")) {
                    String[] parts = raw.split("T");
                    String datePart = parts[0].isBlank() ? LocalDate.now().toString() : parts[0];
                    String timePart = parts.length > 1 && !parts[1].isBlank() ? parts[1] : defaultTime.toString();

                    return LocalDateTime.parse(datePart + "T" + timePart);
                } else {
                    // 날짜만 있는 경우
                    return LocalDateTime.of(LocalDate.parse(raw), defaultTime);
                }
            } catch (Exception ex) {
                // 파싱 실패 시 기본값으로
                return LocalDateTime.of(LocalDate.now(), defaultTime);
            }
        }
    }
}