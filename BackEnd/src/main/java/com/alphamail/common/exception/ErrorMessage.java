package com.alphamail.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorMessage {

	// 400 Bad Request 관련 오류 (BadRequestException)
	INVALID_INPUT("입력값이 유효하지 않습니다"),
	INVALID_PARAMETER("파라미터 값이 유효하지 않습니다"),
	MISSING_PARAMETER("필수 파라미터가 누락되었습니다"),
	VALIDATION_FAILED("유효성 검증에 실패했습니다"),
	INVALID_FILE_FORMAT("파일 형식이 올바르지 않습니다"),
	DUPLICATE_ENTRY("이미 존재하는 데이터입니다"),
	FILE_NOT_INCLUDED("파일이 포함되지 않았습니다"),
	FILE_UPLOAD_FAIL("파일 업로드 중 오류가 발생했습니다"),

	// 401 Unauthorized 관련 오류 (UnauthorizedException)
	UNAUTHORIZED("인증에 실패했습니다"),
	INVALID_TOKEN("유효하지 않은 토큰입니다"),
	EXPIRED_TOKEN("만료된 토큰입니다"),
	INVALID_CREDENTIALS("아이디 또는 비밀번호가 일치하지 않습니다"),
	BLACKLISTED_TOKEN("이미 로그아웃된 토큰입니다."),

	// 403 Forbidden 관련 오류 (ForbiddenException)
	FORBIDDEN("접근 권한이 없습니다"),
	ACCESS_DENIED("해당 리소스에 대한 접근 권한이 없습니다"),
	INSUFFICIENT_PERMISSION("작업을 수행할 권한이 없습니다"),

	// 404 Not Found 관련 오류 (NotFoundException)
	RESOURCE_NOT_FOUND("요청한 리소스를 찾을 수 없습니다"),
	MEMBER_NOT_FOUND("요청한 사용자를 찾을 수 없습니다"),

	// 500 Internal Server Error 관련 오류
	INTERNAL_SERVER_ERROR("서버 내부 오류가 발생했습니다"),
	DATABASE_ERROR("데이터베이스 오류가 발생했습니다"),
	UNEXPECTED_ERROR("예상치 못한 오류가 발생했습니다");

	private final String message;
	}
