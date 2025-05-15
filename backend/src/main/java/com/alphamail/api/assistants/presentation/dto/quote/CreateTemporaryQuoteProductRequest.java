package com.alphamail.api.assistants.presentation.dto.quote;

public record CreateTemporaryQuoteProductRequest(
        String productName,
        Integer count
) {
}
