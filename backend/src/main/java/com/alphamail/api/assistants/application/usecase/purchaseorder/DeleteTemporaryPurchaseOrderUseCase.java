package com.alphamail.api.assistants.application.usecase.purchaseorder;

import com.alphamail.api.assistants.domain.repository.TemporaryPurchaseOrderRepository;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class DeleteTemporaryPurchaseOrderUseCase {

    private final TemporaryPurchaseOrderRepository temporaryPurchaseOrderRepository;

    public void execute(Integer temporaryPurchaseOrderId, Integer userId) {

        temporaryPurchaseOrderRepository.findByIdAndUserId(temporaryPurchaseOrderId,userId)
                .orElseThrow(()-> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        temporaryPurchaseOrderRepository.deleteById(temporaryPurchaseOrderId);

    }


}
