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
		System.out.println("userId: " + userId);

		Page<TemporaryItem> results = temporaryItemRepository.findAllByUserId(userId, pageable);

		System.out.println("=== TemporaryItem Page Info ===");
		System.out.println("totalElements: " + results.getTotalElements());
		System.out.println("totalPages: " + results.getTotalPages());
		System.out.println("currentPage: " + results.getPageable().getPageNumber());
		System.out.println("pageSize: " + results.getPageable().getPageSize());
		System.out.println("numberOfElements: " + results.getNumberOfElements());
		System.out.println("hasNext: " + results.hasNext());
		System.out.println("hasPrevious: " + results.hasPrevious());
		System.out.println("isFirst: " + results.isFirst());
		System.out.println("isLast: " + results.isLast());

		System.out.println("=== TemporaryItem List ===");
		for (TemporaryItem item : results.getContent()) {
			System.out.println("id: " + item.getId() +
				", type: " + item.getType() +
				", title: " + item.getTitle() +
				", emailTime: " + item.getEmailTime());
		}

		return new GetPageResponse<>(
			results.getContent(),
			results.getTotalElements(),
			results.getTotalPages(),
			results.getPageable().getPageNumber()
		);
	}
}
