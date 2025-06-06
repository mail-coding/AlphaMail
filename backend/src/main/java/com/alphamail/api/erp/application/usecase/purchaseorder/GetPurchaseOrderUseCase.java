package com.alphamail.api.erp.application.usecase.purchaseorder;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.erp.domain.entity.PurchaseOrder;
import com.alphamail.api.erp.domain.repository.PurchaseOrderRepository;
import com.alphamail.api.erp.presentation.dto.purchaseorder.GetPurchaseOrderResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetPurchaseOrderUseCase {

	private final PurchaseOrderRepository purchaseOrderRepository;

	public GetPurchaseOrderResponse execute(Integer orderId) {
		PurchaseOrder order = purchaseOrderRepository.findById(orderId).orElse(null);

		if (order == null) {
			return null;
		}

		return GetPurchaseOrderResponse.from(order);
	}
}
