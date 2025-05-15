package com.alphamail.api.assistants.infrastructure.entity;

import com.alphamail.api.email.infrastructure.entity.EmailEntity;
import com.alphamail.api.erp.infrastructure.entity.ClientEntity;
import com.alphamail.api.user.infrastructure.entity.UserEntity;
import com.alphamail.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "temporary_purchase_order")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemporaryPurchaseOrderEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // 발주서 아이디

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // 수정된 부분
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email_id", nullable = false)
    private EmailEntity emailEntity;

    @Column(name = "client_name", length = 50)
    private String clientName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private ClientEntity clientEntity;

    @Column(name = "deliver_at")
    private LocalDateTime deliverAt;

    @Column(name = "shipping_address", length = 255)
    private String shippingAddress;

    @Column(name = "has_shipping_address", nullable = false)
    private Boolean hasShippingAddress = false;

    @Column(name = "manager", length = 30)
    private String manager;

    @Column(name = "manager_number", length = 13)
    private String managerNumber;

    @Column(name = "payment_term", length = 255)
    private String paymentTerm;

    @Setter
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TemporaryPurchaseOrderProductEntity> temporaryPurchaseOrderProductEntity;
}
