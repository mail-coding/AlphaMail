package com.alphamail.api.assistants.application.usecase.schedule;

import com.alphamail.api.assistants.domain.repository.TemporaryScheduleRepository;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class DeleteTemporaryScheduleUseCase {

    private final TemporaryScheduleRepository temporaryScheduleRepository;

    public void execute(Integer temporaryScheduleId, Integer userId) {
        temporaryScheduleRepository.findByIdAndUserId(temporaryScheduleId,userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        temporaryScheduleRepository.deleteById(temporaryScheduleId);
    }
}
