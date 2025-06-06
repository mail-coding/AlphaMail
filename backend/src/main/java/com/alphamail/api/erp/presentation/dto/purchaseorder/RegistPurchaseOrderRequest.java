package com.alphamail.api.erp.presentation.dto.purchaseorder;

import java.time.LocalDateTime;
import java.util.List;

public record RegistPurchaseOrderRequest(
	Integer userId,
	Integer companyId,
	Integer groupId,
	Integer clientId,
	String orderNo,
	LocalDateTime deliverAt,
	String shippingAddress,
	String manager,
	String managerNumber,
	String paymentTerm,
	List<PurchaseOrderProductDto> products
) {
	public record PurchaseOrderProductDto(
		Integer purchaseOrderProductId,
		Integer productId,
		Integer count,
		Long price
	) {
	}
}
