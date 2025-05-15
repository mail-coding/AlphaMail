package com.alphamail.api.assistants.infrastructure.repository;

import com.alphamail.api.assistants.infrastructure.entity.TemporaryQuoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TemporaryQuoteJpaRepository extends JpaRepository<TemporaryQuoteEntity, Integer> {

    Optional<TemporaryQuoteEntity> findByIdAndUserUserId(Integer temporaryQuoteId, Integer userId);
}
