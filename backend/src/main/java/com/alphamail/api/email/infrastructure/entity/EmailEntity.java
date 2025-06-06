package com.alphamail.api.email.infrastructure.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import com.alphamail.api.email.domain.entity.EmailStatus;
import com.alphamail.api.email.domain.entity.EmailType;
import com.alphamail.api.user.infrastructure.entity.UserEntity;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emails")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
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

	private String messageId;

	private String sesMessageId;

	@Column(nullable = false)
	private String sender;

	@Column(columnDefinition = "text[]", nullable = false)
	@JdbcTypeCode(SqlTypes.ARRAY)
	private List<String> recipients;

	@Column(nullable = false)
	private String subject;

	@Column(columnDefinition = "text")
	private String bodyText;

	@Column(columnDefinition = "text")
	private String bodyHtml;

	private LocalDateTime receivedDateTime;

	private LocalDateTime sentDateTime;

	private Boolean readStatus;

	@Column(nullable = false)
	private Boolean hasAttachment;

	private String inReplyTo;

	@Column(name = "email_references")
	private String references;

	@Column(length = 100)
	private String threadId;

	private String filePath;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EmailType emailType;

	@Enumerated(EnumType.STRING)
	private EmailStatus emailStatus;

	private Integer originalFolderId;

	@OneToMany(mappedBy = "email", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EmailAttachmentEntity> attachments;

	public void updateStatus(EmailStatus status) {
		this.emailStatus = status;
	}

}
