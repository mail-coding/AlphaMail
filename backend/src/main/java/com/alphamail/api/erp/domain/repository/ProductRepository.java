package com.alphamail.api.erp.domain.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.alphamail.api.erp.domain.entity.Product;

public interface ProductRepository {

	Page<Product> findAll(Pageable pageable);

	Page<Product> findByNameContaining(String name, Pageable pageable);

	Optional<Product> findById(Integer productId);

	Optional<Product> duplicateProduct(Integer companyId, String name, String standard);

	Product save(Product product);

	void delete(Integer productId);
}
