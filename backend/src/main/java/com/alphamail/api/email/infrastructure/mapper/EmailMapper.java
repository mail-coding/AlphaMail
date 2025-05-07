package com.alphamail.api.email.infrastructure.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.infrastructure.entity.EmailEntity;
import com.alphamail.common.mapper.EntityReferenceFinder;

@Mapper(componentModel = "spring", uses = {EntityReferenceFinder.class})
public interface EmailMapper {

	@Mapping(target = "folderId", source = "folder.emailFolderId")
	@Mapping(target = "userId", source = "user.userId")
	Email toDomain(EmailEntity emailEntity);

	@Mapping(target = "folder", source = "folderId", qualifiedByName = "toFolderEntity")
	@Mapping(target = "user", source = "userId", qualifiedByName = "toUserEntity")
	EmailEntity toEntity(Email email);

}
