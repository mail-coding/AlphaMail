from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from services.email_processor import EmailProcessor
from services.vector_db import VectorDBHandler
from services.rag_engine import RAGEngine
import uuid
import base64
import traceback
import json
from typing import List, Optional

router = APIRouter()

# 모든 메일에 대해서 db벡터 저장용
@router.post("/sendmail")
async def send_mail(
    email_content: str = Form(...),
    thread_id: Optional[str] = Form(None),
    attachments: List[UploadFile] = File(default=[])
):
    try:
        thread_id = thread_id
        print(f"[INFO] Processing email for thread_id: {thread_id}")
        print(f"[DEBUG] Email content length: {len(email_content)}")
        print(f"[DEBUG] Email content sample: {email_content[:100]}")


        # 메일에서 메타 데이터 / 본문 추출, 한국어로 파싱
        parsed_email = EmailProcessor.parse_email_content(email_content)
        if not parsed_email["body"]:
            raise HTTPException(status_code=400, detail="Failed to parse email content")

        print(f"[DEBUG] Parsed email body sample: {parsed_email['body'][:100]}")

        # 첨부파일 처리
        attachments_data = []
        for file in attachments:
            filename = file.filename
            content = await file.read()
            base64_content = base64.b64encode(content).decode("utf-8")
            attachments_data.append({
                "filename": filename,
                "content": base64_content
            })
            print(f"[DEBUG] Processed attachment: {filename}")

        # 파일 유형에 따라 파일 이름, 유형, 내용 처리
        processed_attachments = EmailProcessor.process_attachments(attachments_data)


        # 벡터 db에 스레드 id 별로 메일 내용 저장
        VectorDBHandler.store_email_data(thread_id, parsed_email, processed_attachments)


        return JSONResponse({
            'status': 'success',
            'thread_id': thread_id,
            'message': 'Email and attachments processed and stored successfully'
        })
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# 이메일 요약
@router.post("/summarizemail")
async def summarize_mail(request: Request):
    try:
        data = await request.json()
        thread_id = data.get('thread_id')
        if not thread_id:
            raise HTTPException(status_code=400, detail="Thread ID is required")

        print(f"[INFO] Generating summary for thread_id: {thread_id}")

        docs = VectorDBHandler.retrieve_thread_data(thread_id)
        if not docs:
            raise HTTPException(status_code=404, detail="No data found for thread ID")

        print("[doc-debug22]", json.dumps(docs, ensure_ascii=False, indent=2))
        summary = RAGEngine.generate_email_summary(thread_id)
        if not summary or summary.isspace():
            raise HTTPException(status_code=500, detail="Failed to generate summary. Summary is empty.")

        return JSONResponse({
            'status': 'success',
            'thread_id': thread_id,
            'summary': summary
        })
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/writeemail")
async def write_email(request: Request):
    try:
        data = await request.json()
        thread_id = data.get('thread_id')
        template = data.get('template', {})

        if not thread_id:
            raise HTTPException(status_code=400, detail="Thread ID is required")

        print(f"[INFO] Generating email draft for thread_id: {thread_id}")
        docs = VectorDBHandler.retrieve_thread_data(thread_id)
        if not docs:
            raise HTTPException(status_code=404, detail="No data found for thread ID")

        email_draft = RAGEngine.generate_email_draft(thread_id, template)
        if not email_draft or email_draft.isspace():
            raise HTTPException(status_code=500, detail="Failed to generate email draft. Draft is empty.")

        return JSONResponse({
            'status': 'success',
            'thread_id': thread_id,
            'email_draft': email_draft
        })
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# 디버깅용 - 스레드 별로 데이터 확인
@router.get("/debug/thread-data")
async def debug_thread_data(thread_id: str):
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
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
# 디버깅용 - 첨부파일 제대로 변환되었는지 확인
@router.post("/debug/attachment-preview")
async def debug_attachment_preview(file: UploadFile = File(...)):
    try:
        filename = file.filename
        content = await file.read()
        ext = filename.split('.')[-1].lower()

        if ext == "pdf":
            text = EmailProcessor.extract_text_from_pdf(content)
        elif ext in ["xls", "xlsx"]:
            text = EmailProcessor.extract_text_from_excel(content)
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
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
