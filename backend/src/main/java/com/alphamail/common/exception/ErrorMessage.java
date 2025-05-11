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
	NO_MAIL_SELECTED("삭제할 메일을 선택해주세요"),
	SCHEDULE_TIME_INVALID("종료 시간은 시작 시간 이후여야 합니다"),
	SCHEDULE_DATE_INVALID("시작일은 종료일보다 빠르거나 같아야 합니다"),
	SCHEDULE_DATE_PAIR_REQUIRED("시작 날짜와 종료 날짜는 함께 제공되어야 합니다"),
	SCHEDULE_DATE_TOO_FAR("일정은 현재로부터 최대 20년 후까지만 설정할 수 있습니다"),
	NO_FOLDER_ID("폴더 아이디가 없습니다."),
	NO_TRASH_FOLDER("휴지통 폴더가 아닙니다."),

	CURRENT_PASSWORD_MISMATCH("현재 비밀번호가 일치하지 않습니다"),
	SAME_AS_CURRENT_PASSWORD("새 비밀번호는 현재 비밀번호와 달라야 합니다"),
	PASSWORD_EMPTY("비밀번호는 빈 값일 수 없습니다"),

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
	S3AMAZON_NOT_FOUND("S3에 해당 리소스를 찾을 수 없습니다."),

	//409
	EMAIL_ALREADY_EXISTS("이미 등록된 이메일입니다."),

	// 500 Internal Server Error 관련 오류
	INTERNAL_SERVER_ERROR("서버 내부 오류가 발생했습니다"),
	DATABASE_ERROR("데이터베이스 오류가 발생했습니다"),
	UNEXPECTED_ERROR("예상치 못한 오류가 발생했습니다");

	private final String message;
}
