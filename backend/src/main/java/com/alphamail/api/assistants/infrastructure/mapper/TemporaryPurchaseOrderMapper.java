package com.alphamail.api.assistants.infrastructure.mapper;

import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrder;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryPurchaseOrderEntity;
import com.alphamail.api.email.infrastructure.mapper.EmailMapper;
import com.alphamail.api.erp.infrastructure.mapping.ClientMapper;
import com.alphamail.api.user.infrastructure.mapping.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                EmailMapper.class,
                TemporaryPurchaseOrderProductMapper.class,
                UserMapper.class,
                ClientMapper.class
        }
)
public interface TemporaryPurchaseOrderMapper {

    @Mapping(source = "temporaryPurchaseOrderProduct", target = "temporaryPurchaseOrderProductEntity")
    @Mapping(source = "email", target = "emailEntity")
    @Mapping(source = "client", target = "clientEntity")
    TemporaryPurchaseOrderEntity toEntity(TemporaryPurchaseOrder domain);

    @Mapping(source = "emailEntity", target = "email")
    @Mapping(source = "temporaryPurchaseOrderProductEntity", target = "temporaryPurchaseOrderProduct")
    @Mapping(source = "clientEntity", target = "client")
    TemporaryPurchaseOrder toDomain(TemporaryPurchaseOrderEntity entity);

}


