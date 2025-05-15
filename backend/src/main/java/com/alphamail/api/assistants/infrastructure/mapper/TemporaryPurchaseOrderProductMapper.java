package com.alphamail.api.assistants.infrastructure.mapper;

import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrderProduct;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryPurchaseOrderProductEntity;
import com.alphamail.api.erp.infrastructure.mapping.ProductMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface TemporaryPurchaseOrderProductMapper {

    @Mapping(source = "product", target = "productEntity")
    TemporaryPurchaseOrderProductEntity toEntity(TemporaryPurchaseOrderProduct product);

    @Mapping(source = "productEntity", target = "product")
    TemporaryPurchaseOrderProduct toDomain(TemporaryPurchaseOrderProductEntity entity);
}
