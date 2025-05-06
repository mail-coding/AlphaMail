from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import uuid
import base64
import traceback
from services.email_processor import EmailProcessor
from services.vector_db import VectorDBHandler
from services.rag_engine import RAGEngine
import json

email_bp = Blueprint('email', __name__)

@email_bp.route('/sendmail', methods=['POST'])
def send_mail():
    try:
        thread_id = request.form.get('thread_id') or str(uuid.uuid4())
        print(f"[INFO] Processing email for thread_id: {thread_id}")
        
        email_content = request.form.get('email_content', '')

        print(f"[INFO] 처음 이메일 콘텐츠: {email_content}")
        if not email_content:
            return jsonify({'status': 'error', 'message': 'Email content is required'}), 400
            
        print(f"[DEBUG] Email content length: {len(email_content)}")
        print(f"[DEBUG] Email content sample: {email_content[:100]}")
        
        # Parse the email content
        parsed_email = EmailProcessor.parse_email_content(email_content)
        
        # Verify parsed email has content
        if not parsed_email["body"]:
            print(f"[WARNING] Parsed email body is empty for thread {thread_id}")
            return jsonify({'status': 'error', 'message': 'Failed to parse email content'}), 400

        # Debug the parsed email body
        print(f"[DEBUG] Parsed email body sample: {parsed_email['body'][:100]}")

        # Process attachments if any
        uploaded_files = request.files.getlist("attachments")
        attachments = []

        for file in uploaded_files:
            filename = secure_filename(file.filename)
            file_content = file.read()
            base64_content = base64.b64encode(file_content).decode("utf-8")
            attachments.append({
                "filename": filename,
                "content": base64_content
            })
            print(f"[DEBUG] Processed attachment: {filename}")

        processed_attachments = EmailProcessor.process_attachments(attachments)
        print(f"[DEBUG] Processed {len(processed_attachments)} attachments with text extraction")

        # Store the email data in the vector database
        VectorDBHandler.store_email_data(thread_id, parsed_email, processed_attachments)

        # Verify the data was stored by retrieving a sample
        sample = VectorDBHandler.retrieve_thread_data(thread_id, top_k=1)
        if not sample:
            print(f"[WARNING] Failed to store or retrieve data for thread {thread_id}")

        return jsonify({
            'status': 'success',
            'thread_id': thread_id,
            'message': 'Email and attachments processed and stored successfully'
        })
    except Exception as e:
        print(f"[ERROR] Error in /sendmail: {str(e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@email_bp.route('/summarizemail', methods=['POST'])
def summarize_mail():
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'Request body is required'}), 400
            
        thread_id = data.get('thread_id')
        if not thread_id:
            return jsonify({'status': 'error', 'message': 'Thread ID is required'}), 400
            
        print(f"[INFO] Generating summary for thread_id: {thread_id}")
        
        # Verify thread exists with debug endpoint first
        docs = VectorDBHandler.retrieve_thread_data(thread_id)
        if not docs:
            print(f"[WARNING] No documents found for thread {thread_id}")
            return jsonify({
                'status': 'error', 
                'message': f'No data found for thread ID: {thread_id}'
            }), 404
        
        print("[doc-debug22]", json.dumps(docs, ensure_ascii=False, indent=2))
        # Generate the summary
        summary = RAGEngine.generate_email_summary(thread_id)
        
        # Handle empty summary
        if not summary or summary.isspace():
            print(f"[ERROR] Empty summary generated for thread {thread_id}")
            return jsonify({
                'status': 'error',
                'thread_id': thread_id,
                'message': 'Failed to generate summary. Summary is empty.'
            }), 500
            
        return jsonify({
            'status': 'success', 
            'thread_id': thread_id, 
            'summary': summary
        })
    except Exception as e:
        print(f"[ERROR] Error in /summarizemail: {str(e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@email_bp.route('/debug/thread-data', methods=['GET'])
def debug_thread_data():
    thread_id = request.args.get('thread_id')
    if not thread_id:
        return jsonify({'status': 'error', 'message': 'thread_id is required'}), 400

    try:
        documents = VectorDBHandler.retrieve_thread_data(thread_id)
        
        # Enhanced debug info
        email_docs = [d for d in documents if d["metadata"].get("doc_type") == "email"]
        attachment_docs = [d for d in documents if d["metadata"].get("doc_type") == "attachment"]
        
        return jsonify({
            'status': 'success', 
            'thread_id': thread_id,
            'document_count': len(documents),
            'email_docs_count': len(email_docs),
            'attachment_docs_count': len(attachment_docs),
            'documents': documents
        })
    except Exception as e:
        print(f"[ERROR] Error in /debug/thread-data: {str(e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@email_bp.route('/writeemail', methods=['POST'])
def write_email():
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'Request body is required'}), 400
            
        thread_id = data.get('thread_id')
        template = data.get('template', {})
        
        if not thread_id:
            return jsonify({'status': 'error', 'message': 'Thread ID is required'}), 400
            
        print(f"[INFO] Generating email draft for thread_id: {thread_id}")
        
        # Verify thread exists
        docs = VectorDBHandler.retrieve_thread_data(thread_id)
        if not docs:
            print(f"[WARNING] No documents found for thread {thread_id}")
            return jsonify({
                'status': 'error', 
                'message': f'No data found for thread ID: {thread_id}'
            }), 404
            
        email_draft = RAGEngine.generate_email_draft(thread_id, template)
        
        # Handle empty draft
        if not email_draft or email_draft.isspace():
            print(f"[ERROR] Empty email draft generated for thread {thread_id}")
            return jsonify({
                'status': 'error',
                'thread_id': thread_id,
                'message': 'Failed to generate email draft. Draft is empty.'
            }), 500
            
        return jsonify({
            'status': 'success', 
            'thread_id': thread_id, 
            'email_draft': email_draft
        })
    except Exception as e:
        print(f"[ERROR] Error in /writeemail: {str(e)}")
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@email_bp.route('/debug/attachment-preview', methods=['POST'])
def debug_attachment_preview():
    from services.email_processor import EmailProcessor
    try:
        uploaded_file = request.files.get("file")
        if not uploaded_file:
            return jsonify({"status": "error", "message": "No file provided"}), 400

        filename = secure_filename(uploaded_file.filename)
        content = uploaded_file.read()
        ext = filename.split('.')[-1].lower()

        if ext == "pdf":
            text = EmailProcessor.extract_text_from_pdf(content)
        elif ext in ["xls", "xlsx"]:
            text = EmailProcessor.extract_text_from_excel(content)
        else:
            return jsonify({"status": "error", "message": f"Unsupported file type: {ext}"}), 400

        text = EmailProcessor.clean_text(text)
        return jsonify({
            "status": "success",
            "filename": filename,
            "text_preview": text[:1000],  # 최대 1000자 미리보기
            "text_length": len(text)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500
