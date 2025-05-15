package com.alphamail.api.assistants.presentation.dto.quote;

import java.util.List;

public record UpdateTemporaryQuoteRequest(
        Integer id,
        String clientName,
        Integer clientId,
        String shippingAddress,
        Boolean hasShippingAddress,
        String manager,
        String managerNumber,
        List<UpdateTemporaryQuoteProductRequest> products
) {
}
