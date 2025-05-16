package com.alphamail.api.assistants.infrastructure.repository.assistant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.alphamail.api.assistants.domain.entity.TemporaryItem;
import com.alphamail.api.assistants.domain.repository.TemporaryItemRepository;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryItemEntity;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TemporaryItemRepositoryImpl implements TemporaryItemRepository {

	private final TemporaryItemViewRepository viewRepository;

	@Override
	public Page<TemporaryItem> findAllByUserId(Integer userId, Pageable pageable) {
		Page<TemporaryItemEntity> entities = viewRepository.findAllByUserId(userId, pageable);

		// Entity -> Domain 객체 변환
		return entities.map(entity -> TemporaryItem.builder()
			.id(entity.getId())
			.type(entity.getType())
			.emailTime(entity.getEmailTime())
			.title(entity.getTitle())
			.userId(entity.getUserId())
			.emailId(entity.getEmailId())
			.build());
	}
}