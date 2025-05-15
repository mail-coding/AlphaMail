package com.alphamail.api.assistants.infrastructure.mapper;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryScheduleEntity;
import com.alphamail.api.email.infrastructure.mapper.EmailMapper;
import com.alphamail.common.mapper.EntityReferenceFinder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {
        EntityReferenceFinder.class,
        EmailMapper.class})
public interface TemporaryScheduleMapper {

    @Mapping(source = "id", target = "temporaryScheduleId")
    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "emailEntity", target = "email")
    TemporarySchedule toDomain(TemporaryScheduleEntity entity);

    @Mapping(source = "temporaryScheduleId", target = "id")
    @Mapping(source = "userId", target = "user", qualifiedByName = "toUserEntity")
    @Mapping(source = "email", target = "emailEntity")
    TemporaryScheduleEntity toEntity(TemporarySchedule domain);
}
