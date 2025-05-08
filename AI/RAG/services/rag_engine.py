import requests
import os

# LM Studio가 제공하는 OpenAI API 호환 endpoint
LM_API_URL = "http://localhost:1234/v1/completions"  # 또는 /chat/completions
LM_MODEL_NAME = "Saxo/linkbricks-horizon-ai-korean-llama-3.1-sft-dpo-8b"  # 필요시 설정 (LM Studio UI에 따라 다름)

MAX_LENGTH = 800
MAX_ATTACH_SIZE = 10 * 1024 * 1024

class RAGEngine:

    @staticmethod
    def truncate_prompt(prompt: str, max_chars: int) -> str:
        return prompt[:max_chars]

    @staticmethod
    def generate_completion(prompt: str, max_tokens: int = 150):
        try:
            response = requests.post(
                LM_API_URL,
                headers={"Content-Type": "application/json"},
                json={
                    "model": LM_MODEL_NAME,
                    "prompt": prompt,
                    "max_tokens": max_tokens,
                    "temperature": 0.7,
                    "stop": None
                }
            )
            response.raise_for_status()
            return response.json()["choices"][0]["text"].strip()
        except Exception as e:
            print(f"[ERROR] LM API call failed: {str(e)}")
            return "LM Studio 응답 실패"

    @staticmethod
    def generate_email_summary(thread_id):
        try:
            from services.vector_db import VectorDBHandler
            email_docs = VectorDBHandler.retrieve_thread_data(thread_id)
            if not email_docs:
                print(f"[WARNING] No documents found for thread {thread_id}")
                return "No email content found to summarize."

            full_content = "\n".join(d["content"] for d in email_docs if d.get("content"))
            prompt = f"""
                    다음은 여러 사람들 간의 이메일 대화 스레드입니다.

                    당신의 임무는:
                    1. 대화의 핵심 주제를 파악하고,
                    2. 각 이메일의 주요 내용과 의도된 액션을 기반으로
                    3. 전체 대화 흐름을 한국어로 3~5줄 이내로 명확하고 간결하게 요약하는 것입니다.
                    4. 날짜, 인물, 요청사항 등 중요한 사실은 반드시 포함하세요.
                    5. 요약한 내용만 대답하세요.

                    이메일 내용:
                    {full_content}
                    """
            prompt = RAGEngine.truncate_prompt(prompt, 3000)  # char 기준

            return RAGEngine.generate_completion(prompt, max_tokens=300)

        except Exception as e:
            print(f"[ERROR] Error generating summary: {str(e)}")
            import traceback
            traceback.print_exc()
            return "Error generating email summary."

    @staticmethod
    async def generate_email_draft(template, attachment_text, user_prompt):
        try:
            template_str = "\n".join(f"{k}: {v}" for k, v in template.items() if v)
            user_prompt = user_prompt or ""
            attachment_text = attachment_text or ""

            combined_prompt = f"이메일 초안 생성:\n{template_str}\n{user_prompt}\n"
            combined_prompt = RAGEngine.truncate_prompt(combined_prompt, 2000)

            return RAGEngine.generate_completion(combined_prompt, max_tokens=300)

        except Exception as e:
            print(f"[ERROR] Error generating email draft: {str(e)}")
            import traceback
            traceback.print_exc()
            return "Error generating email draft."
