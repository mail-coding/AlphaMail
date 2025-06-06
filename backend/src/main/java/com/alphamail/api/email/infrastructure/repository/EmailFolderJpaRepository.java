package com.alphamail.api.email.infrastructure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alphamail.api.email.infrastructure.entity.EmailFolderEntity;

public interface EmailFolderJpaRepository extends JpaRepository<EmailFolderEntity, Integer> {
	EmailFolderEntity findByUser_UserIdAndName(Integer userId, String name);

	List<EmailFolderEntity> findAllByUser_UserId(Integer userId);
}
