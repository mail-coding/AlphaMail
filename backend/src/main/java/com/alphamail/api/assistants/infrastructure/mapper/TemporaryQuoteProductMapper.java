package com.alphamail.api.assistants.infrastructure.mapper;

import com.alphamail.api.assistants.domain.entity.TemporaryQuoteProduct;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryQuoteProductEntity;
import com.alphamail.api.erp.infrastructure.mapping.ProductMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface TemporaryQuoteProductMapper {

    @Mapping(source = "product", target = "productEntity")
    TemporaryQuoteProductEntity toEntity(TemporaryQuoteProduct product);

    @Mapping(source = "productEntity", target = "product")
    TemporaryQuoteProduct toDomain(TemporaryQuoteProductEntity entity);


}
