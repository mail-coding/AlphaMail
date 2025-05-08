package com.alphamail.api.user.application.port;

import com.alphamail.api.user.domain.valueobject.UserId;

public interface LoadUserPort {

	/**
	 * 이메일 주소로 유저를 조회한다.
	 * @param email 이메일 주소
	 * @return User 도메인 객체
	 */
	UserId loadUserIdByEmail(String email);
}
