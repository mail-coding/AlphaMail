package com.alphamail.api.assistants.domain.entity;

import com.alphamail.api.assistants.presentation.dto.purchaseorders.CreateTemporaryPurchaseOrderRequest;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.UpdateTemporaryPurchaseOrderRequest;
import com.alphamail.api.email.domain.entity.Email;
import com.alphamail.api.erp.domain.entity.Client;
import com.alphamail.api.user.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryPurchaseOrder {
    private Integer id;
    private String title;
    private User user;
    private Email email;
    private String clientName;
    private Client client;
    private LocalDateTime deliverAt;
    private LocalDateTime createdAt;
    private String shippingAddress;
    private Boolean hasShippingAddress;
    private String manager;
    private String managerNumber;
    private String paymentTerm;
    private List<TemporaryPurchaseOrderProduct> temporaryPurchaseOrderProduct;


    public static TemporaryPurchaseOrder create(CreateTemporaryPurchaseOrderRequest request, User user, Email email) {
        List<TemporaryPurchaseOrderProduct> productList = request.products().stream()
                .map(p -> new TemporaryPurchaseOrderProduct(
                        null, // ID는 아직 없으므로 null 처리
                        null,
                        p.productName(),
                        p.count()
                ))
                .toList();

        return TemporaryPurchaseOrder.builder()
                .title(request.title())
                .user(user)
                .email(email)
                .clientName(request.clientName())
                .deliverAt(request.deliverAt())
                .shippingAddress(request.shippingAddress())
                .hasShippingAddress(false)
                .manager(request.manager())
                .managerNumber(request.managerNumber())
                .paymentTerm(request.paymentTerm())
                .temporaryPurchaseOrderProduct(productList)
                .build();
    }

    public TemporaryPurchaseOrder update(UpdateTemporaryPurchaseOrderRequest request, List<TemporaryPurchaseOrderProduct> updateTemporaryPurchaseOrderProduct, Client client) {

        return TemporaryPurchaseOrder.builder()
                .id(this.id)
                .title(this.title)
                .user(this.user)
                .email(this.email)
                .createdAt(this.createdAt)
                .clientName(request.clientName())
                .client(client)
                .deliverAt(request.deliverAt())
                .shippingAddress(request.shippingAddress())
                .hasShippingAddress(request.hasShippingAddress() != null ? request.hasShippingAddress() : this.hasShippingAddress)
                .manager(request.manager())
                .managerNumber(request.managerNumber())
                .paymentTerm(request.paymentTerm())
                .temporaryPurchaseOrderProduct(updateTemporaryPurchaseOrderProduct)
                .build();
    }
}
