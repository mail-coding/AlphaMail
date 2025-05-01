package com.alphamail.api.erp.presentation.dto.product;

import com.alphamail.api.erp.domain.entity.Product;

public record GetAllProductsResponse(
	Integer id,
	String name,
	String standard,
	Integer stock,
	Long inboundPrice,
	Long outboundPrice
) {
	public static GetAllProductsResponse from(Product product) {
		return new GetAllProductsResponse(
			product.getProductId(),
			product.getName(),
			product.getStandard(),
			product.getStock(),
			product.getInboundPrice(),
			product.getOutboundPrice()
		);
	}
}
