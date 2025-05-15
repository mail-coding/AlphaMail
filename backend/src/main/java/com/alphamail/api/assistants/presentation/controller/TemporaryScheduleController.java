package com.alphamail.api.assistants.presentation.controller;

import com.alphamail.api.assistants.application.usecase.schedule.*;
import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.assistants.presentation.dto.schedule.CreateTemporaryScheduleRequest;
import com.alphamail.api.assistants.presentation.dto.schedule.RegisterScheduleRequest;
import com.alphamail.api.assistants.presentation.dto.schedule.TemporaryScheduleResponse;
import com.alphamail.api.assistants.presentation.dto.schedule.UpdateTemporaryScheduleRequest;
import com.alphamail.common.annotation.Auth;
import com.alphamail.common.constants.ApiPaths;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(ApiPaths.ASSISTANTS_BASE_API + ApiPaths.SCHEDULE_BASE_API)
public class TemporaryScheduleController {

    private final CreateTemporaryScheduleUseCase createTemporaryScheduleUseCase;
    private final GetTemporaryScheduleUseCase getTemporaryScheduleUseCase;
    private final UpdateTemporaryScheduleUseCase updateTemporaryScheduleUseCase;
    private final DeleteTemporaryScheduleUseCase deleteTemporaryScheduleUseCase;
    private final RegisterScheduleFromTemporaryUseCase registerScheduleFromTemporaryUseCase;

    @PostMapping
    public ResponseEntity<TemporarySchedule> addTemporarySchedule(
            @RequestBody CreateTemporaryScheduleRequest temporaryScheduleRequest) {
        return ResponseEntity.ok(createTemporaryScheduleUseCase.execute(temporaryScheduleRequest));
    }

    @GetMapping("/{temporaryScheduleId}")
    public ResponseEntity<TemporaryScheduleResponse> getTemporarySchedule(
            @PathVariable Integer temporaryScheduleId, @Auth Integer userId) {

        TemporaryScheduleResponse temporaryScheduleResponse = getTemporaryScheduleUseCase.execute(temporaryScheduleId,
                userId);

        return ResponseEntity.ok(temporaryScheduleResponse);
    }

    @PatchMapping("/{temporaryScheduleId}")
    public ResponseEntity<TemporaryScheduleResponse> updateTemporarySchedule(
            @PathVariable Integer temporaryScheduleId,
            @RequestBody UpdateTemporaryScheduleRequest updateTemporaryScheduleRequest,
            @Auth Integer userId) {

        TemporaryScheduleResponse temporaryScheduleResponse = updateTemporaryScheduleUseCase.execute(
                temporaryScheduleId,updateTemporaryScheduleRequest, userId);

        return ResponseEntity.ok(temporaryScheduleResponse);
    }

    @DeleteMapping("/{temporaryScheduleId}")
    public ResponseEntity<String> deleteTemporarySchedule(
            @PathVariable Integer temporaryScheduleId, @Auth Integer userId) {

        deleteTemporaryScheduleUseCase.execute(temporaryScheduleId, userId);

        return ResponseEntity.ok("임시 스케줄 삭제가 완료 되었습니다");
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerScheduleFromTemporary(
            @RequestBody RegisterScheduleRequest registerScheduleRequest,
            @Auth Integer userId
    ) {
        registerScheduleFromTemporaryUseCase.execute(registerScheduleRequest, userId);
        return ResponseEntity.ok("스케줄 등록이 완료 되었습니다");
    }

}
