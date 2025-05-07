import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ocrRoutes from './routes/ocr.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 라우트 등록
app.use('/ocr', ocrRoutes);
// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
