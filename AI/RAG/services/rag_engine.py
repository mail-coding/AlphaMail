from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration, pipeline
import torch
from services.vector_db import VectorDBHandler

# ✅ LLaMA 기반 한국어 특화 모델 로딩
device = 0 if torch.cuda.is_available() else -1
tokenizer = PreTrainedTokenizerFast.from_pretrained("digit82/kobart-summarization")
model = BartForConditionalGeneration.from_pretrained("digit82/kobart-summarization")
llm = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

class RAGEngine:
    @staticmethod
    def generate_email_summary(thread_id):
        try:
            docs = VectorDBHandler.retrieve_thread_data(thread_id)
            print("[doc-debug22]", docs)

            if not docs:
                print(f"[WARNING] No documents found for thread {thread_id}")
                return "No email content found to summarize."

            email_docs = [d for d in docs if d["metadata"].get("doc_type") == "email"]
            attachment_docs = [d for d in docs if d["metadata"].get("doc_type") == "attachment"]

            print("[email_docs]", email_docs)
            print("[attachment_docs]", attachment_docs)
            print(f"[DEBUG] Found {len(email_docs)} email docs and {len(attachment_docs)} attachment docs")

            email_content = "\n".join(d["content"] for d in email_docs)
            attachment_content = "\n".join(
                f"[{d['metadata'].get('filename', 'Unknown')}] {d['content']}" for d in attachment_docs
            )

            max_length = 900
            if len(tokenizer.tokenize(email_content)) > max_length // 2:
                print("[WARNING] Email content too long, truncating")
                tokens = tokenizer.tokenize(email_content)[:max_length // 2]
                email_content = tokenizer.convert_tokens_to_string(tokens)

            if len(tokenizer.tokenize(attachment_content)) > max_length // 2:
                print("[WARNING] Attachment content too long, truncating")
                tokens = tokenizer.tokenize(attachment_content)[:max_length // 2]
                attachment_content = tokenizer.convert_tokens_to_string(tokens)

            # ✅ T5-style prompt
            text_to_summarize = email_content
            if attachment_content.strip():
                text_to_summarize += f"\n{attachment_content}"

            prompt = f"{text_to_summarize}"

            prompt_tokens = tokenizer.tokenize(prompt)
            if len(prompt_tokens) > max_length:
                print(f"[WARNING] Prompt too long ({len(prompt_tokens)} tokens), truncating")
                prompt_tokens = prompt_tokens[:max_length]
                prompt = tokenizer.convert_tokens_to_string(prompt_tokens)

            print(f"[DEBUG] Prompt length: {len(prompt)} chars, ~{len(prompt_tokens)} tokens")

            # ✅ Generate summary (T5-friendly)
            result = llm(
                        prompt,
                        max_new_tokens=150,
                        do_sample=False,
                        repetition_penalty=1.3  # ✅ 반복 억제
                    )

            summary = result[0]["generated_text"].strip()
            print(f"[DEBUG] Generated summary length: {len(summary)}")
            return summary

        except Exception as e:
            print(f"[ERROR] Error generating summary: {str(e)}")
            import traceback
            traceback.print_exc()
            return "Error generating email summary. Please try again."

    

    @staticmethod
    def generate_email_draft(thread_id, template):
        try:
            content_req = template.get("pdf 내용 추출", "")
            format_req = template.get("작성 유형", "")
            
            # Get relevant documents
            docs = VectorDBHandler.retrieve_thread_data(thread_id, query=content_req, top_k=5)
            if not docs:
                print(f"[WARNING] No documents found for thread {thread_id}")
                return "No content found to draft email from."
                
            # Join content from documents
            context = "\n".join([d["content"] for d in docs])
            
            # Check if context exceeds model's context window
            max_length = 900  # Safe token count for kogpt2
            if len(tokenizer.tokenize(context)) > max_length // 2:
                print("[WARNING] Context too long, truncating")
                tokens = tokenizer.tokenize(context)[:max_length // 2]
                context = tokenizer.convert_tokens_to_string(tokens)
            
            # Format the prompt
            prompt = f"""
            아래 내용을 참고하여 이메일 초안을 작성해주세요.

            참고 내용:
            {context}

            요구사항:
            - 내용 중심: {content_req}
            - 형식: {format_req}

            작성된 이메일:
            """
            
            # Make sure the prompt is within token limits
            prompt_tokens = tokenizer.tokenize(prompt)
            if len(prompt_tokens) > max_length:
                print(f"[WARNING] Prompt too long ({len(prompt_tokens)} tokens), truncating")
                prompt_tokens = prompt_tokens[:max_length]
                prompt = tokenizer.convert_tokens_to_string(prompt_tokens)
            
            print(f"[DEBUG] Prompt length: {len(prompt)} chars, ~{len(prompt_tokens)} tokens")
            
            # Generate the email draft
            result = llm(prompt, max_new_tokens=200, do_sample=True, temperature=0.7,
                         pad_token_id=tokenizer.eos_token_id)
            
            # Extract the generated text and clean it
            draft = result[0]["generated_text"].replace(prompt, "").strip()
            
            print(f"[DEBUG] Generated draft length: {len(draft)}")
            return draft
            
        except Exception as e:
            print(f"[ERROR] Error generating email draft: {str(e)}")
            import traceback
            traceback.print_exc()
            return "Error generating email draft. Please try again."