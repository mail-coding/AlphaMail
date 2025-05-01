package com.alphamail.api.erp.application.usecase.product;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.repository.ProductRepository;
import com.alphamail.api.erp.presentation.dto.product.RegistProductRequest;
import com.alphamail.api.erp.presentation.dto.product.RegistProductResult;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RegistProductUseCase {

	private final ProductRepository productRepository;

	public RegistProductResult execute(RegistProductRequest request) {

		Product product = Product.create(request);

		// 1. 품목 중복 체크
		Optional<Product> duplicatedProduct = productRepository.duplicateProduct(product.getCompanyId(),
			product.getName(),
			product.getStandard());

		if (duplicatedProduct.isPresent()) {
			return RegistProductResult.duplicated();
		}

		// 2. 품목 저장
		Product savedProduct = productRepository.save(product);
		if (savedProduct == null) {
			return RegistProductResult.saveFailed();
		}

		return RegistProductResult.saveSuccess();
	}

}
