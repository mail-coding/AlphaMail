package com.alphamail.api.assistants.presentation.dto.purchaseorders;

import java.time.LocalDateTime;
import java.util.List;


public record RegisterTemporaryPurchaseOrderRequest(
        Integer id,
        Integer companyId,
        Integer clientId,
        LocalDateTime deliverAt,
        String shippingAddress,
        String manager,
        String managerNumber,
        String paymentTerm,
        List<RegisterTemporaryPurchaseOrderProductRequest> products
) {
}
