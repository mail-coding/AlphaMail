package com.alphamail.api.email.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.alphamail.api.email.domain.entity.RecentUsedEmail;
import com.alphamail.api.email.domain.repository.RecentUsedEmailRepository;
import com.alphamail.api.email.infrastructure.entity.RecentUsedEmailEntity;
import com.alphamail.api.email.infrastructure.mapper.RecentUsedEmailMapper;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RecentUsedEmailRepositoryImpl implements RecentUsedEmailRepository {
	private final RecentUsedEmailJpaRepository recentUsedEmailJpaRepository;
	private final RecentUsedEmailMapper recentUsedEmailMapper;

	@Override
	public List<RecentUsedEmail> findTop10ByUserId(Integer userId) {
		List<RecentUsedEmailEntity> entities =
			recentUsedEmailJpaRepository.findTop10ByUser_UserIdOrderByLastUpdatedTimeDesc(userId);
		return entities.stream()
			.map(recentUsedEmailMapper::toDomain)
			.collect(Collectors.toList());
	}

	@Override
	public Optional<RecentUsedEmail> findByUserIdAndRecentEmail(Integer userId, String email) {
		return recentUsedEmailJpaRepository.findByUser_UserIdAndRecentEmail(userId, email)
			.map(recentUsedEmailMapper::toDomain);
	}

	@Override
	public RecentUsedEmail save(RecentUsedEmail recentUsedEmail) {
		RecentUsedEmailEntity entity = recentUsedEmailMapper.toEntity(recentUsedEmail);
		RecentUsedEmailEntity savedEntity = recentUsedEmailJpaRepository.save(entity);
		return recentUsedEmailMapper.toDomain(savedEntity);
	}
}
