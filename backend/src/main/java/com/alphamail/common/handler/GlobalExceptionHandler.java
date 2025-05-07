package com.alphamail.common.handler;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.alphamail.common.exception.BadRequestException;
import com.alphamail.common.exception.DuplicateResourceException;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.ForbiddenException;
import com.alphamail.common.exception.InternalServerException;
import com.alphamail.common.exception.NotFoundException;
import com.alphamail.common.exception.UnauthorizedException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
		MethodArgumentNotValidException ex,
		HttpHeaders headers,
		HttpStatusCode status,
		WebRequest request) {

		log.debug("유효성 검증 오류: {}", ex.getMessage());

		List<FieldErrorDetail> errors = ex.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(FieldErrorDetail::of)
			.toList();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(FailResponse.failWithFieldErrors(
				ErrorMessage.VALIDATION_FAILED.getMessage(),
				errors
			));
	}

	@Override
	protected ResponseEntity<Object> handleMissingServletRequestParameter(
		MissingServletRequestParameterException ex,
		HttpHeaders headers,
		HttpStatusCode status,
		WebRequest request) {

		log.debug("필수 파라미터 누락: {}", ex.getParameterName());

		String errorMessage = String.format(
			"%s: '%s'",
			ErrorMessage.MISSING_PARAMETER.getMessage(),
			ex.getParameterName()
		);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(FailResponse.fail(
				errorMessage
			));
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<FailResponse> handleBadRequestException(BadRequestException ex) {
		log.debug("잘못된 요청: {} ({})", ex.getMessage(), ex.getErrorMessage().name());

		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(
				ex.getMessage()
			));
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<FailResponse> handleUnauthorizedException(UnauthorizedException ex) {
		log.info("인증 실패: {} ({})", ex.getMessage(), ex.getErrorMessage().name());

		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(
				ex.getMessage()
			));
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<FailResponse> handleNotFoundException(NotFoundException ex) {
		log.debug("리소스를 찾을 수 없음: {} ({})", ex.getMessage(), ex.getErrorMessage().name());

		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(
				ex.getMessage()
			));

	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<FailResponse> handleDuplicateResourceException(DuplicateResourceException ex) {
		log.debug("리소스 중복: {} ({})", ex.getMessage(), ex.getErrorMessage().name());

		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(
				ex.getMessage()
			));
	}

	@ExceptionHandler(InternalServerException.class)
	public ResponseEntity<FailResponse> handleInternalServerException(InternalServerException ex) {
		log.error("서버 내부 오류: {} ({})", ex.getMessage(), ex.getErrorMessage().name(), ex);

		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(
				ex.getMessage()
			));
	}

	@ExceptionHandler(ForbiddenException.class)
	public ResponseEntity<FailResponse> handleForbiddenException(ForbiddenException ex) {
		log.info("접근 권한 없음: {} ({})", ex.getMessage(), ex.getErrorMessage().name());
		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(
				ex.getMessage()
			));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<FailResponse> handleUnexpectedException(Exception ex) {
		log.error("예상치 못한 오류: {} ({})", ex.getMessage(), ex.getClass().getSimpleName(), ex);
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(FailResponse.fail(
				ErrorMessage.INTERNAL_SERVER_ERROR.getMessage()
			));
	}
}
