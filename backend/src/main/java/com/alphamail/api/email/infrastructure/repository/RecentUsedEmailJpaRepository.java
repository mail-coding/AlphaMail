package com.alphamail.api.email.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alphamail.api.email.infrastructure.entity.RecentUsedEmailEntity;

public interface RecentUsedEmailJpaRepository extends JpaRepository<RecentUsedEmailEntity, Integer> {

	List<RecentUsedEmailEntity> findTop10ByUser_UserIdOrderByLastUpdatedTimeDesc(Integer userId);
	Optional<RecentUsedEmailEntity> findByUser_UserIdAndRecentEmail(Integer userId, String email);
}
