package com.alphamail.api.assistants.domain.repository;

import com.alphamail.api.assistants.domain.entity.VectorDB;
import com.alphamail.api.assistants.infrastructure.dto.VectorDBDTORequest;

public interface SaveVectorDBRepository {

    VectorDBDTORequest sendEmailToAi(VectorDB vectorDB);

}
