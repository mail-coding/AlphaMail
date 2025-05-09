import io
import re
import traceback
from email import message_from_string
import email.policy
import pandas as pd
import PyPDF2
from docx import Document
import zipfile
import logging
from typing import List, Dict, Optional, Any, Union

# 로그 설정
logger = logging.getLogger(__name__)

class EmailProcessor:
    """이메일 콘텐츠 및 첨부파일 처리를 위한 유틸리티 클래스"""

    @staticmethod
    async def extract_text_from_pdf(pdf_content: bytes) -> str:
        """PDF 파일에서 텍스트 추출"""
        try:
            pdf_file = io.BytesIO(pdf_content)
            reader = PyPDF2.PdfReader(pdf_file)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            logger.debug(f"Extracted {len(text)} characters from PDF")
            print(text)
            return text
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            return ""

    @staticmethod
    async def extract_text_from_excel(excel_content: bytes) -> str:
        """Excel 파일에서 텍스트 추출 및 정리"""
        try:
            excel_file = io.BytesIO(excel_content)
            all_dfs = pd.read_excel(excel_file, sheet_name=None, header=None)

            cleaned_texts = []

            for sheet_name, df in all_dfs.items():
                # 빈 데이터 정리
                df = df.dropna(how='all', axis=1)
                df = df.loc[:, ~df.columns.astype(str).str.contains("Unnamed", case=False)]
                df = df.dropna(how='all')
                
                # 데이터가 없는 시트 건너뛰기
                if df.empty or df.shape[0] == 0 or df.shape[1] == 0:
                    continue
                
                # 실제 데이터 경계 찾기
                first_row, last_row = 0, df.shape[0] - 1
                first_col, last_col = 0, df.shape[1] - 1
                
                # 데이터 범위 내 유효한 영역만 자르기
                for i, row in df.iterrows():
                    if row.notna().any():
                        first_row = i
                        break
                
                for i in range(df.shape[0] - 1, -1, -1):
                    if df.iloc[i].notna().any():
                        last_row = i
                        break
                
                for j in range(df.shape[1]):
                    if df.iloc[:, j].notna().any():
                        first_col = j
                        break
                
                for j in range(df.shape[1] - 1, -1, -1):
                    if df.iloc[:, j].notna().any():
                        last_col = j
                        break
                
                # 실제 데이터 영역만 자르기
                df = df.iloc[first_row:last_row+1, first_col:last_col+1]
                df = df.fillna('')
                
                sheet_text = f"Sheet: {sheet_name}\n{df.to_string(index=False)}"
                cleaned_texts.append(sheet_text)

            final_text = "\n\n".join(cleaned_texts)
            print(final_text)
            logger.debug(f"Extracted {len(final_text)} characters from Excel file")
            return final_text

        except Exception as e:
            logger.error(f"Excel extraction error: {e}")
            return ""
        
    @staticmethod
    async def extract_text_from_word(word_content: bytes) -> str:
        """Word 문서에서 텍스트 추출"""
        try:
            # ZIP 형식 검증
            if not word_content.startswith(b'PK'):
                raise zipfile.BadZipFile("Not a valid .docx file")

            word_file = io.BytesIO(word_content)
            
            # docx 형식 검증
            with zipfile.ZipFile(word_file) as docx_zip:
                if "word/document.xml" not in docx_zip.namelist():
                    raise zipfile.BadZipFile("Not a valid .docx file")

            # 다시 처음부터 읽기
            word_file.seek(0)
            doc = Document(word_file)
            text = "\n".join([para.text for para in doc.paragraphs if para.text.strip() != ""])

            print(text)
            logger.debug(f"Extracted {len(text)} characters from Word document")
            return text
        except zipfile.BadZipFile:
            logger.error("Not a valid .docx file or file is corrupted")
            return "The uploaded file is not a valid .docx file or it is corrupted."
        except Exception as e:
            logger.error(f"Word extraction error: {e}")
            return "Error extracting text from Word file."
            
    @staticmethod
    def parse_email_content(email_content: Union[str, bytes]) -> Dict[str, Any]:
        """이메일 내용을 파싱하여 메타데이터와 본문으로 분리"""
        try:
            # 바이트 문자열인 경우 디코딩
            if isinstance(email_content, bytes):
                email_content = email_content.decode('utf-8', errors='replace')         
        
            # 메타데이터 추출
            msg = message_from_string(email_content, policy=email.policy.default)
            metadata = {
                "subject": msg.get("Subject", ""),
                "sender": msg.get("From", ""),
                "receiver": msg.get("To", ""),
                "timestamp": msg.get("Date", "")
            }
            
            logger.debug(f"Email metadata: {metadata}")

            # 본문 추출
            body = ""
            if msg.is_multipart():
                for part in msg.iter_parts():
                    if part.get_content_type() == "text/plain":
                        body += part.get_content()
            else:
                if msg.get_content_type() == "text/plain":
                    body = msg.get_content()
                    
            # 본문이 비어있을 경우 대체 방법 시도
            if not body:
                logger.warning("No text/plain content found, trying alternative extraction")
                try:
                    if msg.is_multipart():
                        body = msg.get_payload(0).get_content() if msg.get_payload() else ""
                    else:
                        body = msg.get_payload() or ""
                except Exception as inner_e:
                    logger.error(f"Failed to extract body content: {inner_e}")
                    
            # 본문이 여전히 비어있을 경우 원본 사용
            if not body.strip() and email_content.strip():
                logger.warning("Email body is empty, using raw content as fallback")
                body = email_content
                
            # 본문 정리
            body = EmailProcessor.clean_text(body)
                
            logger.debug(f"Email body length: {len(body)}")
            logger.debug(f"Sample body content: {body[:100]}...")
            
            return {"metadata": metadata, "body": body}
        except Exception as e:
            logger.error(f"Email parsing error: {e}")
            # 실패시 기본값 반환
            return {
                "metadata": {"subject": "", "sender": "", "receiver": "", "timestamp": ""}, 
                "body": EmailProcessor.clean_text(email_content)
            }
    
    @staticmethod
    def clean_text(text: Optional[Union[str, bytes]]) -> str:
        """텍스트 정리 및 인코딩 처리"""
        if not text:
            return ""
        
        # 문자열로 변환
        if isinstance(text, bytes):
            try:
                text = text.decode('utf-8', errors='replace')
            except:
                text = str(text)
            
        # 유니코드 이스케이프 디코딩 시도
        try:
            if re.search(r'u[0-9a-fA-F]{4}', text):
                text = text.encode('latin1').decode('unicode_escape')
        except Exception as e:
            logger.warning(f"Failed to decode unicode_escape: {e}")
        
        # 텍스트 정리
        cleaned = re.sub(r'\\', '', text).replace('\r\n', '\n').strip()
        logger.debug(f"Cleaned text length: {len(cleaned)}")
        
        return cleaned

    @staticmethod
    async def process_attachments(attachments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """첨부파일을 처리하여 텍스트 추출"""
        processed = []
        for idx, att in enumerate(attachments):
            try:
                logger.debug(f"Processing attachment {idx+1}: {att['filename']}")
                content = att["content"]
                ext = att["filename"].split(".")[-1].lower() if "." in att["filename"] else ""
                
                text = ""
                # 파일 유형에 따른 텍스트 추출
                extractors = {
                    "pdf": EmailProcessor.extract_text_from_pdf,
                    "xlsx": EmailProcessor.extract_text_from_excel,
                    "xls": EmailProcessor.extract_text_from_excel,
                    "docx": EmailProcessor.extract_text_from_word
                }
                
                extractor = extractors.get(ext)
                if extractor:
                    text = await extractor(content)
                else:
                    logger.warning(f"Unsupported file type: {ext}")
                
                text = EmailProcessor.clean_text(text)
                
                if text:
                    processed.append({
                        "filename": att["filename"], 
                        "file_type": ext, 
                        "text_content": text
                    })
                else:
                    logger.warning(f"No text extracted from {att['filename']}")
            except Exception as e:
                logger.error(f"Failed to process attachment {idx+1}: {e}")
                
        logger.debug(f"Successfully processed {len(processed)} attachments")
        return processed