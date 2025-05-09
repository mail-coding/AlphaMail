import requests
import logging
from typing import Dict, List, Optional, Any, Union

# 로깅 설정
logger = logging.getLogger(__name__)

# LM Studio 설정
VLLM_API_URL = "http://localhost:8000/v1/completions"
VLLM_MODEL_NAME = "linkbricks-horizon-ai-korean-llama-3.1-sft-dpo-8b"

# 상수 설정
MAX_PROMPT_LENGTH = 3000
MAX_SUMMARY_TOKENS = 500
MAX_EMAIL_DRAFT_TOKENS = 500

class RAGEngine:


    @staticmethod
    def truncate_prompt(prompt: str, max_chars: int = MAX_PROMPT_LENGTH) -> str:
        return prompt[:max_chars]

    @staticmethod
    def generate_completion(prompt: str, max_tokens: int, temperature: float = 0.7) -> str:
        
        try:
            response = requests.post(
                VLLM_API_URL,
                headers={"Content-Type": "application/json"},
                json={
                    "model": VLLM_MODEL_NAME,
                    "prompt": prompt,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                    "repetition_penalty": 1.3,
                    "frequency_penalty": 0.7,
                    "presence_penalty": 0.7,
                    "stop": None
                }
            )
            response.raise_for_status()
            return response.json()["choices"][0]["text"].strip()
        except Exception as e:
            logger.error(f"API call failed: {str(e)}")
            return "모델 응답 실패"

    @staticmethod
    def generate_email_summary(vector_id: str) -> str:
        """이메일 스레드 요약 생성"""
        try:
            from services.vector_db import VectorDBHandler
            email_docs = VectorDBHandler.retrieve_thread_data(vector_id)
            email_docs.sort(key=lambda d: d["metadata"].get("chunk_index", 0))
            
            if not email_docs:
                return "요약할 이메일 내용이 없습니다."

            # 중복 제거
            unique_contents = list(dict.fromkeys(
                d["content"].strip() for d in email_docs if d.get("content")
            ))
            full_content = "\n".join(unique_contents)

            # 프롬프트 생성 및 요약
            prompt = f"""
                    다음 이메일 내용을 핵심 위주로 간결하게 한국어로 요약해 주세요. 
                    중복 내용은 제거하고, 중요한 요점과 결정 사항을 명확히 정리해 주세요.

                    이메일 내용:
                    {full_content}
                    """
            
            truncated_prompt = RAGEngine.truncate_prompt(prompt)
            return RAGEngine.generate_completion(truncated_prompt, max_tokens=MAX_SUMMARY_TOKENS)

        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            return "이메일 요약 생성 중 오류가 발생했습니다."

    @staticmethod
    async def generate_email_draft(
        template: Dict[str, str],
        attachment_text: Union[List[Dict[str, Any]], str],
        user_prompt: Optional[str] = None
    ) -> str:
        """이메일 초안 생성"""
        try:
            # 템플릿 정보 포맷팅
            template_str = "\n".join(f"{k}: {v}" for k, v in template.items() if v)
            
            # 첨부파일 텍스트 처리
            attachment_content = ""
            if isinstance(attachment_text, list):
                for att in attachment_text:
                    attachment_content += f"\n파일명: {att.get('filename', '')}\n"
                    attachment_content += f"내용: {att.get('text_content', '')[:300]}...\n"
            else:
                attachment_content = str(attachment_text)

            # 프롬프트 생성
            combined_prompt = f"""
            아래 내용을 참고해서 전문적이고 격식 있는 업무용 이메일 초안을 작성해 주세요.
            
            < 이메일 작성 템플릿 >
            {template_str}
            
            < 추가적인 사용자 요청 >
            {user_prompt or ""}
            
            < 첨부파일 내용 >
            {attachment_content}
            
            작성 지침:
            1. 템플릿 내용을 중심으로 구성할 것
            2. 사용자 요청을 반영하되, 첨부파일 내용은 필요한 경우에만 간단히 참조
            3. 간결하고 명확한 문장 사용
            4. 정중한 인사말과 맺음말 포함
            5. 반복적인 내용은 피하고 핵심만 작성
            """
            
            truncated_prompt = RAGEngine.truncate_prompt(combined_prompt)
            return RAGEngine.generate_completion(
                truncated_prompt, 
                max_tokens=MAX_EMAIL_DRAFT_TOKENS,
                temperature=0.5  # 이메일 초안은 더 결정적이고 안정적이게
            )

        except Exception as e:
            logger.error(f"Error generating email draft: {str(e)}")
            return "이메일 초안 생성 중 오류가 발생했습니다."