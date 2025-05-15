package com.alphamail.api.assistants.infrastructure.entity;

import com.alphamail.api.erp.infrastructure.entity.ProductEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "temporary_purchase_order_products")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryPurchaseOrderProductEntity {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "temporary_purchase_order_id", nullable = false)
    private TemporaryPurchaseOrderEntity purchaseOrder;

    public void setPurchaseOrderEntity(TemporaryPurchaseOrderEntity purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }
}
