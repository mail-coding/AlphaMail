package com.alphamail.api.user.infrastructure.mapping;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.alphamail.common.mapper.EntityReferenceFinder;
import com.alphamail.api.user.domain.entity.User;
import com.alphamail.api.user.domain.valueobject.UserId;
import com.alphamail.api.user.infrastructure.entity.UserEntity;

@Mapper(componentModel = "spring", uses = {EntityReferenceFinder.class})
public interface UserMapper {

	@Mapping(source = "userId", target = "id", qualifiedByName = "integerToUserId")
	@Mapping(source = "group.id", target = "groupId")
	User toDomain(UserEntity userEntity);

	@Mapping(source = "id", target = "userId", qualifiedByName = "userIdToInteger")
	@Mapping(source = "groupId", target = "group", qualifiedByName = "toGroupEntity")
	UserEntity toEntity(User user);

	@Named("integerToUserId")
	default UserId integerToUserId(Integer userId) {
		return userId != null ? new UserId(userId) : null;
	}

	@Named("userIdToInteger")
	default Integer userIdToInteger(UserId userId) {
		return userId != null ? userId.getValue() : null;
	}

}
