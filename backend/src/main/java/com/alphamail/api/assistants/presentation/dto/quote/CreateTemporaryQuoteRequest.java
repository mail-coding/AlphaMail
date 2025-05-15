package com.alphamail.api.assistants.presentation.dto.quote;

import java.util.List;

public record CreateTemporaryQuoteRequest(
        String title,
        String userEmail,
        Integer emailId,
        String clientName,
        String shippingAddress,
        String manager,
        String managerNumber,
        List<CreateTemporaryQuoteProductRequest> products
) {

}
