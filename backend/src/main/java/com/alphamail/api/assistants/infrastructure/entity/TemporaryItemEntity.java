package com.alphamail.api.assistants.infrastructure.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@IdClass(TemporaryItemId.class)  // 복합 키 정의
public class TemporaryItemEntity {

	@Id
	@Column(insertable = false, updatable = false)
	private Integer id;

	@Id
	@Column(insertable = false, updatable = false)
	private String type;  // 이 두 필드를 함께 복합 키로 사용

	@Column(insertable = false, updatable = false)
	private String title;

	@Column(name = "user_id", insertable = false, updatable = false)
	private Integer userId;

	@Column(name = "email_id", insertable = false, updatable = false)
	private Integer emailId;

	@Column(name = "email_time", insertable = false, updatable = false)
	private LocalDateTime emailTime;
}

