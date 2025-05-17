package com.alphamail.api.erp.presentation.dto.product;

import com.alphamail.api.erp.domain.entity.Product;

public record GetProductResponse(
	Integer id,
	String name,
	String standard,
	Integer stock,
	Long inboundPrice,
	Long outboundPrice,
	String image
) {
	public static GetProductResponse from(Product product) {
		String imageUrl = product.getImage() != null
			? "https://alphamailemailbucket.s3.ap-northeast-2.amazonaws.com/sendAttachments/" + product.getImage()
			: null;

		return new GetProductResponse(
			product.getProductId(),
			product.getName(),
			product.getStandard(),
			product.getStock(),
			product.getInboundPrice(),
			product.getOutboundPrice(),
			imageUrl
		);
	}
}
