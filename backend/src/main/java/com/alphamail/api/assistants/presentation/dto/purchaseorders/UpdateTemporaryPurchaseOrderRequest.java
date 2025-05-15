package com.alphamail.api.assistants.presentation.dto.purchaseorders;

import java.time.LocalDateTime;
import java.util.List;

public record UpdateTemporaryPurchaseOrderRequest(
        String clientName,
        Integer clientId,
        LocalDateTime deliverAt,
        String shippingAddress,
        Boolean hasShippingAddress,
        String manager,
        String managerNumber,
        String paymentTerm,
        List<TemporaryPurchaseOrderProductRequest> products
) {
}
