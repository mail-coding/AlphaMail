import logging
import httpx
import time
from fastmcp import FastMCP
from pydantic import Field
from typing import Annotated, List, Optional

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# FastMCP 관련 로깅 활성화
for log_name in ['fastmcp', 'mcp', 'uvicorn', 'fastapi']:
    logging.getLogger(log_name).setLevel(logging.DEBUG)

# 환경 변수
ALPHAMAIL_BASE_URL = "https://alphamail.my"
HOST = "0.0.0.0"
PORT = 8000
REQUEST_TIMEOUT = 10.0

# MCP 서버 인스턴스 생성
mcp = FastMCP("AlphaMail MCP Server")

# === 도구 정의 ===
@mcp.tool()
def date(

    startTime: Annotated[str, Field(description="일정 시작 일자 (예: '2025-05-10T10:00:00')")],
    endTime: Annotated[str, Field(description="일정 종료 일자 (예: '2024-05-11T11:30:00')")],
    userEmail : Annotated[str, Field(description="받은 사람의 이메일 (예:'test@alphamail.my')")],
    emailId : Annotated[str, Field(description="이메일 아이디 (예:'123'), 메일 아이디 emailId : 로 값이 들어옴")],
    name: Annotated[Optional[str], Field(description="일정 제목", default=None)] = None,
    description: Annotated[Optional[str], Field(description="일정 설명", default=None)] = None,
    title: Annotated[Optional[str], Field(description="전체적인 AI가 만든 제목임 일정 제목은 간단하지만 이 title은 좀 더 길게 만들어짐", default=None)] = None
):
    """
    메일 본문에서 일정 관련 날짜 및 제목 정보를 추출하여 일정을 생성합니다.
    사용 조건:
    - name: 최대 40자
    - description: 최대 60자
    - title: 최대 200자
    - 이메일에 회의, 약속, 행사 등 일정이 포함된 경우.
    - 날짜(start, end) 정보가 명확히 존재할 것.

    이메일 본문은 HTML 형식(태그 포함)으로 들어옵니다.  
    HTML 태그는 무시하고, 실제 텍스트 내용에서 정보를 추출해 아래 필드에 맞게 JSON 구조로 채워주세요.
   

    """
    try:
        logger.info(f"일정 생성 요청: {title} ({startTime} ~ {endTime})")
        logger.info(f"endpoint url : {ALPHAMAIL_BASE_URL}")
        response = httpx.post(
            f"{ALPHAMAIL_BASE_URL}/api/assistants/schedules",
            json={
                "name" : name,
                "startTime": startTime,
                "endTime": endTime,
                "description": description,
                "userEmail" : userEmail,
                "emailId" : emailId,
                "title" : title
            },
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        logger.info("일정 정보 전송 성공")
        try:
            response_data = response.json()
        except:
            response_data = {"status_code": response.status_code}
            
        return {
            "message": "일정 정보가 정상적으로 외부 시스템에 전송되었습니다.",
            "response": response_data
        }
    except Exception as e:
        logger.error(f"일정 정보 전송 실패: {str(e)}")
        return {
            "message": f"외부 시스템 전송 중 오류가 발생했습니다: {str(e)}",
            "error": True,
            "data": {}
        }

@mcp.tool()
def createTemporaryPurchaseOrder(
    title: Annotated[str, Field(description="발주 제목 (LLM이 생성, 필수)")],
    userEmail: Annotated[str, Field(description="사용자 이메일(필수, 숫자여도 str로 변환)")],
    emailId: Annotated[str, Field(description="이메일 ID(필수, 숫자여도 str로 변환)")],
    clientName: Annotated[Optional[str], Field(description="거래처명")] = None,
    deliverAt: Annotated[Optional[str], Field(description="배송 예정일 (ISO8601, 예: '2024-05-15T12:00:00')")] = None,
    shippingAddress: Annotated[Optional[str], Field(description="배송 주소")] = None,
    manager: Annotated[Optional[str], Field(description="담당자명")] = None,
    managerNumber: Annotated[Optional[str], Field(description="담당자 연락처")] = None,
    paymentTerm: Annotated[Optional[str], Field(description="결제 조건")] = None,
    products: Annotated[Optional[List[dict]], Field(description="발주 상품 목록 (예: [{'productName': '상품명', 'count': 2}])")] = None
):
    """
    [사용 조건]
    - 이메일 본문에 상품 발주, 주문 요청, 구매 요청 등 실제로 거래처에 물품을 주문하는 내용이 포함되어 있을 때 사용하세요.
    - 품목, 수량, 배송지, 결제 조건 등 발주서에 필요한 정보가 일부라도 명확히 존재할 때 사용하세요.

    [프롬프트]
    이메일 본문에서 임시 발주서 생성에 필요한 정보를 추출해 아래 필드에 맞게 채워주세요.

    - 모든 필드는 반드시 포함해야 하며, 값이 없으면 null로 채워야 합니다.
    - userEmail은 userEmail = test@alphamail.my 이런식으로 주어집니다.
    - emailId는 숫자입니다 
    - title, userEmail, emailId는 반드시 생성 또는 추출해서 값이 들어가야 합니다.
    - 나머지 필드는 이메일에 정보가 없으면 null로 채웁니다.
    - products는 [{productName, count}] 형태의 리스트로, 각 항목도 값이 없으면 null로 채웁니다.
    - 날짜, 숫자 등은 최대한 원본 형식(ISO8601 등)에 맞춰주세요.
    - 각 필드 값은 200자 이내

    이메일 본문은 HTML 형식(태그 포함)으로 들어옵니다.  
    HTML 태그는 무시하고, 실제 텍스트 내용에서 정보를 추출해 아래 필드에 맞게 JSON 구조로 채워주세요.

    예시:
    {
      "title": "A사 프린터 발주",
      "userEmail": "user@email.com",
      "emailId": "123",
      "clientName": "A사",
      "deliverAt": "2024-05-15T12:00:00",
      "shippingAddress": null,
      "manager": null,
      "managerNumber": null,
      "paymentTerm": null,
      "products": [
        {"productName": "프린터", "count": 2},
        {"productName": "토너", "count": null}
      ]
    }

    반드시 위 지침을 지켜 JSON 구조로 정보를 추출하세요.
    """
    try:
        payload = {
            "title": title if title is not None else None,
            "userEmail": str(userEmail) if userEmail is not None else None,
            "emailId": str(emailId) if emailId is not None else None,
            "clientName": clientName if clientName is not None else None,
            "deliverAt": deliverAt if deliverAt is not None else None,
            "shippingAddress": shippingAddress if shippingAddress is not None else None,
            "manager": manager if manager is not None else None,
            "managerNumber": managerNumber if managerNumber is not None else None,
            "paymentTerm": paymentTerm if paymentTerm is not None else None,
            "products": None
        }
        # products 리스트도 각 아이템에서 None/빈 값은 null로 변환
        if products is not None:
            filtered_products = []
            for p in products:
                filtered = {k: (v if v is not None and v != "" else None) for k, v in p.items()}
                filtered_products.append(filtered)
            payload["products"] = filtered_products

        logger.info(f"임시 발주 요청(모든 필드 포함): {payload}")

        response = httpx.post(
            f"{ALPHAMAIL_BASE_URL}/api/assistants/purchase-orders",
            json=payload,
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        logger.info("임시 발주 정보 전송 성공")
        try:
            response_data = response.json()
        except:
            # JSON이 아닌 경우 텍스트로 처리
            response_data = {
                "message": response.text,
                "status_code": response.status_code
            }
        
        return {
            "message": "임시 발주 정보가 정상적으로 외부 시스템에 전송되었습니다.",
            "response": response_data
        }
    except Exception as e:
        logger.error(f"임시 발주 정보 전송 실패: {str(e)}")
        return {
            "message": f"외부 시스템 전송 중 오류가 발생했습니다: {str(e)}",
            "error": True,
            "data": {}
        }

@mcp.tool()
def createTemporaryQuote(
    title: Annotated[str, Field(description="견적 제목 (LLM이 생성, 필수)")],
    userEmail: Annotated[str, Field(description="사용자 이메일(필수, 예: test@alphamail.my)")],
    emailId: Annotated[int, Field(description="이메일 ID(필수, 숫자)")],
    clientName: Annotated[Optional[str], Field(description="거래처명")] = None,
    shippingAddress: Annotated[Optional[str], Field(description="배송 주소")] = None,
    manager: Annotated[Optional[str], Field(description="담당자명")] = None,
    managerNumber: Annotated[Optional[str], Field(description="담당자 연락처")] = None,
    products: Annotated[Optional[List[dict]], Field(description="견적 상품 목록 (예: [{'productName': '상품명', 'count': 2}])")] = None
):
    """
    [사용 조건]
    - 이메일 본문에 상품 견적 요청, 가격 문의, 견적서 요청 등 거래처에 견적을 요청하는 내용이 포함되어 있을 때 사용하세요.
    - 품목, 수량, 요청자 정보 등 견적서에 필요한 정보가 일부라도 명확히 존재할 때 사용하세요.

    [프롬프트]
    이메일 본문에서 임시 견적서 생성에 필요한 정보를 추출해 아래 필드에 맞게 채워주세요.

    - 각 필드 값은 200자 이내
    - 모든 필드는 반드시 포함해야 하며, 값이 없으면 null로 채워야 합니다.
    - userEmail은 userEmail = test@alphamail.my 이런식으로 주어집니다.
    - emailId은 emailId = 123 이런식으로 주어집니다 이는 숫자입니다.
    - title, userEmail, emailId는 반드시 생성 또는 추출해서 값이 들어가야 합니다.
    - 나머지 필드는 이메일에 정보가 없으면 null로 채웁니다.
    - products는 [{productName, count}] 형태의 리스트로, 각 항목도 값이 없으면 null로 채웁니다.

    이메일 본문은 HTML 형식(태그 포함)으로 들어옵니다.  
    HTML 태그는 무시하고, 실제 텍스트 내용에서 정보를 추출해 아래 필드에 맞게 JSON 구조로 채워주세요.

    예시:
    {
      "title": "A사 견적 요청",
      "userEmail": "test@alphamail.my",
      "emailId": 123,
      "clientName": "A사",
      "shippingAddress": null,
      "manager": null,
      "managerNumber": null,
      "products": [
        {"productName": "노트북", "count": 5},
        {"productName": "마우스", "count": null}
      ]
    }

    반드시 위 지침을 지켜 JSON 구조로 정보를 추출하세요.
    """
    try:
        payload = {
            "title": title if title is not None else None,
            "userEmail": userEmail if userEmail is not None else None,
            "emailId": emailId if emailId is not None else None,
            "clientName": clientName if clientName is not None else None,
            "shippingAddress": shippingAddress if shippingAddress is not None else None,
            "manager": manager if manager is not None else None,
            "managerNumber": managerNumber if managerNumber is not None else None,
            "products": None
        }
        # products 리스트도 각 아이템에서 None/빈 값은 null로 변환
        if products is not None:
            filtered_products = []
            for p in products:
                filtered = {k: (v if v is not None and v != "" else None) for k, v in p.items()}
                filtered_products.append(filtered)
            payload["products"] = filtered_products

        logger.info(f"임시 견적 요청(모든 필드 포함): {payload}")

        response = httpx.post(
            f"{ALPHAMAIL_BASE_URL}/api/assistants/quotes",
            json=payload,
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        logger.info("임시 견적 정보 전송 성공")

        try:
            response_data = response.json()
        except:
            # JSON이 아닌 경우 텍스트로 처리
            response_data = {
                "message": response.text,
                "status_code": response.status_code
            }
        return {
            "message": "임시 견적 정보가 정상적으로 외부 시스템에 전송되었습니다.",
            "response": response_data
        }
    except Exception as e:
        logger.error(f"임시 견적 정보 전송 실패: {str(e)}")
        return {
            "message": f"외부 시스템 전송 중 오류가 발생했습니다: {str(e)}",
            "error": True,
            "data": {}
        }

if __name__ == "__main__":
    try:
        logger.info(f"FastMCP 서버를 {HOST}:{PORT}에서 시작합니다...")
        logger.info("FastMCP의 SSE run() 메서드를 사용합니다.")
        mcp.run(transport="sse", host=HOST, port=PORT)
        logger.info("메인 프로세스를 유지합니다...")

        while True:
            logger.info("서버 실행 중...")
            time.sleep(30)

    except KeyboardInterrupt:
        logger.info("서버가 키보드 인터럽트로 종료됩니다.")
    except Exception as e:
        logger.error(f"서버 실행 중 오류 발생: {e}", exc_info=True)
        import sys
        sys.exit(1)