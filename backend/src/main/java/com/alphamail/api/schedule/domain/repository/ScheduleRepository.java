package com.alphamail.api.schedule.domain.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.alphamail.api.schedule.domain.entity.Schedule;

@Repository
public interface ScheduleRepository {
	Schedule save(Schedule schedule);

	void deleteById(Integer scheduleId);

	Optional<Schedule> findByIdAndUserId(Integer scheduleId, Integer userId);

	Page<Schedule> findByPeriodAndKeyword(LocalDate startDate, LocalDate endDate,
		String keyword, Integer userId, Pageable pageable);

	Page<Schedule> findByPeriod(LocalDate startDate, LocalDate endDate, Integer userId,
		Pageable pageable);

	Page<Schedule> findByKeyword(String keyword, Integer userId, Pageable effectivePageable);
}
