package com.alphamail.api.assistants.application.usecase.assistant;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.alphamail.api.assistants.domain.entity.TemporaryItem;
import com.alphamail.api.assistants.domain.repository.TemporaryItemRepository;
import com.alphamail.api.global.dto.GetPageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAIAssistantUseCase {

	private final TemporaryItemRepository temporaryItemRepository;

	public GetPageResponse<TemporaryItem> execute(Integer userId, Pageable pageable) {
		Page<TemporaryItem> results = temporaryItemRepository.findAllByUserId(userId, pageable);

		return new GetPageResponse<>(
			results.getContent(),
			results.getTotalElements(),
			results.getTotalPages(),
			results.getPageable().getPageNumber()
		);
	}
}
