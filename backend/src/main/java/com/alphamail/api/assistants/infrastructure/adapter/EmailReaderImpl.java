package com.alphamail.api.assistants.infrastructure.adapter;

import com.alphamail.api.assistants.domain.service.EmailReader;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.repository.EmailRepository;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailReaderImpl implements EmailReader {

    private final EmailRepository emailRepository;

    @Override
    public Email findByIdAndUserId(Integer emailId, Integer userId) {
        return emailRepository.findByIdAndUserId(emailId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));
    }
}
