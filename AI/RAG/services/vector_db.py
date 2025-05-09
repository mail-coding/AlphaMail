import re
import chromadb
from chromadb.utils import embedding_functions
from transformers import AutoTokenizer
from typing import List, Dict, Any
import logging

# 로깅 설정
logger = logging.getLogger(__name__)

# 한국어 특화 임베딩 모델 및 토크나이저 설정
EMBEDDING_MODEL = 'nlpai-lab/KURE-v1'
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=EMBEDDING_MODEL
)
tokenizer = AutoTokenizer.from_pretrained(EMBEDDING_MODEL)

# ChromaDB 클라이언트 및 컬렉션 설정
client = chromadb.PersistentClient(path="./db")
collection = client.get_or_create_collection("email_collection", embedding_function=embedding_function)

def korean_sentence_splitter(text: str) -> List[str]:
    # 정규표현식 기반 문장 나누기
    sentence_endings = re.compile(r'(?<=[\.\?\!])\s+|\n+|(?<=[가-힣])(?=[A-Z])')
    sentences = sentence_endings.split(text.strip())
    return [s.strip() for s in sentences if s.strip()]

def chunk_sentences(sentences: List[str], chunk_size: int = 256, overlap: int = 64) -> List[str]:
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sent_len = len(tokenizer.tokenize(sentence))
        if current_length + sent_len > chunk_size:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = current_chunk[-(overlap // 10):]  # 일부 문장 중첩
                current_length = sum(len(tokenizer.tokenize(s)) for s in current_chunk)
        current_chunk.append(sentence)
        current_length += sent_len

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


class VectorDBHandler:
    @staticmethod
    def store_email_data(vector_id: str, email_data: Dict[str, Any]) -> None:
    
        email_text = email_data.get("body", "")
        metadata = email_data.get("metadata", {})
        if not email_text:
            logger.warning(f"Empty email text for vector_id: {vector_id}")
            return

        try:
            logger.debug(f"Processing email text (length: {len(email_text)})")
            
            # 문장 단위 분할 + 청크 생성
            sentences = korean_sentence_splitter(email_text)
            email_chunks = chunk_sentences(sentences)
            logger.debug(f"Split email into {len(email_chunks)} chunks")

            documents, metadatas, ids = [], [], []

            for i, chunk in enumerate(email_chunks):
                documents.append(chunk)
                metadatas.append({
                    "vector_id": vector_id,
                    "doc_type": "email",
                    "subject": email_data["metadata"].get("subject"),
                    "timestamp": email_data["metadata"].get("timestamp"),
                    "sender": email_data["metadata"].get("sender"),
                    "receiver": email_data["metadata"].get("receiver"),
                    "chunk_index": i
                })
                ids.append(f"{vector_id}_email_{i}")

            if documents:
                collection.add(documents=documents, metadatas=metadatas, ids=ids)
                logger.info(f"Successfully stored {len(documents)} email chunks for {vector_id}")

        except Exception as e:
            logger.error(f"Failed to store email data: {str(e)}")
            raise

    @staticmethod
    def retrieve_thread_data(vector_id: str) -> List[Dict[str, Any]]:
        """벡터 ID에 해당하는 스레드 데이터 검색"""
        try:
            res = collection.get(where={"vector_id": vector_id})
            if not res or 'documents' not in res:
                logger.warning(f"No documents found for vector_id: {vector_id}")
                return []

            documents = []
            for doc, meta in zip(res['documents'], res['metadatas']):
                if isinstance(doc, bytes):
                    doc = doc.decode('utf-8', errors='replace')
                documents.append({"content": doc, "metadata": meta})

            logger.debug(f"Retrieved {len(documents)} documents for thread {vector_id}")
            return documents

        except Exception as e:
            logger.error(f"Error retrieving thread data: {str(e)}")
            return []
