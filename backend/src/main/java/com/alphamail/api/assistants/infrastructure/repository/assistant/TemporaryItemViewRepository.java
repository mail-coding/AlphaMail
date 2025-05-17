package com.alphamail.api.assistants.infrastructure.repository.assistant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alphamail.api.assistants.infrastructure.entity.TemporaryItemEntity;

@Repository
public interface TemporaryItemViewRepository extends JpaRepository<TemporaryItemEntity, Integer> {
	Page<TemporaryItemEntity> findAllByUserId(Integer userId, Pageable pageable);
}