package com.alphamail.api.assistants.application.usecase.purchaseorder;

import com.alphamail.api.assistants.domain.repository.TemporaryPurchaseOrderRepository;
import com.alphamail.api.assistants.domain.service.ProductReader;
import com.alphamail.api.assistants.domain.service.PurchaseOrderStore;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.RegisterTemporaryPurchaseOrderProductRequest;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.RegisterTemporaryPurchaseOrderRequest;
import com.alphamail.api.erp.domain.entity.Client;
import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.entity.PurchaseOrder;
import com.alphamail.api.erp.domain.service.ClientReader;
import com.alphamail.api.erp.domain.service.CompanyReader;
import com.alphamail.api.erp.domain.service.GroupReader;
import com.alphamail.api.erp.domain.service.UserReader;

import com.alphamail.api.erp.presentation.dto.purchaseorder.RegistPurchaseOrderRequest.PurchaseOrderProductDto;
import com.alphamail.api.erp.presentation.dto.purchaseorder.RegistPurchaseOrderRequest;
import com.alphamail.api.organization.domain.entity.Company;
import com.alphamail.api.organization.domain.entity.Group;
import com.alphamail.api.user.domain.entity.User;
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
public class RegisterPOFromTemporaryPurchaseOrderUseCase {

    private final TemporaryPurchaseOrderRepository temporaryPurchaseOrderRepository;
    private final PurchaseOrderStore purchaseOrderStore;
    private final UserReader userReader;
    private final GroupReader groupReader;
    private final ClientReader clientReader;
    private final ProductReader productReader;
    private final CompanyReader companyReader;

    public void execute(RegisterTemporaryPurchaseOrderRequest registerPurchaseOrderFromTemporaryPurchaseOrder, Integer userId) {

        User user = userReader.findById(userId);
        Group group = groupReader.findById(user.getGroupId());
        Client client = clientReader.findById(registerPurchaseOrderFromTemporaryPurchaseOrder.clientId());
        Company company = companyReader.findById(registerPurchaseOrderFromTemporaryPurchaseOrder.companyId());

        List<PurchaseOrderProductDto> purchaseOrderProductDtoList = new ArrayList<>();

        for (RegisterTemporaryPurchaseOrderProductRequest request : registerPurchaseOrderFromTemporaryPurchaseOrder.products()) {
            Product product = productReader.findById(request.productId());
            purchaseOrderProductDtoList.add(
                    new PurchaseOrderProductDto(null, request.productId(), request.count(), product.getOutboundPrice())
            );
        }

        RegistPurchaseOrderRequest registPurchaseOrderRequest = new RegistPurchaseOrderRequest
                (userId, company.getCompanyId(), group.getGroupId(), client.getClientId(), null, registerPurchaseOrderFromTemporaryPurchaseOrder.deliverAt()
                        , registerPurchaseOrderFromTemporaryPurchaseOrder.shippingAddress(), registerPurchaseOrderFromTemporaryPurchaseOrder.manager(),
                        registerPurchaseOrderFromTemporaryPurchaseOrder.managerNumber(), registerPurchaseOrderFromTemporaryPurchaseOrder.paymentTerm(),
                        purchaseOrderProductDtoList);

        purchaseOrderStore.save(PurchaseOrder.create(registPurchaseOrderRequest, user, company, group, client));


        temporaryPurchaseOrderRepository.findByIdAndUserId(registerPurchaseOrderFromTemporaryPurchaseOrder.id(), userId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        temporaryPurchaseOrderRepository.deleteById(registerPurchaseOrderFromTemporaryPurchaseOrder.id());
    }


}
