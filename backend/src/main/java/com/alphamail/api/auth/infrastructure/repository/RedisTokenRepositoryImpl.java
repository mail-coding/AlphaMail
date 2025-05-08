package com.alphamail.api.auth.infrastructure.repository;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import com.alphamail.api.auth.domain.repository.TokenRepository;
import com.alphamail.api.user.domain.valueobject.UserId;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RedisTokenRepositoryImpl implements TokenRepository {

	private static final String ACCESS_TOKEN_KEY_PREFIX = "access:";

	private final RedisTemplate<String, String> redisTemplate;

	private String generateKey(Integer userId) {
		return ACCESS_TOKEN_KEY_PREFIX + userId.toString();
	}

	@Override
	public void saveAccessToken(UserId userId, String accessToken, Long expiresIn) {
		String key = generateKey(userId.getValue());
		System.out.println("Saving token for key: " + key);
		redisTemplate.opsForValue().set(key, accessToken, expiresIn, TimeUnit.SECONDS);
	}

	@Override
	public String findAccessToken(UserId userId) {
		return redisTemplate.opsForValue().get(generateKey(userId.getValue()));
	}

	@Override
	public void removeAccessToken(UserId userId) {
		String key = generateKey(userId.getValue());
		redisTemplate.delete(key);

	}
}
