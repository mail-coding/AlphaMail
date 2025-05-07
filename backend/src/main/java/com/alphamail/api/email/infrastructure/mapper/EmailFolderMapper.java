package com.alphamail.api.email.infrastructure.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.alphamail.api.email.domain.entity.EmailFolder;
import com.alphamail.api.email.infrastructure.entity.EmailFolderEntity;
import com.alphamail.common.mapper.EntityReferenceFinder;

@Mapper(componentModel = "spring", uses = {EntityReferenceFinder.class})
public interface EmailFolderMapper {

	@Mapping(source = "name", target = "emailFolderName")
	@Mapping(source = "user.userId", target = "userId")
	EmailFolder toDomain(EmailFolderEntity folderEntity);

	@Mapping(source = "emailFolderName", target = "name")
	@Mapping(source = "userId", target = "user", qualifiedByName = "toUserEntity")
	EmailFolderEntity toEntity(EmailFolder emailFolder);
}
