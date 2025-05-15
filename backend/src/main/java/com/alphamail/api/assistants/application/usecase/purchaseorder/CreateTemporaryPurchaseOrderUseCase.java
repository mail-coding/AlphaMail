package com.alphamail.api.assistants.application.usecase.purchaseorder;

import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrder;
import com.alphamail.api.assistants.domain.repository.TemporaryPurchaseOrderRepository;
import com.alphamail.api.assistants.domain.service.EmailReader;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.CreateTemporaryPurchaseOrderRequest;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.erp.domain.service.UserReader;
import com.alphamail.api.user.domain.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Transactional
@Service
@RequiredArgsConstructor
public class CreateTemporaryPurchaseOrderUseCase {


    private final TemporaryPurchaseOrderRepository temporaryPurchaseOrderRepository;
    private final UserReader userReader;
    private final EmailReader emailReader;


    public void execute(CreateTemporaryPurchaseOrderRequest temporaryPurchaseOrderRequest) {

        String recipientEmail  = temporaryPurchaseOrderRequest.userEmail();

        User user = userReader.findByEmail(recipientEmail);

        Email email = emailReader.findByIdAndUserId(temporaryPurchaseOrderRequest.emailId(), user.getId().getValue());

        temporaryPurchaseOrderRepository.save(TemporaryPurchaseOrder.create(temporaryPurchaseOrderRequest,user,email));

    }

}
