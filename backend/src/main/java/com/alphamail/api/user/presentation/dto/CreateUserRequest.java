package com.alphamail.api.user.presentation.dto;

import lombok.Builder;

@Builder
public record CreateUserRequest(
	Integer groupId,
	String position,
	String name,
	String email,
	String password,
	String phoneNum
) {

}
