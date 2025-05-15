package com.alphamail.api.assistants.domain.repository;

import com.alphamail.api.assistants.domain.entity.TemporarySchedule;

import java.util.Optional;

public interface TemporaryScheduleRepository {

    TemporarySchedule save(TemporarySchedule schedule);

    void deleteById(Integer id);

    Optional<TemporarySchedule> findByIdAndUserId(Integer scheduleId, Integer userId);

}