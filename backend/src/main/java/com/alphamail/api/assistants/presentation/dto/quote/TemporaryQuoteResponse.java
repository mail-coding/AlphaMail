package com.alphamail.api.assistants.presentation.dto.quote;

import com.alphamail.api.assistants.domain.entity.TemporaryQuote;
import com.alphamail.api.assistants.domain.entity.TemporaryQuoteProduct;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.erp.domain.entity.Client;

import java.time.LocalDateTime;
import java.util.List;

public record TemporaryQuoteResponse(
        Integer id,
        String userName,
        String title,
        Email email,
        List<EmailAttachment> emailAttachments,
        String clientName,
        ClientDTO client,
        LocalDateTime createdAt,
        String shippingAddress,
        Boolean hasShippingAddress,
        String manager,
        String managerNumber,
        List<TemporaryQuoteProduct> products
) {
    public static TemporaryQuoteResponse from(TemporaryQuote temporaryQuote, List<EmailAttachment> newEmailAttachments) {
        return new TemporaryQuoteResponse(
                temporaryQuote.getId(),
                temporaryQuote.getUser().getName(),
                temporaryQuote.getTitle(),
                temporaryQuote.getEmail(),
                newEmailAttachments,
                temporaryQuote.getClientName(),
                ClientDTO.from(temporaryQuote.getClient()),
                temporaryQuote.getCreatedAt(),
                temporaryQuote.getShippingAddress(),
                temporaryQuote.getHasShippingAddress(),
                temporaryQuote.getManager(),
                temporaryQuote.getManagerNumber(),
                temporaryQuote.getTemporaryQuoteProducts()
        );
    }

    public record ClientDTO(
            Integer clientId,
            String clientName
    ) {
        public static TemporaryQuoteResponse.ClientDTO from(Client client) {
            if (client == null) {
                return null;
            }
            return new TemporaryQuoteResponse.ClientDTO(
                    client.getClientId(),
                    client.getCorpName()
            );
        }
    }
}
