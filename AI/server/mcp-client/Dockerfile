FROM python:3.12

# 작업 디렉토리 생성 및 이동
WORKDIR /app

# requirements.txt 복사 및 pip 업그레이드 및 의존성 설치
COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 소스 코드 전체 복사
COPY . .

# FastAPI 서버 포트 오픈
EXPOSE 8000

# FastAPI 앱 실행 (mcp_client_api.py의 app 객체)
CMD ["uvicorn", "mcp_client_api:app", "--host", "0.0.0.0", "--port", "8001"]
