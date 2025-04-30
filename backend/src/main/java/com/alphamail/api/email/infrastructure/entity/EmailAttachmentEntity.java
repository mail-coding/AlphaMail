package com.alphamail.api.email.infrastructure.entity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "email_attachments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class EmailAttachmentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@JoinColumn(name = "user_id")
	@ManyToOne(fetch = FetchType.LAZY)
	private UserEntity user;

	@JoinColumn(name = "email_id")
	@ManyToOne(fetch = FetchType.LAZY)
	private EmailEntity email;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String path;

	@Column(nullable = false)
	private Integer size;

	@Column(nullable = false)
	private String type;
}
