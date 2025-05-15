package com.alphamail.api.assistants.application.usecase.purchaseorder;

import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrder;
import com.alphamail.api.assistants.domain.entity.TemporaryPurchaseOrderProduct;
import com.alphamail.api.assistants.domain.repository.TemporaryPurchaseOrderRepository;
import com.alphamail.api.assistants.domain.service.EmailAttachmentReader;
import com.alphamail.api.assistants.domain.service.ProductReader;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.TemporaryPurchaseOrderProductRequest;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.TemporaryPurchaseOrderResponse;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.UpdateTemporaryPurchaseOrderRequest;
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
public class UpdateTemporaryPurchaseOrderUseCase {

    private final TemporaryPurchaseOrderRepository temporaryPurchaseOrderRepository;
    private final ProductReader productReader;
    private final ClientReader clientReader;
    private final EmailAttachmentReader emailAttachmentReader;

    public TemporaryPurchaseOrderResponse execute(Integer temporaryPurchaseOrderId,UpdateTemporaryPurchaseOrderRequest updateTemporaryPurchaseOrderRequest, Integer userId) {

        Client client = null;
        if(updateTemporaryPurchaseOrderRequest.clientId()!=null) {
            client = clientReader.findById(updateTemporaryPurchaseOrderRequest.clientId());
            if(client==null){
                throw new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND);
            }
        }

        List<TemporaryPurchaseOrderProduct> temporaryPurchaseOrderProducts = new ArrayList<>();

        for(TemporaryPurchaseOrderProductRequest temporaryProduct : updateTemporaryPurchaseOrderRequest.products()){

            Product product = null;

            if (temporaryProduct.productId() != null) {
                product = productReader.findById(temporaryProduct.productId());
                if (product == null) {
                    throw new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND);
                }
            }
                temporaryPurchaseOrderProducts.add(
                        TemporaryPurchaseOrderProduct.builder()
                                .product(product)
                                .id(temporaryProduct.id())
                                .productName(temporaryProduct.productName())
                                .count(temporaryProduct.count())
                                .build());
            }

        TemporaryPurchaseOrder temporaryPurchaseOrder = temporaryPurchaseOrderRepository
                .findByIdAndUserId(temporaryPurchaseOrderId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        TemporaryPurchaseOrder updateTemporaryPurchaseOrder = temporaryPurchaseOrder.update(updateTemporaryPurchaseOrderRequest,temporaryPurchaseOrderProducts,client);

        List<EmailAttachment> emailAttachment = emailAttachmentReader.findAllByEmailId(updateTemporaryPurchaseOrder.getEmail().getEmailId());

        return TemporaryPurchaseOrderResponse.from(temporaryPurchaseOrderRepository.save(updateTemporaryPurchaseOrder),emailAttachment);
    }
}
