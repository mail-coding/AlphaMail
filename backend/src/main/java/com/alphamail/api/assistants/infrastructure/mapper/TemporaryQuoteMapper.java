package com.alphamail.api.assistants.infrastructure.mapper;


import com.alphamail.api.assistants.domain.entity.TemporaryQuote;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryQuoteEntity;
import com.alphamail.api.email.infrastructure.mapper.EmailMapper;
import com.alphamail.api.erp.infrastructure.mapping.ClientMapper;
import com.alphamail.api.user.infrastructure.mapping.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                EmailMapper.class,
                TemporaryQuoteProductMapper.class,
                UserMapper.class,
                ClientMapper.class
        }
)
public interface TemporaryQuoteMapper {

    @Mapping(source = "temporaryQuoteProducts", target = "temporaryQuoteProductEntities")
    @Mapping(source = "email", target = "emailEntity")
    @Mapping(source = "client", target = "clientEntity")
    TemporaryQuoteEntity toEntity(TemporaryQuote domain);

    @Mapping(source = "emailEntity", target = "email")
    @Mapping(source = "temporaryQuoteProductEntities", target = "temporaryQuoteProducts")
    @Mapping(source = "clientEntity", target = "client")
    TemporaryQuote toDomain(TemporaryQuoteEntity entity);

}
