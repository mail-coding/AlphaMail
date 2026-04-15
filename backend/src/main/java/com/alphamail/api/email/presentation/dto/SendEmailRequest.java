package com.alphamail.api.email.presentation.dto;

import java.util.List;

public record SendEmailRequest(
	String sender,
	List<String> recipients,
	String subject,
	String bodyText,
	String bodyHtml,
	String inReplyTo,
	String references,
	List<Attachment> attachments
	) {

	public record Attachment(
		String name,
		Long size,
		String type
	) {
	}
}
