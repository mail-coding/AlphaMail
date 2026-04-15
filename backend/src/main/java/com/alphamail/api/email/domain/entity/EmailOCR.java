package com.alphamail.api.email.domain.entity;

import com.alphamail.api.assistants.presentation.dto.client.TemporaryClientRequest;
import com.alphamail.api.email.infrastructure.dto.EmailOCRResponseDTO;

public record EmailOCR(
	String licenseNum,
	String address,
	String corpName,
	String representative,
	String businessType,
	String businessItem,
	Boolean success

) {

	public static EmailOCR from(EmailOCRResponseDTO emailOCRResponseDTO) {
		// 각 필드가 null이 아니고 빈 문자열도 아닌지 확인
		boolean hasLicenseNum = isNotNullOrEmpty(emailOCRResponseDTO.licenseNum());
		boolean hasAddress = isNotNullOrEmpty(emailOCRResponseDTO.address());
		boolean hasCorpName = isNotNullOrEmpty(emailOCRResponseDTO.corpName());
		boolean hasRepresentative = isNotNullOrEmpty(emailOCRResponseDTO.representative());
		boolean hasBusinessType = isNotNullOrEmpty(emailOCRResponseDTO.businessType());
		boolean hasBusinessItem = isNotNullOrEmpty(emailOCRResponseDTO.businessItem());

		// 하나라도 유효한 값이 있으면 true
		boolean success = hasLicenseNum || hasAddress || hasCorpName ||
			hasRepresentative || hasBusinessType || hasBusinessItem;

		return new EmailOCR(
			emailOCRResponseDTO.licenseNum(),
			emailOCRResponseDTO.address(),
			emailOCRResponseDTO.corpName(),
			emailOCRResponseDTO.representative(),
			emailOCRResponseDTO.businessType(),
			emailOCRResponseDTO.businessItem(),
			success
		);
	}

	// null이 아니고 빈 문자열이 아닌지 확인하는 헬퍼 메서드
	private static boolean isNotNullOrEmpty(String value) {
		return value != null && !value.trim().isEmpty();
	}

	public static TemporaryClientRequest toTemporaryClientRequest(EmailOCR emailOCR, Integer emailId,
		String emailSender, String businessLicense) {

		return new TemporaryClientRequest(
			emailOCR.licenseNum,
			emailOCR.address,
			emailOCR.corpName,
			emailOCR.representative,
			emailOCR.businessType,
			emailOCR.businessItem,
			emailSender,
			businessLicense,
			emailId
		);

	}
}
