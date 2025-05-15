package com.alphamail.api.assistants.domain.entity;

import com.alphamail.api.assistants.presentation.dto.quote.CreateTemporaryQuoteRequest;
import com.alphamail.api.assistants.presentation.dto.quote.UpdateTemporaryQuoteRequest;
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
public class TemporaryQuote {
    private Integer id;  // 발주서 아이디
    private String title;
    private User user;
    private Email email;
    private String clientName;
    private Client client;
    private LocalDateTime createdAt;
    private String shippingAddress;
    private Boolean hasShippingAddress;
    private String manager;
    private String managerNumber;
    private List<TemporaryQuoteProduct> temporaryQuoteProducts;

    public static TemporaryQuote create(CreateTemporaryQuoteRequest createTemporaryQuoteRequest, User user, Email email) {
        List<TemporaryQuoteProduct> productList = createTemporaryQuoteRequest.products().stream()
                .map(p -> new TemporaryQuoteProduct(
                        null, // ID는 아직 없으므로 null 처리
                        null,
                        p.productName(),
                        p.count()
                )).toList();

        return TemporaryQuote.builder()
                .title(createTemporaryQuoteRequest.title())
                .user(user)
                .email(email)
                .clientName(createTemporaryQuoteRequest.clientName())
                .shippingAddress(createTemporaryQuoteRequest.shippingAddress())
                .hasShippingAddress(false)
                .manager(createTemporaryQuoteRequest.manager())
                .managerNumber(createTemporaryQuoteRequest.managerNumber())
                .temporaryQuoteProducts(productList)
                .build();
    }

    public TemporaryQuote update(UpdateTemporaryQuoteRequest updateTemporaryQuoteRequest, List<TemporaryQuoteProduct> updateTemporaryQuoteProduct, Client client) {

        return TemporaryQuote.builder()
                .id(updateTemporaryQuoteRequest.id())
                .title(this.title)
                .user(this.user)
                .email(this.email)
                .createdAt(this.createdAt)
                .clientName(updateTemporaryQuoteRequest.clientName())
                .client(client != null ? client : this.client)
                .shippingAddress(updateTemporaryQuoteRequest.shippingAddress())
                .hasShippingAddress(updateTemporaryQuoteRequest.hasShippingAddress() != null ? updateTemporaryQuoteRequest.hasShippingAddress() : this.hasShippingAddress)
                .manager(updateTemporaryQuoteRequest.manager())
                .managerNumber(updateTemporaryQuoteRequest.managerNumber())
                .temporaryQuoteProducts(updateTemporaryQuoteProduct)
                .build();
    }

}
