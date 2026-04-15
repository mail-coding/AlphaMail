import { api } from '@/shared/lib/axiosInstance';

export interface S3UploadResponse {
  s3Key: string;
}

export const s3Service = {
  // 이미지 업로드
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<S3UploadResponse>('/api/s3/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(response);
    if (response.status !== 201) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    return response.data.s3Key;
  },

  // 이미지 삭제
  deleteImage: async (s3Key: string): Promise<void> => {
    await api.delete(`/api/s3/images/${s3Key}`);
  }
}; 