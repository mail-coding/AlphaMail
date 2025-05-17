package com.alphamail.api.global.s3.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.alphamail.api.erp.presentation.dto.purchaseorder.PurchaseOrderImageResponse;
import com.alphamail.api.global.s3.service.S3Service;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/s3")
public class S3Controller {
	private final S3Service s3Service;

	@PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {
		// 이미지 타입 검증 (JPG와 PNG만 허용)
		if (image == null || image.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("이미지 파일이 없습니다.");
		}

		String contentType = image.getContentType();

		if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("이미지 파일이 PNG또는 JPEG여야합니다..");
		}

		try {
			// 이미지 저장 로직 호출
			String s3Key = s3Service.uploadFile(image);

			return ResponseEntity.status(HttpStatus.CREATED)
				.body(new PurchaseOrderImageResponse(s3Key));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Failed to upload image: " + e.getMessage());
		}
	}
}
