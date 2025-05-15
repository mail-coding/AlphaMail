package com.alphamail.api.assistants.application.usecase.quote;

import com.alphamail.api.assistants.domain.entity.TemporaryQuote;
import com.alphamail.api.assistants.domain.repository.TemporaryQuoteRepository;
import com.alphamail.api.assistants.domain.service.EmailAttachmentReader;
import com.alphamail.api.assistants.presentation.dto.quote.TemporaryQuoteResponse;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetTemporaryQuoteUseCase {

    private final TemporaryQuoteRepository temporaryQuoteRepository;
    private final EmailAttachmentReader emailAttachmentReader;

    public TemporaryQuoteResponse execute(Integer temporaryQuoteId, Integer userId) {

        TemporaryQuote temporaryQuote = temporaryQuoteRepository.findByIdAndUserId(temporaryQuoteId, userId)
                .orElseThrow(()->  new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        List<EmailAttachment> emailAttachment = emailAttachmentReader.findAllByEmailId(temporaryQuote.getEmail().getEmailId());

        return TemporaryQuoteResponse.from(temporaryQuote, emailAttachment);

    }

}
