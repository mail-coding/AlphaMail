import anthropic
import logging
import os
from typing import Dict, List, Optional, Any, Union

logger = logging.getLogger(__name__)

# Anthropic 설정
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219"

# 토큰 수 제한
MAX_PROMPT_LENGTH = 8000  # 증가
MAX_SUMMARY_TOKENS = 800  # 증가
MAX_EMAIL_DRAFT_TOKENS = 500

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

class RAGEngine:

    @staticmethod
    def truncate_prompt(prompt: str, max_chars: int = MAX_PROMPT_LENGTH) -> str:
        return prompt[:max_chars]

    @staticmethod
    def generate_completion(prompt: str, max_tokens: int, temperature: float = 0.7) -> str:
        try:
            response = client.messages.create(
                model=ANTHROPIC_MODEL,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text.strip()
        except Exception as e:
            logger.error(f"Claude API 호출 실패: {str(e)}")
            return "모델 응답 실패"

    @staticmethod
    def generate_email_summary(vector_id: str) -> str:
        try:
            from services.vector_db import VectorDBHandler
            email_docs = VectorDBHandler.retrieve_thread_data(vector_id)
            email_docs.sort(key=lambda d: d["metadata"].get("chunk_index", 0))

            if not email_docs:
                return "요약할 이메일 내용이 없습니다."

            unique_contents = list(dict.fromkeys(
                d["content"].strip() for d in email_docs if d.get("content")
            ))
            full_content = "\n".join(unique_contents)

            prompt = f"""
다음 이메일 스레드를 분석하여 고품질의 한국어 요약을 작성해주세요.

**요약 작성 규칙:**
1. 핵심 내용을 우선순위에 따라 정리
2. 중요한 결정사항과 액션 아이템을 명확히 구분
3. 구체적인 수치, 날짜, 기한이 있다면 정확히 포함
4. 참여자들의 주요 의견이나 입장 차이가 있다면 명시
5. 다음 단계나 후속 조치가 필요한 사항을 별도 표시

**출력 형식:**
📋 **주요 내용**
[핵심 안건과 논의사항을 2-3개 문장으로 요약]

⚡ **결정사항 및 할일**  
- [구체적인 결정사항이나 할일 목록]
- [담당자나 마감일이 언급되었다면 포함]

💡 **후속 조치**
[추가로 필요한 조치사항이나 주의사항]

**이메일 내용:**
{full_content}

위 형식에 따라 실무진이 바로 활용할 수 있는 명확하고 구체적인 요약을 작성해주세요.
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
        try:
            template_str = "\n".join(f"{k}: {v}" for k, v in template.items() if v)

            attachment_content = ""
            if isinstance(attachment_text, list):
                for att in attachment_text:
                    attachment_content += f"\n파일명: {att.get('filename', '')}\n"
                    attachment_content += f"내용: {att.get('text_content', '')[:300]}...\n"
            else:
                attachment_content = str(attachment_text)

            combined_prompt = f"""
아래의 템플릿과 사용자 요청, 첨부파일 내용을 참고하여 격식 있는 업무용 이메일 초안을 작성해 주세요.

< 이메일 템플릿 >
{template_str}

< 사용자 요청 >
{user_prompt or "없음"}

< 첨부파일 내용 >
{attachment_content}

지침:
1. 템플릿을 중심으로 구성하고
2. 사용자 요청은 충실히 반영하며
3. 첨부파일은 필요한 경우에만 요약하여 언급
4. 간결하고 정중한 표현을 사용할 것
            """

            truncated_prompt = RAGEngine.truncate_prompt(combined_prompt)
            return RAGEngine.generate_completion(
                truncated_prompt,
                max_tokens=MAX_EMAIL_DRAFT_TOKENS,
                temperature=0.5
            )
        except Exception as e:
            logger.error(f"Error generating email draft: {str(e)}")
            return "이메일 초안 생성 중 오류가 발생했습니다."
