import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { requestWithFile, mapBizLicenseToSimpleFormat } from '../services/ocrService.mjs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 내부 큐와 상태 관리
const queue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const { filePath, format, name, userId, res } = queue.shift();

  try {
    const fileStream = fs.createReadStream(filePath);
    const response = await requestWithFile(fileStream, format, name, userId);
    fs.unlinkSync(filePath); // cleanup

    if (response.status === 200) {
      const parsed = mapBizLicenseToSimpleFormat(response.data);
      console.log(parsed);
      res.json(parsed);
    } else {
      res.status(500).json({
        error: 'Unexpected status code',
        detail: response.status
      });
    }
  } catch (e) {
    res.status(500).json({
      error: 'OCR 처리 실패',
      detail: e.response ? e.response.data : e.message
    });
  } finally {
    isProcessing = false;
    processQueue(); // 다음 작업으로 넘어가기
  }
};

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  const format = file.mimetype.split('/')[1];
  const name = file.originalname;
  const userId = req.body.userId;

  queue.push({
    filePath: file.path,
    format,
    name,
    userId,
    res
  });

  processQueue(); // 큐 실행 트리거
});

export default router;
