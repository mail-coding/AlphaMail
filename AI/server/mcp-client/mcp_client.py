import asyncio
import logging
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage, SystemMessage  # SystemMessage import 추가
from typing import Optional, List, Dict, Any
import os
import pytz
from datetime import datetime

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("mcp-client")

# MCP 서버 URL 설정 (실제 서버 주소로 변경하세요)
# 서버가 로컬호스트에서 실행 중인 경우 아래 URL을 사용

# Anthropic API 키 설정
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

class MCPClientManager:
    def __init__(self):
        self.client = None
        self.agent = None
        self.model = None
        self.tools = []
        self.is_initialized = False
        self.initialization_lock = asyncio.Lock()
        self.sse_connected = False
        self._reconnect_task = None
    
    async def initialize(self):
        # 동시 초기화 방지를 위한 락
        async with self.initialization_lock:
            if self.is_initialized:
                return
                
            try:
                # 모델 초기화
                logger.info("Claude 모델 초기화 중...")
                self.model = ChatAnthropic(
                    model_name="claude-3-7-sonnet-latest",
                    api_key=ANTHROPIC_API_KEY
                )
                
                # MCP 클라이언트 설정 및 연결
                logger.info(f"MCP 서버({"http://43.203.122.79:8000/sse"})에 연결 시도 중...")
                self.client = MultiServerMCPClient(
                    {
                        "alphaMail": {
                            "url": "http://43.203.122.79:8000/sse",
                            "transport": "sse",
                        }
                    }
                )
                
                self.tools = await self.client.get_tools()
                logger.info(f"사용 가능한 도구: {[tool.name for tool in self.tools]}")
                
                if not self.tools:
                    logger.warning("사용 가능한 도구가 없습니다.")

                # ReAct 에이전트 생성
                self.agent = create_react_agent(self.model, self.tools)
                self.is_initialized = True
                logger.info("MCP 클라이언트 초기화 완료")
                
                if self._reconnect_task is None:
                    self._reconnect_task = asyncio.create_task(self.maintain_sse_connection())
                
            except Exception as e:
                logger.error(f"MCP 클라이언트 초기화 오류: {str(e)}")
                self.is_initialized = False
                raise e
    
    async def cleanup(self):
        if self.client:
            try:
                # 컨텍스트 매니저 종료 코드 제거
                # MultiServerMCPClient는 더 이상 컨텍스트 매니저가 아님
                self.is_initialized = False
                logger.info("MCP 클라이언트 종료됨")
                if self._reconnect_task:
                    self._reconnect_task.cancel()
                    self._reconnect_task = None
            except Exception as e:
                logger.error(f"MCP 클라이언트 종료 오류: {str(e)}")
        
    async def process_query(self, query: str) -> Dict[str, Any]:
        now_kst = datetime.now(pytz.timezone('Asia/Seoul'))
        now_kst_str = now_kst.strftime('%Y-%m-%d %H:%M:%S KST')

        SYSTEM_PROMPT = f"""
            다음 이메일 내용을 분석해 업무 관련 일정, 발주 요청, 견적 요청과 같은 업무 관련 정보를 추출합니다.

            현재 시간은 {now_kst_str}입니다.

            ### 추출 대상
            1. **업무 관련 일정**: 회의, 미팅, 프로젝트 마감일 등 업무 관련 일정만 추출
            2. **발주 요청**: 실제 구매나 발주로 이어지는 요청만 추출
            3. **견적 요청**: 구체적인 제품/서비스에 대한 가격 견적 요청만 추출

            ### 추출하지 않아야 할 것
            1. **개인 일정**: 연차, 휴가, 개인적인 약속 등 업무 외 개인 일정
            2. **공휴일/휴무일 언급**: 단순 언급 또는 참고용 정보
            3. **단순 가격/품목 문의**: 견적서 발행 의도 없이 단순 정보 요청인 경우
            4. **일상적 대화**: "가격이 어떻게 되나요?", "이 제품 살 수 있나요?" 같은 단순 질문

            ### 중복 방지 규칙
            - 메일에서 같은 건에 대해서는 (예: 같은 발주 번호, 같은 일정, 같은 요청 항목)이 **한 번만 등록**되도록 합니다.
            - 다음 기준으로 중복을 판단합니다:
            * 일정: 제목, 날짜/시간, 참석자
            * 발주: 발주서 번호, 거래처, 제품명, 수량, 납기일
            * 견적: 견적 요청 제품, 수량, 거래처, 요청일

            ### 여러 요청 처리
            - 하나의 이메일에 여러 유형의 요청(일정, 발주, 견적)이 포함된 경우 각각을 별도로 추출합니다.
            - 각 요청 유형별로 한 번씩만 tool call을 수행하세요.

            ### 구체적인 판단 기준
            1. **일정 추출 (date 도구)**:
            - 반드시 "날짜/시간"이 명확히 언급된 업무 관련 일정만 추출
            - 단순 마감일/납기일 언급은 일정이 아닌 해당 업무(발주/견적)의 일부로 처리
            - "내일 회의해요"와 같이 모호한 표현은 충분한 정보가 없으면 추출하지 않음

            2. **발주 요청 (createTemporaryPurchaseOrder 도구)**:
            - 구체적인 제품명, 수량이 있고 실제 구매 의도가 명확한 경우만 추출
            - "~을 주문해 주세요", "~을 발주해 주세요"와 같이 명확한 발주 의도가 있어야 함
            - 단순 재고 확인, 가격 문의는 제외

            3. **견적 요청 (createTemporaryQuote 도구)**:
            - "견적서 보내주세요", "견적 요청드립니다"와 같이 명확한 견적 의도가 있어야 함
            - 구체적인 제품/서비스명이 언급되어야 함
            - 단순 가격 문의나 일반적인 제품 정보 요청은 제외

            ### 검증 단계
            1. 추출하기 전 반드시 요청 의도를 명확히 파악하세요.
            2. 추출하려는 정보가 위의 기준에 부합하는지 확인하세요.
            3. 이미 추출한 정보와 중복되지 않는지 반드시 확인하세요.
            4. 모호한 경우 추출하지 않는 것이 좋습니다.

            추출 시 각 도구의 요구사항과 형식에 맞게 정확한 데이터를 제공해 주세요.
            """
        
        if not self.is_initialized:
            await self.initialize()
                
        try:

            # 쿼리 변수명 수정
            response = await self.agent.ainvoke({"messages": [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=query)
                ]})



            # 항상 일정한 반환 구조 유지
            result = {
                "tool_results": [],
                "llm_response": response
            }

            for msg in response.get("messages", []):
                if hasattr(msg, 'tool_calls') and msg.tool_calls:
                    for call in msg.tool_calls:
                        tool = next((t for t in self.tools if t.name == call['name']), None)
                        if tool:
                            server_response = await tool.coroutine(call['args'])
                            result["tool_results"].append({
                                "tool": call['name'],
                                "result": server_response
                            })
                        else:
                            result["tool_results"].append({
                                "tool": call['name'],
                                "error": f"도구 '{call['name']}'을(를) 찾을 수 없습니다."
                            })
            return result

        except Exception as e:
            logger.error(f"쿼리 처리 오류: {str(e)}")
            return {
                "error": str(e)
            }

    async def connect_sse(self):
        try:
            # 실제 SSE 연결 시도 코드
            # 예: self.sse_client = await SomeSSEClient.connect(...)
            self.sse_connected = True
            print("SSE 연결 성공")
        except Exception as e:
            self.sse_connected = False
            print(f"SSE 연결 실패: {e}")

    async def maintain_sse_connection(self):
        while True:
            if not self.sse_connected:
                await self.connect_sse()
            await asyncio.sleep(5)  # 5초마다 체크
