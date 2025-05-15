package com.alphamail.api.assistants.infrastructure.entity;

import com.alphamail.api.erp.infrastructure.entity.ProductEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "temporary_quote_product")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryQuoteProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;

    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "count")
    private Integer count;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "temporary_quote_id", nullable = false)
    private TemporaryQuoteEntity temporaryQuoteEntities;

}
