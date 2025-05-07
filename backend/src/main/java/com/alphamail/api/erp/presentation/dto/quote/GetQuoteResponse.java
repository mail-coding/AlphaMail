package com.alphamail.api.erp.presentation.dto.quote;

import java.time.LocalDateTime;
import java.util.List;

import com.alphamail.api.erp.domain.entity.Quote;

public record GetQuoteResponse(
	Integer id,
	Integer userId,
	String userName,
	Integer groupId,
	String groupName,
	Integer clientId,
	String clientName,
	String quoteNo,
	LocalDateTime createdAt,
	LocalDateTime updatedAt,
	LocalDateTime deletedAt,
	List<QuoteProductDto> products
) {
	public static GetQuoteResponse from(Quote quote) {
		return new GetQuoteResponse(
			quote.getQuoteId(),
			quote.getUser().getId().getValue(),
			quote.getUser().getName(),
			quote.getGroup().getGroupId(),
			quote.getGroup().getName(),
			quote.getClient().getClientId(),
			quote.getClient().getCorpName(),
			quote.getQuoteNo(),
			quote.getCreatedAt(),
			quote.getUpdatedAt(),
			quote.getDeletedAt(),
			quote.getQuoteProducts().stream()
				.map(QuoteProductDto::from)
				.toList()
		);
	}
}
