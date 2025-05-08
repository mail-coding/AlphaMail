package com.alphamail.api.auth.infrastructure.security.userdetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.alphamail.api.user.domain.entity.User;
import com.alphamail.api.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException(email));

		return new CustomUserDetails(user);
	}

	public UserDetails loadUserById(Integer userId) {
		User user = userRepository.findById(userId);
		if (user == null) {
			throw new UsernameNotFoundException("사용자 ID를 찾을 수 없습니다: " + userId);
		}
		return new CustomUserDetails(user);

	}
}
