from fastapi import FastAPI
from routes.email_routes import router as email_router
import os

# api 연결
app = FastAPI()
app.include_router(email_router)

if __name__ == "__main__":

    # db 저장용 디렉토리
    os.makedirs("./db", exist_ok=True)

    #FastAPI 앱을 실행하는 ASGI 서버
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
