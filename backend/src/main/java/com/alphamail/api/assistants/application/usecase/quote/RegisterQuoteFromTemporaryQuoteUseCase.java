package com.alphamail.api.assistants.application.usecase.quote;

import com.alphamail.api.assistants.domain.repository.TemporaryQuoteRepository;
import com.alphamail.api.assistants.domain.service.ProductReader;
import com.alphamail.api.assistants.domain.service.QuoteStore;
import com.alphamail.api.assistants.presentation.dto.quote.RegisterTemporaryQuoteProductRequest;
import com.alphamail.api.assistants.presentation.dto.quote.RegisterTemporaryQuoteRequest;
import com.alphamail.api.erp.domain.entity.Client;
import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.entity.Quote;
import com.alphamail.api.erp.domain.service.ClientReader;
import com.alphamail.api.erp.domain.service.CompanyReader;
import com.alphamail.api.erp.domain.service.GroupReader;
import com.alphamail.api.erp.domain.service.UserReader;
import com.alphamail.api.erp.presentation.dto.quote.RegistQuoteRequest;
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
public class RegisterQuoteFromTemporaryQuoteUseCase {

    private final TemporaryQuoteRepository temporaryQuoteRepository;
    private final QuoteStore quoteStore;
    private final UserReader userReader;
    private final GroupReader groupReader;
    private final ClientReader clientReader;
    private final ProductReader productReader;
    private final CompanyReader companyReader;

    public void execute(RegisterTemporaryQuoteRequest registerTemporaryQuoteRequest, Integer userId) {

        User user = userReader.findById(userId);
        Group group = groupReader.findById(user.getGroupId());
        Client client = clientReader.findById(registerTemporaryQuoteRequest.clientId());
        Company company = companyReader.findById(registerTemporaryQuoteRequest.companyId());

        List<RegistQuoteRequest.QuoteProductDto> quoteProductDtoList = new ArrayList<>();

        for(RegisterTemporaryQuoteProductRequest request : registerTemporaryQuoteRequest.products()){
            Product product =  productReader.findById(request.productId());
            quoteProductDtoList.add(
                    new RegistQuoteRequest.QuoteProductDto(null, request.productId(), request.count(), product.getOutboundPrice())
            );
        }

        RegistQuoteRequest registQuoteRequest = new RegistQuoteRequest
                (userId,company.getCompanyId(), group.getGroupId(), client.getClientId(),null
                        , registerTemporaryQuoteRequest.shippingAddress(), registerTemporaryQuoteRequest.manager()
                        ,registerTemporaryQuoteRequest.managerNumber(),
                        quoteProductDtoList);

        quoteStore.save(Quote.create(registQuoteRequest,user,company,group,client));

        temporaryQuoteRepository.findByIdAndUserId(registerTemporaryQuoteRequest.id(), userId)
                .orElseThrow(()->  new NotFoundException(ErrorMessage.RESOURCE_NOT_FOUND));

        temporaryQuoteRepository.deleteById(registerTemporaryQuoteRequest.id());
    }

}
