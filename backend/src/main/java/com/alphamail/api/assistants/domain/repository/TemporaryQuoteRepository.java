package com.alphamail.api.assistants.domain.repository;

import com.alphamail.api.assistants.domain.entity.TemporaryQuote;

import java.util.Optional;

public interface TemporaryQuoteRepository {

    TemporaryQuote save(TemporaryQuote temporaryQuote);

    Optional<TemporaryQuote> findByIdAndUserId(Integer temporaryQuoteId, Integer userId);

    void deleteById(Integer temporaryQuoteId);

}
