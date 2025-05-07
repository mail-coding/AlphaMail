package com.alphamail.api.erp.domain.repository;

import java.util.Optional;

import com.alphamail.api.erp.domain.entity.Quote;

public interface QuoteRepository {

	Optional<Quote> findById(Integer quoteId);

	Quote save(Quote quote);
}
