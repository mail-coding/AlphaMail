package com.alphamail.api.auth.domain.repository;

import com.alphamail.api.user.domain.valueobject.UserId;

public interface TokenRepository {

	void saveAccessToken(UserId userId, String accessToken, Long expiresIn);

	String findAccessToken(UserId userId);

	void removeAccessToken(UserId userId);
}
