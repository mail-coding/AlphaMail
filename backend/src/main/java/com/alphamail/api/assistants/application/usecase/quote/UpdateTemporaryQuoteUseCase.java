package com.alphamail.api.assistants.application.usecase.quote;

import com.alphamail.api.assistants.domain.entity.TemporaryQuote;
import com.alphamail.api.assistants.domain.entity.TemporaryQuoteProduct;
import com.alphamail.api.assistants.domain.repository.TemporaryQuoteRepository;
import com.alphamail.api.assistants.domain.service.EmailAttachmentReader;
import com.alphamail.api.assistants.domain.service.ProductReader;
import com.alphamail.api.assistants.presentation.dto.quote.TemporaryQuoteResponse;
import com.alphamail.api.assistants.presentation.dto.quote.UpdateTemporaryQuoteProductRequest;
import com.alphamail.api.assistants.presentation.dto.quote.UpdateTemporaryQuoteRequest;
import com.alphamail.api.email.domain.entity.EmailAttachment;
import com.alphamail.api.erp.domain.entity.Client;
import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.service.ClientReader;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class UpdateTemporaryQuoteUseCase {

    private final TemporaryQuoteRepository temporaryQuoteRepository;
    private final ProductReader productReader;
    private final ClientReader clientReader;
    private final EmailAttachmentReader emailAttachmentReader;

    public TemporaryQuoteResponse execute(Integer temporaryQuoteId, UpdateTemporaryQuoteRequest updateTemporaryQuoteRequest, Integer userId) {

        Client client = null;
        if (updateTemporaryQuoteRequest.clientId() != null) {
            client = clientReader.findById(updateTemporaryQuoteRequest.clientId());
            if (client == null) {
                throw new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND);
            }
        }
        List<TemporaryQuoteProduct> temporaryQuoteProducts = new ArrayList<>();

        for (UpdateTemporaryQuoteProductRequest temporaryProduct : updateTemporaryQuoteRequest.products()) {

            Product product = null;

            if (temporaryProduct.productId() != null) {
                product = productReader.findById(temporaryProduct.productId());
                if (product == null) {
                    throw new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND);
                }
            }
            temporaryQuoteProducts.add(
                    TemporaryQuoteProduct.builder()
                            .product(product)
                            .id(temporaryProduct.id())
                            .productName(temporaryProduct.productName())
                            .count(temporaryProduct.count())
                            .build());
        }


        TemporaryQuote temporaryQuote = temporaryQuoteRepository.findByIdAndUserId(temporaryQuoteId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        TemporaryQuote updateTemporaryQuote = temporaryQuote.update(updateTemporaryQuoteRequest, temporaryQuoteProducts, client);

        List<EmailAttachment> emailAttachment = emailAttachmentReader.findAllByEmailId(updateTemporaryQuote.getEmail().getEmailId());

        return TemporaryQuoteResponse.from(temporaryQuoteRepository.save(updateTemporaryQuote), emailAttachment);
    }

}
