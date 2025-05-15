package com.alphamail.api.assistants.presentation.controller;

import com.alphamail.api.assistants.application.usecase.purchaseorder.*;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.CreateTemporaryPurchaseOrderRequest;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.RegisterTemporaryPurchaseOrderRequest;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.TemporaryPurchaseOrderResponse;
import com.alphamail.api.assistants.presentation.dto.purchaseorders.UpdateTemporaryPurchaseOrderRequest;
import com.alphamail.common.annotation.Auth;
import com.alphamail.common.constants.ApiPaths;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping(ApiPaths.ASSISTANTS_BASE_API + ApiPaths.ORDERS_BASE_API)
@RestController
public class TemporaryPurchaseOrderController {

    private final CreateTemporaryPurchaseOrderUseCase createTemporaryPurchaseOrderUseCase;
    private final UpdateTemporaryPurchaseOrderUseCase updateTemporaryPurchaseOrderUseCase;
    private final GetTemporaryPurchaseOrderUseCase getTemporaryPurchaseOrderUseCase;
    private final DeleteTemporaryPurchaseOrderUseCase deleteTemporaryPurchaseOrderUseCase;
    private final RegisterPOFromTemporaryPurchaseOrderUseCase registerPOFromTemporaryPurchaseOrderUseCase;

    @PostMapping
    public ResponseEntity<String> addTemporaryPurchaseOrder(
            @RequestBody CreateTemporaryPurchaseOrderRequest temporaryPurchaseOrderRequest) {

        createTemporaryPurchaseOrderUseCase.execute(temporaryPurchaseOrderRequest);

        return ResponseEntity.ok("임시 발주서 등록이 완료 되었습니다");
    }

    @PatchMapping("/{temporaryPurchaseOrderId}")
    public ResponseEntity<TemporaryPurchaseOrderResponse> updateTemporaryPurchaseOrder(
            @PathVariable Integer temporaryPurchaseOrderId,
            @RequestBody UpdateTemporaryPurchaseOrderRequest updateTemporaryPurchaseOrderRequest,
            @Auth Integer userId) {

        TemporaryPurchaseOrderResponse temporaryPurchaseOrderResponse = updateTemporaryPurchaseOrderUseCase.execute(temporaryPurchaseOrderId, updateTemporaryPurchaseOrderRequest, userId);

        return ResponseEntity.ok(temporaryPurchaseOrderResponse);
    }


    @GetMapping("/{temporaryPurchaseOrderId}")
    public ResponseEntity<TemporaryPurchaseOrderResponse> getTemporaryPurchaseOrder(
            @PathVariable Integer temporaryPurchaseOrderId, @Auth Integer userId) {

        TemporaryPurchaseOrderResponse temporaryPurchaseOrderResponse = getTemporaryPurchaseOrderUseCase.execute(temporaryPurchaseOrderId, userId);

        return ResponseEntity.ok(temporaryPurchaseOrderResponse);
    }

    @DeleteMapping("/{temporaryPurchaseOrderId}")
    public ResponseEntity<String> deleteTemporaryPurchaseOrder(
            @PathVariable Integer temporaryPurchaseOrderId, @Auth Integer userId) {

        deleteTemporaryPurchaseOrderUseCase.execute(temporaryPurchaseOrderId, userId);

        return ResponseEntity.ok("임시 발주서 삭제가 완료되었습니다");
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerPurchaseOrderFromTemporaryPurchaseOrder(
            @RequestBody RegisterTemporaryPurchaseOrderRequest registerTemporaryPurchaseOrderRequest,
            @Auth Integer userId) {

        registerPOFromTemporaryPurchaseOrderUseCase.execute(registerTemporaryPurchaseOrderRequest, userId);

        return ResponseEntity.ok("발주서 등록이 완료되었습니다");
    }


}
