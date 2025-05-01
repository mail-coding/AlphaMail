package com.alphamail.api.erp.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alphamail.api.erp.infrastructure.entity.ProductEntity;

@Repository
public interface ProductJpaRepository extends JpaRepository<ProductEntity, Integer> {

	Page<ProductEntity> findByNameContaining(String name, Pageable pageable);

	Optional<ProductEntity> findByCompanyIdAndNameAndStandard(Integer companyId, String name, String standard);
}
