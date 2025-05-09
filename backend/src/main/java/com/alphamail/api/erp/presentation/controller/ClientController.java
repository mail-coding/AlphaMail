package com.alphamail.api.erp.presentation.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alphamail.api.erp.application.dto.RegistResultDto;
import com.alphamail.api.erp.application.usecase.client.GetAllClientsUseCase;
import com.alphamail.api.erp.application.usecase.client.GetClientUseCase;
import com.alphamail.api.erp.application.usecase.client.ModifyClientUseCase;
import com.alphamail.api.erp.application.usecase.client.RegistClientUseCase;
import com.alphamail.api.erp.application.usecase.client.RemoveClientUseCase;
import com.alphamail.api.erp.presentation.dto.client.GetAllClientsResponse;
import com.alphamail.api.erp.presentation.dto.client.GetClientResponse;
import com.alphamail.api.erp.presentation.dto.client.RegistClientRequest;
import com.alphamail.api.global.dto.GetPageResponse;
import com.alphamail.api.global.dto.RegistErpResponse;
import com.alphamail.common.constants.ApiPaths;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiPaths.ERP_BASE_API)
public class ClientController {

	private final GetAllClientsUseCase getAllClientsUseCase;
	private final GetClientUseCase getClientUseCase;
	private final RegistClientUseCase registClientUseCase;
	private final ModifyClientUseCase modifyClientUseCase;
	private final RemoveClientUseCase removeClientUseCase;

	@GetMapping(ApiPaths.COMPANIES_BASE_API + ApiPaths.CLIENTS_BASE_API)
	public ResponseEntity<GetPageResponse<GetAllClientsResponse>> getAll(
		@PathVariable Integer companyId,
		@RequestParam(name = "query", required = false) String query,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		Pageable pageable = PageRequest.of(page, size);

		GetPageResponse<GetAllClientsResponse> response = getAllClientsUseCase.execute(companyId, query, pageable);

		return ResponseEntity.ok(response);
	}

	@GetMapping(ApiPaths.CLIENTS_BASE_API + "/{clientId}")
	public ResponseEntity<GetClientResponse> get(@PathVariable Integer clientId) {
		GetClientResponse response = getClientUseCase.execute(clientId);

		if (response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

		return ResponseEntity.ok(response);
	}

	@PostMapping(ApiPaths.CLIENTS_BASE_API)
	public ResponseEntity<?> regist(@RequestBody RegistClientRequest request) {
		RegistResultDto result = registClientUseCase.execute(request);

		if (!result.isDone()) {
			if (result.status() == RegistResultDto.Status.BAD_REQUEST) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			} else if (result.status() == RegistResultDto.Status.DUPLICATED) {
				return ResponseEntity.status(HttpStatus.CONFLICT).build();
			} else if (result.status() == RegistResultDto.Status.SAVE_FAILED) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			}
		}

		return ResponseEntity.status(HttpStatus.CREATED).body(new RegistErpResponse(result.id()));
	}

	@PutMapping(ApiPaths.CLIENTS_BASE_API + "/{clientId}")
	public ResponseEntity<?> modify(@PathVariable Integer clientId, @RequestBody RegistClientRequest request) {
		RegistResultDto result = modifyClientUseCase.execute(clientId, request);

		if (!result.isDone()) {
			if (result.status() == RegistResultDto.Status.NOT_FOUND) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			} else if (result.status() == RegistResultDto.Status.SAVE_FAILED) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
			}
		}

		return ResponseEntity.ok(new RegistErpResponse(result.id()));
	}

	@DeleteMapping(ApiPaths.CLIENTS_BASE_API + "/{clientId}")
	public ResponseEntity<Void> remove(@PathVariable Integer clientId) {
		boolean deleted = removeClientUseCase.execute(clientId);

		return deleted ? ResponseEntity.noContent().build() :
			ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}
}
