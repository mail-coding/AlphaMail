package com.alphamail.api.assistants.application.usecase.quote;

import com.alphamail.api.assistants.domain.entity.TemporaryQuote;
import com.alphamail.api.assistants.domain.repository.TemporaryQuoteRepository;
import com.alphamail.api.assistants.domain.service.EmailReader;
import com.alphamail.api.assistants.presentation.dto.quote.CreateTemporaryQuoteRequest;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.erp.domain.service.UserReader;
import com.alphamail.api.user.domain.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class CreateTemporaryQuoteUseCase {
    private final TemporaryQuoteRepository temporaryQuoteRepository;
    private final UserReader userReader;
    private final EmailReader emailReader;

    public void execute(CreateTemporaryQuoteRequest createTemporaryQuoteRequest) {

        String userEmail = createTemporaryQuoteRequest.userEmail();
        User user = userReader.findByEmail(userEmail);
        Email email = emailReader.findByIdAndUserId(createTemporaryQuoteRequest.emailId(), user.getId().getValue());

        temporaryQuoteRepository.save(TemporaryQuote.create(createTemporaryQuoteRequest, user, email));

    }


}
