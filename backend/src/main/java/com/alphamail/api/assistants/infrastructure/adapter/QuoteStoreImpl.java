package com.alphamail.api.assistants.infrastructure.adapter;

import com.alphamail.api.assistants.domain.service.QuoteStore;
import com.alphamail.api.erp.domain.entity.Quote;
import com.alphamail.api.erp.domain.repository.QuoteRepository;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class QuoteStoreImpl implements QuoteStore {

    private final QuoteRepository quoteRepository;

    @Override
    public Quote save(Quote quote) {
        return quoteRepository.save(quote);
    }
}
