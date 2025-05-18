package com.alphamail.api.email.infrastructure.entity;

import java.time.LocalDateTime;

import com.alphamail.api.user.infrastructure.entity.UserEntity;

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

@Entity
@Table(name = "recent_used_email")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class RecentUsedEmailEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer recentUsedEmailId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private UserEntity user;

	@Column(nullable = false)
	private String recentEmail;

	@Column(length = 25, nullable = false)
	private String emailOwner;

	@Column(nullable = false)
	private LocalDateTime lastUpdatedTime;

}
