package com.alphamail.api.erp.presentation.dto.client;

import java.time.LocalDateTime;

import org.springframework.cglib.core.Local;

import com.alphamail.api.erp.domain.entity.Client;

public record GetClientResponse(
	Integer id,
	String corpName,
	String representative,
	String licenseNum,
	String phoneNum,
	String email,
	String address,
	String businessType,
	String businessItem,
	String businessLicenseUrl,
	String businessLicenseName,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {

	public static GetClientResponse from(Client client) {
		return new GetClientResponse(
			client.getClientId(),
			client.getCorpName(),
			client.getRepresentative(),
			client.getLicenseNum(),
			client.getPhoneNum(),
			client.getEmail(),
			client.getAddress(),
			client.getBusinessType(),
			client.getBusinessItem(),
			client.getBusinessLicense(),
			client.getBusinessLicenseName(),
			client.getCreatedAt(),
			client.getUpdatedAt()
		);
	}
}
