import base64
import io
import re
import traceback
from email import message_from_string
import email.policy
import pandas as pd
import PyPDF2

class EmailProcessor:

    # pdf에서 텍스트 추출
    @staticmethod
    def extract_text_from_pdf(pdf_content: bytes) -> str:
        try:
            pdf_file = io.BytesIO(pdf_content)
            reader = PyPDF2.PdfReader(pdf_file)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            print(f"[DEBUG] Extracted {len(text)} characters from PDF")
            return text
        except Exception as e:
            print(f"[ERROR] PDF extraction error: {e}")
            traceback.print_exc()
            return ""

    # 엑셀에서 텍스트 추출
    @staticmethod
    def extract_text_from_excel(excel_content: bytes) -> str:
        try:
            excel_file = io.BytesIO(excel_content)
            all_dfs = pd.read_excel(excel_file, sheet_name=None, header=None)  # 헤더 자동 추론 방지

            cleaned_texts = []

            for sheet_name, df in all_dfs.items():
                # Drop unnamed columns (e.g., NaN or default named)
                df = df.dropna(how='all', axis=1)  # 전체 NaN 컬럼 제거
                df = df.loc[:, ~df.columns.astype(str).str.contains("Unnamed", case=False)]

                # Drop completely empty rows
                df = df.dropna(how='all')

                # Only include sheet if it has meaningful data
                if df.shape[0] == 0 or df.shape[1] == 0:
                    continue

                # Convert dataframe to string
                sheet_text = f"Sheet: {sheet_name}\n{df.to_string(index=False)}"
                cleaned_texts.append(sheet_text)

            final_text = "\n\n".join(cleaned_texts)
            print(f"[DEBUG] Extracted {len(final_text)} characters from Excel file (cleaned)")
            return final_text

        except Exception as e:
            print(f"[ERROR] Excel extraction error: {e}")
            traceback.print_exc()
            return ""

    # 이메일 내용 메타 데이터/ 내용 구분 및 파싱
    ## 실제 들어오는 이메일 유형에 따라 아래 변경하기
    @staticmethod
    def parse_email_content(email_content: str) -> dict:
        try:

            # 이메일 한글로 인코딩
            if isinstance(email_content, bytes):
                email_content = email_content.decode('utf-8', errors='replace')         
        
            # meta 데이터 추출
            msg = message_from_string(email_content, policy=email.policy.default)
            metadata = {
                "subject": msg.get("Subject", ""),
                "from": msg.get("From", ""),
                "to": msg.get("To", ""),
                "date": msg.get("Date", "")
            }
            
            # Print metadata for debugging
            print(f"[DEBUG] Email metadata: {metadata}")


            # 메일 바디 내용 추출
            body = ""
            if msg.is_multipart():
                for part in msg.iter_parts():
                    if part.get_content_type() == "text/plain":
                        body += part.get_content()
            else:
                if msg.get_content_type() == "text/plain":
                    body = msg.get_content()
                    
            # 바디가 비어있을 경우 첫번째 content 가져오기
            if not body:
                print("[WARNING] No text/plain content found, trying to extract content directly")
                try:
                    if msg.is_multipart():
                        # Try to get first part content
                        body = msg.get_payload(0).get_content() if msg.get_payload() else ""
                    else:
                        body = msg.get_payload() or ""
                except Exception as inner_e:
                    print(f"[ERROR] Failed to extract body content: {inner_e}")
                    
            # 바디가 비어있을 경우 원본 저장
            if not body.strip() and email_content.strip():
                print("[WARNING] Email body is empty, using raw content as fallback")
                body = email_content
                
            # 바디가 비어있을 경우 주제 저장
            if not body.strip():
                print("[WARNING] Email body is empty, using subject as fallback")
                body = f"Subject: {metadata['subject']}"
                
            # 바디 유니코드 디코딩 처리
            body = EmailProcessor.clean_text(body)
                
            print(f"[DEBUG] Email body length: {len(body)}")
            print(f"[DEBUG] Sample body content: {body[:100]}...")
            return {"metadata": metadata, "body": body}
        except Exception as e:
            print(f"[ERROR] Email parsing error: {e}")
            traceback.print_exc()
            # 메타 데이터 / body 별로 전달
            return {
                "metadata": {"subject": "", "from": "", "to": "", "date": ""}, 
                "body": EmailProcessor.clean_text(email_content)
            }
    
    # 텍스트 깔끔하게 정리
    @staticmethod
    def clean_text(text: str) -> str:
        if not text:
            return ""
            
        # 유니코드 이스케이프로 보이는 문자열이면 디코딩 시도
        try:
            if re.search(r'u[0-9a-fA-F]{4}', text):  # e.g., uc548
                text = text.encode('latin1').decode('unicode_escape')
        except Exception as e:
            print(f"[WARNING] Failed to decode unicode_escape: {e}")
        
        # 텍스트 정리 (\\ 제거, 줄바꿈 정리 )
        cleaned = re.sub(r'\\', '', text).replace('\r\n', '\n').strip()
        print(f"[DEBUG] Cleaned text length: {len(cleaned)}")
        print(f"[DEBUG] Sample cleaned text: {cleaned[:100]}...")
        return cleaned


    # 첨부파일 처리
    @staticmethod
    def process_attachments(attachments):
        processed = []

        for idx, att in enumerate(attachments):
            try:
                print(f"[DEBUG] Processing attachment {idx+1}: {att['filename']}")
                # content = base64.b64decode(att["content"])

                content = att["content"]
                ext = att["filename"].split(".")[-1].lower() if "." in att["filename"] else ""
                
                text = ""
                if ext == "pdf":
                    text = EmailProcessor.extract_text_from_pdf(content)
                elif ext in ["xlsx", "xls"]:
                    text = EmailProcessor.extract_text_from_excel(content)
                else:
                    print(f"[WARNING] Unsupported file type: {ext}")
                    
                text = EmailProcessor.clean_text(text)
                
                if text:
                    processed.append({
                        "filename": att["filename"], 
                        "file_type": ext, 
                        "text_content": text
                    })
                else:
                    print(f"[WARNING] No text extracted from {att['filename']}")
            except Exception as e:
                print(f"[ERROR] Failed to process attachment {idx+1}: {e}")
                traceback.print_exc()
                
        print(f"[DEBUG] Successfully processed {len(processed)} attachments")
        return processed