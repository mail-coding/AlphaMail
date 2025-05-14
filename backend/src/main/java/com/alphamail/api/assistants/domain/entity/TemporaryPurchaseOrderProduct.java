package com.alphamail.api.assistants.domain.entity;

import com.alphamail.api.erp.domain.entity.Product;
import lombok.Builder;

@Builder
public record TemporaryPurchaseOrderProduct(
    Integer id,
    Product product,
    String productName,
    Integer count

) {

}
