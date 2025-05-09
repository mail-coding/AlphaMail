from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from services.email_processor import EmailProcessor
from services.vector_db import VectorDBHandler
from services.rag_engine import RAGEngine
import json
from typing import List, Optional
import logging

# 로깅 설정
logger = logging.getLogger(__name__)

router = APIRouter()

MAX_LENGTH = 2048  # LLM 모델의 최대 토큰 수
MAX_ATTACH_SIZE = 10 * 1024 * 1024  # 최대 첨부파일 크기 (10MB)

@router.post("/sendmail")
async def send_mail(
    email_content: str = Form(...),
    thread_id: str = Form(...),
    user_id: str = Form(...),
):
    """이메일 내용을 파싱하고 벡터 DB에 저장하는 엔드포인트"""
    try:
        logger.debug(f"Email content sample: {email_content[:100]}")

        # 이메일 파싱
        parsed_email = EmailProcessor.parse_email_content(email_content)
        if not parsed_email["body"]:
            raise HTTPException(status_code=400, detail="Failed to parse email content")

        logger.debug(f"Parsed email body sample: {parsed_email['body'][:100]}")

        # 벡터 DB에 저장
        vector_id = user_id + thread_id
        VectorDBHandler.store_email_data(vector_id, parsed_email)

        return JSONResponse({
            'status': 'success',
            'thread_id': thread_id,
            'message': 'Email processed and stored successfully'
        })
    except Exception as e:
        logger.exception("Error in send_mail endpoint")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarizemail")
async def summarize_mail(
    thread_id: str = Form(...),
    user_id: str = Form(...),
):
    """이메일 스레드 요약 생성 엔드포인트"""
    try:
        vector_id = user_id + thread_id
        summary = RAGEngine.generate_email_summary(vector_id)
        
        if not summary or summary.isspace():
            raise HTTPException(status_code=500, detail="Failed to generate summary")

        return JSONResponse({
            'status': 'success',
            'vector_id': vector_id,
            'summary': summary
        })
    except Exception as e:
        logger.exception("Error in summarize_mail endpoint")
        raise HTTPException(status_code=500, detail=str(e))

# 이메일 작성
@router.post("/writeemail")
async def write_email(
    thread_id: str = Form(...),
    user_id: str = Form(...),
    template: Optional[str] = Form(None),
    attachments: Optional[List[UploadFile]] = File(default=[]),
    user_prompt: Optional[str] = Form(None)
):
    try:
        # 템플릿 파싱
        template_data = {}
        if template:
            try:
                template_data = json.loads(template)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid template JSON format.")
        
    
        # # 스레드 데이터 가져오기
        # vector_id = user_id + thread_id
        # docs = VectorDBHandler.retrieve_thread_data(vector_id)
        # if not docs:
        #     raise HTTPException(status_code=404, detail="No data found for thread ID")
        

        # 첨부파일 처리
        attachments_data = []
        for file in attachments:
            content = await file.read()
            if len(content) > MAX_ATTACH_SIZE:
                raise HTTPException(status_code=400, detail="Attachment exceeds the size limit")
                
            attachments_data.append({
                "filename": file.filename,
                "content": content
            })
            logger.debug(f"Processed attachment: {file.filename}")

  

        # 파일에서 텍스트 추출
        attachment_text = await EmailProcessor.process_attachments(attachments_data)
        
        # 이메일 초안 생성
        email_draft = await RAGEngine.generate_email_draft(template_data, attachment_text, user_prompt)
        
        if not email_draft or email_draft.isspace():
            raise HTTPException(status_code=500, detail="Failed to generate email draft. Draft is empty.")

        return JSONResponse({
            'status': 'success',
            'thread_id': thread_id,
            'email_draft': email_draft
        })
    except Exception as e:
        logger.exception("Error in write_email endpoint")
        raise HTTPException(status_code=500, sdetail=str(e))


# 디버깅용 엔드포인트
@router.get("/debug/thread-data")
async def debug_thread_data(thread_id: str):
    """스레드 데이터 확인용 디버깅 엔드포인트"""
    try:
        documents = VectorDBHandler.retrieve_thread_data(thread_id)
        email_docs = [d for d in documents if d["metadata"].get("doc_type") == "email"]
        attachment_docs = [d for d in documents if d["metadata"].get("doc_type") == "attachment"]
        
        return JSONResponse({
            'status': 'success',
            'thread_id': thread_id,
            'document_count': len(documents),
            'email_docs_count': len(email_docs),
            'attachment_docs_count': len(attachment_docs),
            'documents': documents
        })
    except Exception as e:
        logger.exception("Error in debug_thread_data endpoint")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/debug/attachment-preview")
async def debug_attachment_preview(file: UploadFile = File(...)):
    """첨부파일 텍스트 추출 결과 미리보기용 디버깅 엔드포인트"""
    try:
        filename = file.filename
        content = await file.read()
        ext = filename.split('.')[-1].lower()

        if ext == "pdf":
            text = await EmailProcessor.extract_text_from_pdf(content)
        elif ext in ["xls", "xlsx"]:
            text = await EmailProcessor.extract_text_from_excel(content)
        elif ext == "docx":
            text = await EmailProcessor.extract_text_from_word(content)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

        text = EmailProcessor.clean_text(text)
        return JSONResponse({
            "status": "success",
            "filename": filename,
            "text_preview": text[:1000],
            "text_length": len(text)
        })
    except Exception as e:
        logger.exception("Error in debug_attachment_preview endpoint")
        raise HTTPException(status_code=500, detail=str(e))