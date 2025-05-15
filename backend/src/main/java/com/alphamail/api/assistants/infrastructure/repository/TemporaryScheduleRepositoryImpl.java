package com.alphamail.api.assistants.infrastructure.repository;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;
import com.alphamail.api.assistants.domain.repository.TemporaryScheduleRepository;
import com.alphamail.api.assistants.infrastructure.entity.TemporaryScheduleEntity;
import com.alphamail.api.assistants.infrastructure.mapper.TemporaryScheduleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TemporaryScheduleRepositoryImpl implements TemporaryScheduleRepository {

    private final TemporaryScheduleJpaRepository jpaRepository;
    private final TemporaryScheduleMapper temporaryScheduleMapper;

    @Override
    public TemporarySchedule save(TemporarySchedule schedule) {
        TemporaryScheduleEntity entity = temporaryScheduleMapper.toEntity(schedule);
        return temporaryScheduleMapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public void deleteById(Integer id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Optional<TemporarySchedule> findByIdAndUserId(Integer scheduleId, Integer userId) {
        return jpaRepository.findByIdAndUserUserId(scheduleId, userId)
                .map(temporaryScheduleMapper::toDomain);
    }


}

