package com.alphamail.api.erp.application.usecase.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alphamail.api.erp.application.dto.RegistResultDto;
import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.repository.ProductRepository;
import com.alphamail.api.erp.presentation.dto.product.ModifyProductRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ModifyProductUseCase {

	private final ProductRepository productRepository;

	public RegistResultDto execute(Integer productId, ModifyProductRequest request) {
		Product product = productRepository.findById(productId).orElse(null);

		if (product == null) {
			return RegistResultDto.notFound();
		}

		product.update(request);
		Product savedProduct = productRepository.save(product);

		if (savedProduct == null) {
			return RegistResultDto.saveFailed();
		}

		return RegistResultDto.saveSuccess(productId);
	}
}
