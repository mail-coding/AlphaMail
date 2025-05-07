package com.alphamail.api.erp.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.erp.application.dto.RegistResultDto;
import com.alphamail.api.erp.application.usecase.quote.GetQuoteUseCase;
import com.alphamail.api.erp.application.usecase.quote.RegistQuoteUseCase;
import com.alphamail.api.erp.presentation.dto.quote.GetQuoteResponse;
import com.alphamail.api.erp.presentation.dto.quote.RegistQuoteRequest;
import com.alphamail.api.global.dto.RegistErpResponse;
import com.alphamail.common.constants.ApiPaths;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiPaths.ERP_BASE_API)
public class QuoteController {

	private final GetQuoteUseCase getQuoteUseCase;
	private final RegistQuoteUseCase registQuoteUseCase;

	@GetMapping(ApiPaths.QUOTES_BASE_API + "/{quoteId}")
	public ResponseEntity<GetQuoteResponse> getQuote(@PathVariable Integer quoteId) {
		GetQuoteResponse response = getQuoteUseCase.execute(quoteId);

		if (response == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		return ResponseEntity.ok(response);
	}

	@PostMapping(ApiPaths.QUOTES_BASE_API)
	public ResponseEntity<?> regist(@RequestBody RegistQuoteRequest request) {
		RegistResultDto result = registQuoteUseCase.execute(request);

		if (!result.isDone()) {
			if (result.status() == RegistResultDto.Status.BAD_REQUEST) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			} else if (result.status() == RegistResultDto.Status.SAVE_FAILED) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			}
		}

		return ResponseEntity.status(HttpStatus.CREATED).body(new RegistErpResponse(result.id()));
	}
}
