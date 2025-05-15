package com.alphamail.api.assistants.application.usecase.quote;

import com.alphamail.api.assistants.domain.repository.TemporaryQuoteRepository;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class DeleteTemporaryQuoteUseCase {

    private final TemporaryQuoteRepository temporaryQuoteRepository;

    public void execute(Integer temporaryQuoteId, Integer userId) {

        temporaryQuoteRepository.findByIdAndUserId(temporaryQuoteId, userId)
                .orElseThrow(()->  new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        temporaryQuoteRepository.deleteById(temporaryQuoteId);

    }


}
