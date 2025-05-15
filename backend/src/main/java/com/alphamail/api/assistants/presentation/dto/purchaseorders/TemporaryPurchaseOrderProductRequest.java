package com.alphamail.api.assistants.presentation.dto.purchaseorders;

public record TemporaryPurchaseOrderProductRequest(
        Integer id,
        Integer productId,
        String productName,
        Integer count
) {
}
