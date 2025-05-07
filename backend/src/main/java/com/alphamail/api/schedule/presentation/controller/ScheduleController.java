package com.alphamail.api.schedule.presentation.controller;

import java.time.LocalDate;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.schedule.application.usecase.ChangeToggleUseCase;
import com.alphamail.api.schedule.application.usecase.CreateScheduleUseCase;
import com.alphamail.api.schedule.application.usecase.DeleteScheduleUseCase;
import com.alphamail.api.schedule.application.usecase.GetAllSchedulesUseCase;
import com.alphamail.api.schedule.application.usecase.GetScheduleDetailUseCase;
import com.alphamail.api.schedule.application.usecase.UpdateScheduleUseCase;
import com.alphamail.api.schedule.presentation.dto.ChangeScheduleToggleRequest;
import com.alphamail.api.schedule.presentation.dto.CreateScheduleRequest;
import com.alphamail.api.schedule.presentation.dto.ScheduleDetailResponse;
import com.alphamail.api.schedule.presentation.dto.ScheduleListResponse;
import com.alphamail.api.schedule.presentation.dto.ToggleScheduleResponse;
import com.alphamail.api.schedule.presentation.dto.UpdateScheduleRequest;
import com.alphamail.api.schedule.presentation.dto.UpdateScheduleResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

	private final CreateScheduleUseCase createScheduleUseCase;
	private final ChangeToggleUseCase changeToggleUseCase;
	private final UpdateScheduleUseCase updateScheduleUseCase;
	private final DeleteScheduleUseCase deleteScheduleUseCase;
	private final GetScheduleDetailUseCase getScheduleDetailUseCase;
	private final GetAllSchedulesUseCase getAllSchedulesUseCase;

	@PostMapping
	public ResponseEntity<?> addSchedule(@RequestBody CreateScheduleRequest request,
		@AuthenticationPrincipal UserDetails userDetails) {

		//임시 아이디 1
		Integer userId = 1;

		createScheduleUseCase.execute(request, userId);

		return ResponseEntity.ok().build();

	}

	@GetMapping
	public ResponseEntity<ScheduleListResponse> getAllSchedules(
		@RequestParam(required = false) LocalDate startDate,
		@RequestParam(required = false) LocalDate endDate,
		@RequestParam(required = false) String keyword,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "0") int sort,
		@AuthenticationPrincipal UserDetails userDetails) {

		Sort.Direction direction = (sort == 0) ? Sort.Direction.DESC : Sort.Direction.ASC;

		Sort sorting = Sort.by(direction, "startTime");

		// Pageable 객체 생성 (정렬 정보 포함)
		Pageable pageable = PageRequest.of(page, size, sorting);

		//임시 아이디 1
		Integer userId = 1;

		ScheduleListResponse schedules = getAllSchedulesUseCase.execute(startDate,
			endDate, keyword, pageable, userId);

		return ResponseEntity.ok(schedules);

	}

	@GetMapping("/{scheduleId}")
	public ResponseEntity<ScheduleDetailResponse> getScheduleDetail(@PathVariable Integer scheduleId,
		@AuthenticationPrincipal UserDetails userDetails) {

		//임시 아이디 1
		Integer userId = 1;

		ScheduleDetailResponse response = getScheduleDetailUseCase.execute(scheduleId, userId);

		return ResponseEntity.ok().body(response);

	}


	@PatchMapping("/{scheduleId}/toggles")
	public ResponseEntity<ToggleScheduleResponse> toggleSchedule(@PathVariable Integer scheduleId,
		@RequestBody ChangeScheduleToggleRequest request,
		@AuthenticationPrincipal UserDetails userDetails) {

		//임시 아이디 1
		Integer userId = 1;

		ToggleScheduleResponse response = changeToggleUseCase.execute(scheduleId, request, userId);

		return ResponseEntity.ok().body(response);

	}

	@PutMapping("/{scheduleId}")
	public ResponseEntity<UpdateScheduleResponse> updateSchedule(@PathVariable Integer scheduleId,
		@RequestBody UpdateScheduleRequest request,
		@AuthenticationPrincipal UserDetails userDetails) {

		//임시 아이디 1
		Integer userId = 1;

		UpdateScheduleResponse updatedResponse = updateScheduleUseCase.execute(scheduleId, request, userId);

		return ResponseEntity.ok().body(updatedResponse);
	}

	@DeleteMapping("/{scheduleId}")
	public ResponseEntity<Void> deleteSchedule(@PathVariable Integer scheduleId,
		@AuthenticationPrincipal UserDetails userDetails) {

		//임시 아이디 1
		Integer userId = 1;

		deleteScheduleUseCase.execute(scheduleId, userId);

		return ResponseEntity.noContent().build();

	}

}
