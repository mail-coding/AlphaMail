package com.alphamail.api.erp.domain.repository;

import java.util.Optional;

import com.alphamail.api.erp.domain.entity.Product;

public interface ProductRepository {

	Optional<Product> duplicateProduct(Integer companyId, String name, String standard);

	Product save(Product product);

	Optional<Product> findById(Integer productId);

	void delete(Integer productId);
}
