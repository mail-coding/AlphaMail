package com.alphamail.api.erp.presentation.dto.client;

public record RegistClientRequest(
	Integer companyId,
	Integer groupId,
	String licenseNum,
	String address,
	String corpName,
	String representative,
	String businessType,
	String businessItem,
	String email,
	String phoneNum,
	String businessLicenseUrl,
	String businessLicenseName
) {
}
