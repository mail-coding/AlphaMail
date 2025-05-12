package com.alphamail.api.chatbot.infrastructure.entity;

import com.alphamail.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chatbot_messages")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatBotEntity extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "user_id", nullable = false)
	private Integer userId;

	@Column(name = "role", nullable = false)
	private int roleCode;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;
}
