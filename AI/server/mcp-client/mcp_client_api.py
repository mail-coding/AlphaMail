import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
from contextlib import asynccontextmanager
from mcp_client import MCPClientManager

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("mcp-client-api")

# MCP 클라이언트 매니저 인스턴스 생성
client_manager = MCPClientManager()

# 요청 모델
class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = None

# 응답 모델
class QueryResponse(BaseModel):
    response: Optional[Dict[str, Any]] = None
    tool_calls: List[Dict[str, Any]] = []
    error: Optional[str] = None

# FastAPI 애플리케이션 설정
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 애플리케이션 시작 시 MCP 클라이언트 초기화
    await client_manager.initialize()
    yield
    # 애플리케이션 종료 시 MCP 클라이언트 정리
    await client_manager.cleanup()

app = FastAPI(lifespan=lifespan, title="MCP Client API", description="MCP 도구를 사용하는 AI 질의응답 API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 오리진 허용 (프로덕션에서는 구체적인 오리진 지정 권장)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "running", 
        "message": "MCP 클라이언트 API가 실행 중입니다.",
        "version": "1.0.0"
    }

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        result = await client_manager.process_query(request.query)
        
        if "error" in result:
            return QueryResponse(error=result["error"])
            
        return QueryResponse(
            response=result.get("llm_response"),  # "response" 대신 "llm_response" 사용
            tool_calls=result.get("tool_results", [])  # "tool_calls" 대신 "tool_results" 사용
        )
    except Exception as e:
        logger.error(f"쿼리 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if client_manager.is_initialized else "initializing",
        "tools_available": len(client_manager.tools)
    }

# 직접 실행 시
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)