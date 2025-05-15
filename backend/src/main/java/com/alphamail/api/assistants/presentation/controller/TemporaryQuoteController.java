package com.alphamail.api.assistants.presentation.controller;

import com.alphamail.api.assistants.application.usecase.quote.*;
import com.alphamail.api.assistants.presentation.dto.quote.CreateTemporaryQuoteRequest;
import com.alphamail.api.assistants.presentation.dto.quote.RegisterTemporaryQuoteRequest;
import com.alphamail.api.assistants.presentation.dto.quote.TemporaryQuoteResponse;
import com.alphamail.api.assistants.presentation.dto.quote.UpdateTemporaryQuoteRequest;
import com.alphamail.common.annotation.Auth;
import com.alphamail.common.constants.ApiPaths;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiPaths.ASSISTANTS_BASE_API + ApiPaths.QUOTES_BASE_API)
public class TemporaryQuoteController {

    private final CreateTemporaryQuoteUseCase createTemporaryQuoteUseCase;
    private final DeleteTemporaryQuoteUseCase deleteTemporaryQuoteUseCase;
    private final GetTemporaryQuoteUseCase getTemporaryQuoteUseCase;
    private final RegisterQuoteFromTemporaryQuoteUseCase registerQuoteFromTemporaryQuoteUseCase;
    private final UpdateTemporaryQuoteUseCase updateTemporaryQuoteUseCase;

    @PostMapping
    public ResponseEntity<String> addTemporaryQuote(
            @RequestBody CreateTemporaryQuoteRequest temporaryQuoteRequest) {

        createTemporaryQuoteUseCase.execute(temporaryQuoteRequest);

        return ResponseEntity.ok("임시 견적서 등록이 완료 되었습니다");
    }

    @PatchMapping("/update")
    public ResponseEntity<TemporaryQuoteResponse> updateTemporaryQuote(
            @RequestBody UpdateTemporaryQuoteRequest updateTemporaryQuoteRequest,
            @Auth Integer userId) {

        TemporaryQuoteResponse temporaryQuoteResponse = updateTemporaryQuoteUseCase.execute(updateTemporaryQuoteRequest, userId);

        return ResponseEntity.ok(temporaryQuoteResponse);
    }

    @GetMapping("/{temporaryQuoteId}")
    public ResponseEntity<TemporaryQuoteResponse> getTemporaryQuote(
            @PathVariable Integer temporaryQuoteId, @Auth Integer userId) {

        TemporaryQuoteResponse temporaryQuoteResponse = getTemporaryQuoteUseCase.execute(temporaryQuoteId, userId);

        return ResponseEntity.ok(temporaryQuoteResponse);
    }

    @DeleteMapping("/{temporaryQuoteId}")
    public ResponseEntity<String> deleteTemporaryQuote(
            @PathVariable Integer temporaryQuoteId, @Auth Integer userId) {

        deleteTemporaryQuoteUseCase.execute(temporaryQuoteId, userId);

        return ResponseEntity.ok("임시 견적서 삭제가 완료되었습니다");
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerQuoteFromTemporaryPurchaseOrder(
            @RequestBody RegisterTemporaryQuoteRequest registerTemporaryQuoteRequest,
            @Auth Integer userId) {

        registerQuoteFromTemporaryQuoteUseCase.execute(registerTemporaryQuoteRequest, userId);

        return ResponseEntity.ok("견적서 등록이 완료되었습니다");
    }


}
