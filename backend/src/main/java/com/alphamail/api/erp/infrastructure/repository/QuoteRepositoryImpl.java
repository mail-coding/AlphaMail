package com.alphamail.api.erp.infrastructure.repository;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.alphamail.api.erp.domain.entity.Quote;
import com.alphamail.api.erp.domain.repository.QuoteRepository;
import com.alphamail.api.erp.infrastructure.entity.QuoteEntity;
import com.alphamail.api.erp.infrastructure.mapping.QuoteMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class QuoteRepositoryImpl implements QuoteRepository {

	private final QuoteJpaRepository quoteJpaRepository;
	private final QuoteMapper quoteMapper;

	@Override
	public Optional<Quote> findById(Integer quoteId) {
		return quoteJpaRepository.findById(quoteId)
			.map(quoteMapper::toDomain);
	}

	@Override
	public Quote save(Quote quote) {
		QuoteEntity entity = quoteMapper.toEntity(quote);

		entity.setQuoteProducts(
			entity.getQuoteProducts().stream()
				.peek(product -> product.setQuoteEntity(entity))
				.collect(Collectors.toList())
		);

		QuoteEntity saved = quoteJpaRepository.save(entity);

		return quoteMapper.toDomain(saved);
	}
}
