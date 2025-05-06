package com.alphamail.api.schedule.infrastructure.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.alphamail.api.schedule.domain.entity.Schedule;
import com.alphamail.api.schedule.domain.repository.ScheduleRepository;
import com.alphamail.api.schedule.infrastructure.entity.ScheduleEntity;
import com.alphamail.api.schedule.infrastructure.mapping.ScheduleMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepository {

	private final ScheduleJpaRepository jpaRepository;
	private final ScheduleMapper scheduleMapper;


	@Override
	public Schedule save(Schedule schedule) {
		ScheduleEntity entity = scheduleMapper.toEntity(schedule);
		return scheduleMapper.toDomain(jpaRepository.save(entity));
	}


	@Override
	public void deleteById(Integer scheduleId) {
		jpaRepository.deleteById(scheduleId);
	}

	@Override
	public Optional<Schedule> findByIdAndUserId(Integer scheduleId, Integer userId) {
		return jpaRepository.findByIdAndUserUserId(scheduleId, userId)
			.map(scheduleMapper::toDomain);
	}

	@Override
	public Page<Schedule> findByPeriodAndKeyword(LocalDate startDate, LocalDate endDate, String keyword, Integer userId,
		Pageable pageable) {
		return jpaRepository.findByPeriodAndKeyword(startDate, endDate, keyword, userId, pageable)
			.map(scheduleMapper::toDomain);
	}

	@Override
	public Page<Schedule> findByPeriod(LocalDate startDate, LocalDate endDate, Integer userId, Pageable pageable) {
		return jpaRepository.findByPeriod(startDate, endDate, userId, pageable)
			.map(scheduleMapper::toDomain);
	}

}
