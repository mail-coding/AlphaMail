package com.alphamail.api.email.infrastructure.entity;

import java.time.LocalDateTime;

import com.alphamail.api.email.domain.entity.EmailStatus;
import com.alphamail.api.email.domain.entity.EmailType;
import com.alphamail.api.user.infrastructure.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "emails")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EmailEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer emailId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "folder_id", nullable = false)
	private EmailFolderEntity folder;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@Column(nullable = false)
	private String messageId;

	@Column(nullable = false)
	private String sender;

	@Column(nullable = false)
	private String recipients;

	@Column(nullable = false)
	private String subject;

	private String bodyText;

	private String bodyHtml;

	private LocalDateTime receivedDateTime;

	private LocalDateTime sentDateTime;

	private Boolean readStatus;

	@Column(nullable = false)
	private Boolean hasAttachment;

	private String inReplyTo;

	private String references;

	@Column(length = 100, nullable = false)
	private String threadId;

	private String filePath;

	@Enumerated(EnumType.STRING)
	@Column( nullable = false)
	private EmailType emailType;

	@Enumerated(EnumType.STRING)
	@Column( nullable = false)
	private EmailStatus emailStatus;

	private Integer originalFolderId;

}
