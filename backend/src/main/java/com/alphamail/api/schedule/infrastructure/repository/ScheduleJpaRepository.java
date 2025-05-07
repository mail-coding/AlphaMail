package com.alphamail.api.schedule.infrastructure.repository;


import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.alphamail.api.schedule.infrastructure.entity.ScheduleEntity;

public interface ScheduleJpaRepository extends JpaRepository<ScheduleEntity, Integer> {

	Optional<ScheduleEntity> findByIdAndUserUserId(Integer scheduleId, Integer userId);

	@Query("SELECT s FROM ScheduleEntity s WHERE s.user.userId = :userId "
		+ "AND NOT (DATE(s.endTime) < :startDate OR DATE(s.startTime) > :endDate) "
		+ "AND s.name LIKE %:keyword%")
	Page<ScheduleEntity> findByPeriodAndKeyword(@Param("startDate") LocalDate startDate,
												@Param("endDate") LocalDate endDate,
												@Param("keyword") String keyword,
												@Param("userId") Integer userId, Pageable pageable);

	@Query("SELECT s FROM ScheduleEntity s WHERE s.user.userId = :userId "
		+ "AND NOT (DATE(s.endTime) < :startDate OR DATE(s.startTime) > :endDate)")
	Page<ScheduleEntity> findByPeriod(@Param("startDate") LocalDate startDate,
									@Param("endDate") LocalDate endDate,
									@Param("userId") Integer userId, Pageable pageable);

	@Query("SELECT s FROM ScheduleEntity s WHERE s.user.userId = :userId "
		+ "AND s.name LIKE %:keyword%")
	Page<ScheduleEntity> findByKeyword(@Param("keyword")String keyword,
									@Param("userId")Integer userId, Pageable pageable);
}
