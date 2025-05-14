package com.alphamail.api.assistants.presentation.dto.purchaseorders;

import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrder;
import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrderProduct;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.erp.domain.entity.Client;

import java.time.LocalDateTime;
import java.util.List;

public record TemporaryPurchaseOrderResponse(
        Integer id,
        String userName,
        String title,
        Email email,
        List<EmailAttachment> emailAttachments,
        String clientName,
        Client client,
        LocalDateTime deliverAt,
        LocalDateTime createdAt,
        String shippingAddress,
        Boolean hasShippingAddress,
        String manager,
        String managerNumber,
        String paymentTerm,
        List<TemporaryPurchaseOrderProduct> products
) {
    public static TemporaryPurchaseOrderResponse from(TemporaryPurchaseOrder temporaryPurchaseOrder,List<EmailAttachment> newEmailAttachments) {
        return new TemporaryPurchaseOrderResponse(
                temporaryPurchaseOrder.getId(),
                temporaryPurchaseOrder.getUser().getName(),
                temporaryPurchaseOrder.getTitle(),
                temporaryPurchaseOrder.getEmail(),
                newEmailAttachments,
                temporaryPurchaseOrder.getClientName(),
                temporaryPurchaseOrder.getClient(),
                temporaryPurchaseOrder.getDeliverAt(),
                temporaryPurchaseOrder.getCreatedAt(),
                temporaryPurchaseOrder.getShippingAddress(),
                temporaryPurchaseOrder.getHasShippingAddress(),
                temporaryPurchaseOrder.getManager(),
                temporaryPurchaseOrder.getManagerNumber(),
                temporaryPurchaseOrder.getPaymentTerm(),
                temporaryPurchaseOrder.getTemporaryPurchaseOrderProduct()
        );
    }
}
