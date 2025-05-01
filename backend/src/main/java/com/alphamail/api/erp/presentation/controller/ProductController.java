package com.alphamail.api.erp.presentation.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.erp.application.usecase.product.GetAllProductsUseCase;
import com.alphamail.api.erp.application.usecase.product.GetProductUseCase;
import com.alphamail.api.erp.application.usecase.product.RegistProductUseCase;
import com.alphamail.api.erp.application.usecase.product.RemoveProductUseCase;
import com.alphamail.api.erp.presentation.dto.product.GetAllProductsResponse;
import com.alphamail.api.erp.presentation.dto.product.GetProductResponse;
import com.alphamail.api.erp.presentation.dto.product.RegistProductRequest;
import com.alphamail.api.erp.presentation.dto.product.RegistProductResult;
import com.alphamail.common.constants.ApiPaths;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiPaths.ERP_BASE_API)
public class ProductController {

	private final GetAllProductsUseCase getAllProductsUseCase;
	private final GetProductUseCase getProductUseCase;
	private final RegistProductUseCase registProductUseCase;
	private final RemoveProductUseCase removeProductUseCase;

	// 품목 전체 조회
	@GetMapping(ApiPaths.COMPANIES_BASE_API + ApiPaths.PRODUCTS_BASE_API)
	public ResponseEntity<Page<GetAllProductsResponse>> getAll(@PathVariable Integer companyId,
		@RequestParam(required = false) String name, @PageableDefault(size = 10) Pageable pageable) {
		Page<GetAllProductsResponse> response = getAllProductsUseCase.execute(name, pageable);

		return ResponseEntity.ok(response);
	}

	// 품목 상세 조회
	@GetMapping(ApiPaths.PRODUCTS_BASE_API + "/{productId}")
	public ResponseEntity<GetProductResponse> get(@PathVariable Integer productId) {
		GetProductResponse response = getProductUseCase.execute(productId);

		if (response == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		return ResponseEntity.ok(response);
	}

	// 품목 등록하기
	@PostMapping(ApiPaths.PRODUCTS_BASE_API)
	public ResponseEntity<Void> regist(@RequestBody RegistProductRequest registProductRequest) {
		RegistProductResult result = registProductUseCase.execute(registProductRequest);

		return switch (result.status()) {
			case SUCCESS -> ResponseEntity.status(HttpStatus.CREATED).build();
			case DUPLICATED -> ResponseEntity.status(HttpStatus.CONFLICT).build();
			case SAVE_FAILED -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		};
	}

	// 품목 삭제하기
	@DeleteMapping(ApiPaths.PRODUCTS_BASE_API + "/{productId}")
	public ResponseEntity<Void> delete(@PathVariable Integer productId) {
		boolean deleted = removeProductUseCase.execute(productId);

		return deleted ? ResponseEntity.status(HttpStatus.NO_CONTENT).build() :
			ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

}
