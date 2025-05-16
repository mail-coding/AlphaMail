package com.alphamail.api.assistants.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.alphamail.api.assistants.domain.entity.TemporaryItem;

@Repository
public interface TemporaryItemRepository {
	Page<TemporaryItem> findAllByUserId(Integer userId, Pageable pageable);
}