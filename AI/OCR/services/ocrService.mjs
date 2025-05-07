import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const OCR_SECRET = process.env.OCR_SECRET;
const OCR_API_URL = process.env.OCR_API_URL;

console.log('OCR_API_URL:', OCR_API_URL);
console.log('OCR_SECRET:', OCR_SECRET);

export function requestWithFile(fileStream, format, name, userId) {
  const message = {
    images: [{ format, name }],
    requestId: userId,
    timestamp: Date.now(),
    version: 'V2'
  };

  const formData = new FormData();
  formData.append('file', fileStream);
  formData.append('message', JSON.stringify(message));

  return axios.post(
    OCR_API_URL,
    formData,
    {
      headers: {
        'X-OCR-SECRET': OCR_SECRET,
        ...formData.getHeaders()
      }
    }
  );
}

export function mapBizLicenseToSimpleFormat(data) {
  const result = data?.images?.[0]?.bizLicense?.result || {};
  const getText = field => result?.[field]?.[0]?.text?.trim() || '';

  return {
    거래처명: getText('companyName') || getText('corpName'),
    대표자명: getText('repName'),
    '사업자 번호': getText('registerNumber'),
    업태: getText('bisType'),
    종목: getText('bisItem'),
    주소: getText('bisAddress') || getText('bisArea') || getText('headAddress')
  };
}
