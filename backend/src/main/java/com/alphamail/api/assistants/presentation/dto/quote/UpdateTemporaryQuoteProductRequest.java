package com.alphamail.api.assistants.presentation.dto.quote;

public record UpdateTemporaryQuoteProductRequest(
        Integer id,
        Integer productId,
        String productName,
        Integer count
) {
}
