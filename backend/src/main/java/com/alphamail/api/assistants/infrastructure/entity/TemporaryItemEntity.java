package com.alphamail.api.assistants.infrastructure.entity;

import java.time.LocalDateTime;

import com.alphamail.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "v_temporary_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "id")
public class TemporaryItemEntity {

	@Id
	private Long id;

	private String type; // 'PURCHASE_ORDER', 'QUOTE', 'CLIENT', 'SCHEDULE'

	private String title;

	@Column(name = "userId")
	private Integer userId;

	@Column(name = "email_id")
	private Integer emailId;

	@Column(name = "email_time")
	private LocalDateTime emailTime;

}
