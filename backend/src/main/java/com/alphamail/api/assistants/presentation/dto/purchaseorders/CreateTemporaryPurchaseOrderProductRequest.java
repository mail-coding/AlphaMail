package com.alphamail.api.assistants.presentation.dto.purchaseorders;

public record CreateTemporaryPurchaseOrderProductRequest(
        String productName,
        Integer count
) {
}
