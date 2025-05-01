package com.alphamail.api.erp.infrastructure.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.alphamail.api.erp.domain.entity.Product;
import com.alphamail.api.erp.domain.repository.ProductRepository;
import com.alphamail.api.erp.infrastructure.entity.ProductEntity;
import com.alphamail.api.erp.infrastructure.mapping.ProductMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepository {

	private final ProductJpaRepository productJpaRepository;
	private final ProductMapper productMapper;

	@Override
	public Optional<Product> duplicateProduct(Integer companyId, String name, String standard) {
		return productJpaRepository
			.findByCompanyIdAndNameAndStandard(companyId, name, standard)
			.map(productMapper::toDomain);
	}

	@Override
	public Product save(Product product) {
		ProductEntity productEntity = productMapper.toEntity(product);
		ProductEntity savedProductEntity = productJpaRepository.save(productEntity);

		return productMapper.toDomain(savedProductEntity);
	}

	@Override
	public Optional<Product> findById(Integer productId) {
		return productJpaRepository
			.findById(productId)
			.map(productMapper::toDomain);
	}

	@Override
	public void delete(Integer productId) {
		productJpaRepository.deleteById(productId);
	}
}
