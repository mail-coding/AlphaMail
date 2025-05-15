package com.alphamail.api.assistants.presentation.dto.purchaseorders;

import java.time.LocalDateTime;
import java.util.List;

public record CreateTemporaryPurchaseOrderRequest(
        String title,
        String userEmail,
        Integer emailId,
        String clientName,
        LocalDateTime deliverAt,
        String shippingAddress,
        String manager,
        String managerNumber,
        String paymentTerm,
        List<CreateTemporaryPurchaseOrderProductRequest> products
) {
}
