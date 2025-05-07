package com.alphamail.api.user.infrastructure.entity;

import java.time.LocalDateTime;

import com.alphamail.api.organization.infrastructure.entity.GroupEntity;
import com.alphamail.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserEntity extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer userId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "group_id", nullable = false)
	private GroupEntity group;

	@Column(name = "position", nullable = false, length = 50)
	private String position;

	@Column(name = "name", nullable = false, length = 50)
	private String name;

	@Column(name = "email", nullable = false, length = 100)
	private String email;

	@Column(name = "phone_num", nullable = false, length = 20)
	private String phoneNum;

	@Column(name = "hashed_password", nullable = false, length = 255)
	private String hashedPassword;

	@Builder.Default
	@Column(name = "status", nullable = false)
	private boolean status = false;

	@Column(name = "image", nullable = false, length = 255)
	private String image;


	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;
}
