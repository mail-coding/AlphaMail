package com.alphamail.api.erp.domain.entity;

import java.time.LocalDateTime;

import com.alphamail.api.erp.presentation.dto.client.RegistClientRequest;
import com.alphamail.api.organization.domain.entity.Company;
import com.alphamail.api.organization.domain.entity.Group;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Client {
	private Integer clientId;
	private String licenseNum;
	private String address;
	private String corpName;
	private String representative;
	private String businessType;
	private String businessItem;
	private String email;
	private String phoneNum;
	private String businessLicense;
	private String businessLicenseName;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private LocalDateTime deletedAt;
	private Company company;
	private Group group;

	public static Client create(RegistClientRequest request, Company company, Group group) {
		return Client.builder()
			.licenseNum(request.licenseNum())
			.address(request.address())
			.corpName(request.corpName())
			.representative(request.representative())
			.businessType(request.businessType())
			.businessItem(request.businessItem())
			.email(request.email())
			.phoneNum(request.phoneNum())
			.businessLicense(request.businessLicenseUrl())
			.businessLicenseName(request.businessLicenseName())
			.company(company)
			.group(group)
			.build();
	}

	public void update(RegistClientRequest request) {
		if (request.licenseNum() != null) {
			this.licenseNum = request.licenseNum();
		}

		if (request.address() != null) {
			this.address = request.address();
		}

		if (request.corpName() != null) {
			this.corpName = request.corpName();
		}

		if (request.representative() != null) {
			this.representative = request.representative();
		}

		if (request.businessType() != null) {
			this.businessType = request.businessType();
		}

		if (request.businessItem() != null) {
			this.businessItem = request.businessItem();
		}

		if (request.email() != null) {
			this.email = request.email();
		}

		if (request.phoneNum() != null) {
			this.phoneNum = request.phoneNum();
		}

		if (request.businessLicenseUrl() != null) {
			this.businessLicense = request.businessLicenseUrl();
		}
	}
}
