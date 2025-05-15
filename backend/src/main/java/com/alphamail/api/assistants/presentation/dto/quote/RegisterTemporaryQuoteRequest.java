package com.alphamail.api.assistants.presentation.dto.quote;

import java.util.List;

public record RegisterTemporaryQuoteRequest(
        Integer id,
        Integer companyId,
        Integer clientId,
        String shippingAddress,
        String manager,
        String managerNumber,
        List<RegisterTemporaryQuoteProductRequest> products
) {
}
