package com.alphamail.api.assistants.infrastructure.repository;

import com.alphamail.api.assistants.domain.entity.TemporaryQuote;
import com.alphamail.api.assistants.domain.repository.TemporaryQuoteRepository;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryQuoteEntity;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryQuoteProductEntity;
import com.alphamail.api.assistants.infrastructure.mapper.TemporaryQuoteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TemporaryQuoteRepositoryImpl implements TemporaryQuoteRepository {

    private final TemporaryQuoteMapper temporaryQuoteMapper;
    private final TemporaryQuoteJpaRepository temporaryQuoteJpaRepository;

    @Override
    public TemporaryQuote save(TemporaryQuote temporaryQuote) {
        TemporaryQuoteEntity temporaryQuoteEntity = temporaryQuoteMapper.toEntity(temporaryQuote);


        for (TemporaryQuoteProductEntity productEntity : temporaryQuoteEntity.getTemporaryQuoteProductEntities()) {
            productEntity.setTemporaryQuoteEntities(temporaryQuoteEntity);
        }

        return temporaryQuoteMapper.toDomain(temporaryQuoteJpaRepository.save(temporaryQuoteEntity));
    }

    @Override
    public Optional<TemporaryQuote> findByIdAndUserId(Integer temporaryQuoteId, Integer userId) {
        return temporaryQuoteJpaRepository.findByIdAndUserUserId(temporaryQuoteId, userId)
                .map(temporaryQuoteMapper::toDomain);
    }

    @Override
    public void deleteById(Integer temporaryQuoteId) {
        temporaryQuoteJpaRepository.deleteById(temporaryQuoteId);
    }
}
