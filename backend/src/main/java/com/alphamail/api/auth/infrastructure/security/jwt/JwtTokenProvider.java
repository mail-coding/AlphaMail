package com.alphamail.api.auth.infrastructure.security.jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.alphamail.api.auth.infrastructure.security.userdetails.CustomUserDetailService;
import com.alphamail.api.user.domain.valueobject.UserId;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

	private final CustomUserDetailService customUserDetailService;
	private final Key key;

	@Value("${jwt.access-token-validity-in-seconds}")
	private long accessTokenValidityInSeconds;

	public JwtTokenProvider(CustomUserDetailService customUserDetailService, @Value("${jwt.secret}") String secret) {
		this.customUserDetailService = customUserDetailService;
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String createAccessToken(UserId userId) {
		Date now = new Date();
		Date validity = new Date(now.getTime() + accessTokenValidityInSeconds * 1000);

		return Jwts.builder()
			.setSubject(String.valueOf(userId.getValue()))
			.setIssuedAt(now)
			.setExpiration(validity)
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}

	public Authentication getAuthentication(String token) {
		UserId userId = getUserId(token);
		UserDetails userDetails = customUserDetailService.loadUserById(userId.getValue());
		return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
	}

	public UserId getUserId(String token) {
		String subject = Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody()
			.getSubject();

		return UserId.of(Integer.parseInt(subject));
	}


	public boolean validateToken(String token) {
		try {
			Claims claims = Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();

			return !claims.getExpiration().before(new Date());
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	public Long getAccessTokenValidityInSeconds() {
		return accessTokenValidityInSeconds;
	}

}
