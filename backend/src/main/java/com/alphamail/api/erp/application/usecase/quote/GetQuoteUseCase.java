package com.alphamail.api.erp.application.usecase.quote;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.erp.domain.entity.Quote;
import com.alphamail.api.erp.domain.repository.QuoteRepository;
import com.alphamail.api.erp.presentation.dto.quote.GetQuoteResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class GetQuoteUseCase {

	private final QuoteRepository quoteRepository;

	public GetQuoteResponse execute(Integer quoteId) {
		Optional<Quote> quote = quoteRepository.findById(quoteId);

		return quote.map(GetQuoteResponse::from).orElse(null);
	}
}
