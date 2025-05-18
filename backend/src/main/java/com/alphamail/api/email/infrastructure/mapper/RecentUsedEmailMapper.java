package com.alphamail.api.email.infrastructure.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.alphamail.api.email.domain.entity.RecentUsedEmail;
import com.alphamail.api.email.infrastructure.entity.RecentUsedEmailEntity;
import com.alphamail.common.mapper.EntityReferenceFinder;

@Mapper(componentModel = "spring", uses = {EntityReferenceFinder.class})
public interface RecentUsedEmailMapper {

	@Mapping(target = "id", source = "recentUsedEmailId")
	@Mapping(target = "userId", source = "user.userId")
	RecentUsedEmail toDomain(RecentUsedEmailEntity entity);

	@Mapping(target = "recentUsedEmailId", source = "id")
	@Mapping(target = "user", source = "userId", qualifiedByName = "toUserEntity")
	RecentUsedEmailEntity toEntity(RecentUsedEmail domain);
}
