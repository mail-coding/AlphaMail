package com.alphamail.api.global.s3.repository;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.alphamail.api.global.s3.service.S3Service;
import com.alphamail.common.exception.ErrorMessage;
import com.alphamail.common.exception.NotFoundException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

	private final AmazonS3 s3Client;

	@Value("${aws.s3.bucket-name}")
	private String bucketName;

	@Override
	public InputStream downloadFile(String s3Key) {
		try {
			GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, s3Key);
			S3Object s3Object = s3Client.getObject(getObjectRequest);
			return s3Object.getObjectContent();
		} catch (AmazonServiceException e) {
			throw new NotFoundException(ErrorMessage.S3AMAZON_NOT_FOUND);
		} catch (Exception e) {
			throw new RuntimeException("S3 파일 다운로드 실패", e);
		}
	}

	@Override
	public String uploadFile(MultipartFile file) {
		try {
			String originalFilename = file.getOriginalFilename();
			String extension = "";

			if (originalFilename != null && originalFilename.contains(".")) {
				extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
			}

			String uniqueFileName = "sendAttachments/" + UUID.randomUUID() + extension;

			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(file.getSize());
			metadata.setContentType(file.getContentType());

			s3Client.putObject(bucketName, uniqueFileName, file.getInputStream(), metadata);

			return uniqueFileName;
		} catch (IOException e) {
			throw new RuntimeException("S3 파일 업로드 실패", e);
		}
	}

	@Override
	public List<String> uploadFiles(List<MultipartFile> files) {
		List<String> uploadedKeys = new ArrayList<>();

		for (MultipartFile file : files) {
			uploadedKeys.add(uploadFile(file)); // 위 단일 메서드 재사용
		}

		return uploadedKeys;
	}
}
