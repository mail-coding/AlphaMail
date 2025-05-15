package com.alphamail.api.assistants.domain.repository;


import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrder;

import java.util.Optional;

public interface TemporaryPurchaseOrderRepository {

    TemporaryPurchaseOrder save(TemporaryPurchaseOrder temporaryPurchaseOrder);

    Optional<TemporaryPurchaseOrder> findByIdAndUserId(Integer temporaryPurchaseOrderId, Integer userId);

    void deleteById(Integer orderId);
}
