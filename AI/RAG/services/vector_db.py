import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.utils import embedding_functions
from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer


# 한국어 특화 임베딩 모델
embedding_model = SentenceTransformer('nlpai-lab/KURE-v1')
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name='nlpai-lab/KURE-v1'
)

tokenizer = AutoTokenizer.from_pretrained('nlpai-lab/KURE-v1')

client = chromadb.PersistentClient(path="./db")
collection = client.get_or_create_collection("email_collection", embedding_function=embedding_function)

# 토큰화 기준 -> 맥락을 읽을때 영향을 끼침
splitter = RecursiveCharacterTextSplitter(
    chunk_size=256,
    chunk_overlap=64,
    length_function=lambda x: len(tokenizer.tokenize(x))
)

# DB벡터에 메일 내용 저장
class VectorDBHandler:
    @staticmethod
    def store_email_data(thread_id, email_data, attachments):
    
        # 메타데이터 제외한 body만 담음
        email_text = email_data["body"]
        try:
            print(f"[DEBUG] Email text sample (before splitting): {email_text[:100]}")
        except Exception as e:
            print(f"[ERROR] Error printing email text: {str(e)}")
        
        email_chunks = splitter.split_text(email_text)
        print(f"[DEBUG] Split email into {len(email_chunks)} chunks")
        
        # 메일 바디&메타데이터 저장
        for i, chunk in enumerate(email_chunks):
            try:
                print(f"[DEBUG] Chunk {i} sample: {chunk[:50]}")
            except Exception as e:
                print(f"[ERROR] Error printing chunk: {str(e)}")
                
            try:
                collection.add(
                    documents=[chunk],
                    metadatas=[{
                        "thread_id": thread_id,
                        "doc_type": "email",
                        # "chunk_index": i,
                        # "total_chunks": len(email_chunks),
                        **email_data["metadata"]
                    }],
                    # chunk 별로 고유한 id 있어야함
                    ids=[f"{thread_id}_email_{i}"]
                )
                print(f"[DEBUG] Successfully stored email chunk {i}")
            except Exception as e:
                print(f"[ERROR] Failed to store email chunk {i}: {str(e)}")
                import traceback
                traceback.print_exc()

        # 첨부파일 저장
        for idx, att in enumerate(attachments):
            chunks = splitter.split_text(att["text_content"])
            print(f"[DEBUG] Split attachment {att['filename']} into {len(chunks)} chunks")
            
            for i, chunk in enumerate(chunks):
                try:
                    collection.add(
                        documents=[chunk],
                        metadatas=[{
                            "thread_id": thread_id,
                            "doc_type": "attachment",
                            "file_type": att["file_type"],
                            "filename": att["filename"],
                            "chunk_index": i,
                            "total_chunks": len(chunks)
                        }],
                        ids=[f"{thread_id}_attachment_{idx}_{i}"]
                    )
                    print(f"[DEBUG] Successfully stored attachment chunk {i} for {att['filename']}")
                except Exception as e:
                    print(f"[ERROR] Failed to store attachment chunk {i}: {str(e)}")
                    import traceback
                    traceback.print_exc()

    # 데이터 검색
    ## query가 현재 없기 때문에 query 관련 코드는 다 삭제해도 될듯(2차 mvp 확인)
    @staticmethod
    def retrieve_thread_data(thread_id, query=None, top_k=10):
        try:

            # 쿼리에 따른 분기 처리 이후 상황에 따라 삭제
            if query:
                res = collection.query(query_texts=[query], where={"thread_id": thread_id}, n_results=top_k)
            else:
                res = collection.get(where={"thread_id": thread_id})

            documents = []
            if res and 'documents' in res:
                docs = res['documents'][0] if query else res['documents']
                metas = res['metadatas'][0] if query else res['metadatas']
                
                print(f"[DEBUG] Retrieved {len(docs)} documents for thread {thread_id}")
                

                for d, m in zip(docs, metas):
            
                    if isinstance(d, bytes):
                        d = d.decode('utf-8', errors='replace')
                    
                    documents.append({"content": d, "metadata": m})
                    
                    try:
                        print(f"[DEBUG] Document sample: {d[:50]}")
                    except Exception as e:
                        print(f"[ERROR] Error printing document: {str(e)}")
            
            return documents
        except Exception as e:
            print(f"[ERROR] Error retrieving thread data: {str(e)}")
            import traceback
            traceback.print_exc()
            return []