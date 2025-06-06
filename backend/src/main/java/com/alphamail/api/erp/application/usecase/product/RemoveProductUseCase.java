package com.alphamail.api.erp.application.usecase.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RemoveProductUseCase {

	private final ProductRepository productRepository;

	public boolean execute(Integer productId) {
		Product product = productRepository.findById(productId).orElse(null);
		if (product == null) {
			return false;
		}

		productRepository.softDeleteById(productId);
		return true;
	}
}
