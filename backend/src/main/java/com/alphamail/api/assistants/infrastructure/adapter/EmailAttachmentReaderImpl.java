package com.alphamail.api.assistants.infrastructure.adapter;

import com.alphamail.api.assistants.domain.service.EmailAttachmentReader;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.email.domain.repository.EmailAttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmailAttachmentReaderImpl implements EmailAttachmentReader {

    private final EmailAttachmentRepository emailAttachmentRepository;

    @Override
    public List<EmailAttachment> findAllByEmailId(Integer emailId) {
        return emailAttachmentRepository.findAllByEmailId(emailId);
    }
}
