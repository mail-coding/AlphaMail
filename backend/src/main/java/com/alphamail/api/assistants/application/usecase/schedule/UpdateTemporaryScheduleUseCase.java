package com.alphamail.api.assistants.application.usecase.schedule;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.assistants.domain.repository.TemporaryScheduleRepository;
import com.alphamail.api.assistants.domain.service.EmailAttachmentReader;
import com.alphamail.api.assistants.presentation.dto.schedule.TemporaryScheduleResponse;
import com.alphamail.api.assistants.presentation.dto.schedule.UpdateTemporaryScheduleRequest;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class UpdateTemporaryScheduleUseCase {

    private final TemporaryScheduleRepository temporaryScheduleRepository;
    private final EmailAttachmentReader emailAttachmentReader;

    public TemporaryScheduleResponse execute(Integer temporaryScheduleId, UpdateTemporaryScheduleRequest updateTemporaryScheduleRequest, Integer userId) {

        TemporarySchedule temporarySchedule = temporaryScheduleRepository.findByIdAndUserId(temporaryScheduleId,userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        TemporarySchedule updateTemporarySchedule = temporarySchedule.update(updateTemporaryScheduleRequest);
        List<EmailAttachment> emailAttachment = emailAttachmentReader.findAllByEmailId(updateTemporarySchedule.getEmail().getEmailId());
        return TemporaryScheduleResponse.from(temporaryScheduleRepository.save(updateTemporarySchedule),emailAttachment);
    }
}
