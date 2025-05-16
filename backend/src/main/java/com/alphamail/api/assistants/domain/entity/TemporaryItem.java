package com.alphamail.api.assistants.domain.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "id")
public class TemporaryItem {
	private Long id;
	private String type;
	private String title;
	private Integer userId;
	private Integer emailId;
	private LocalDateTime emailTime;
}