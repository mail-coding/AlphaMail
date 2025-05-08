package com.alphamail.api.auth.infrastructure.security.userdetails;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.alphamail.api.user.domain.entity.User;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class CustomUserDetails implements UserDetails {

	private final User user;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_USER"));
	}

	@Override
	public String getPassword() {
		return user.getHashedPassword();
	}

	@Override
	public String getUsername() {
		return user.getEmail();
	}

	public User getUser() {
		return user;
	}
}
