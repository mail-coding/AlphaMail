import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.utils import embedding_functions
from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer
from services.email_processor import EmailProcessor
import json

# ✅ 한국어 특화 KURE 모델
embedding_model = SentenceTransformer('nlpai-lab/KURE-v1')
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name='nlpai-lab/KURE-v1'
)

tokenizer = AutoTokenizer.from_pretrained('nlpai-lab/KURE-v1')

client = chromadb.PersistentClient(path="./db")
collection = client.get_or_create_collection("email_collection", embedding_function=embedding_function)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=256,
    chunk_overlap=32,
    length_function=lambda x: len(tokenizer.tokenize(x))
)

class VectorDBHandler:
    @staticmethod
    def store_email_data(thread_id, email_data, attachments):
        # Verify that the email text is properly decoded
        email_text = email_data["body"]
        
        # Debug output to check encoding
        try:
            print(f"[DEBUG] Email text sample (before splitting): {email_text[:100]}")
        except Exception as e:
            print(f"[ERROR] Error printing email text: {str(e)}")
        
        # Split the email text into chunks
        email_chunks = splitter.split_text(email_text)
        print(f"[DEBUG] Split email into {len(email_chunks)} chunks")
        
        # Store each chunk in the vector database
        for i, chunk in enumerate(email_chunks):
            # Debug output to verify chunk content
            try:
                print(f"[DEBUG] Chunk {i} sample: {chunk[:50]}")
            except Exception as e:
                print(f"[ERROR] Error printing chunk: {str(e)}")
                
            # Store the chunk with metadata
            try:
                collection.add(
                    documents=[chunk],
                    metadatas=[{
                        "thread_id": thread_id,
                        "doc_type": "email",
                        "chunk_index": i,
                        "total_chunks": len(email_chunks),
                        **email_data["metadata"]
                    }],
                    ids=[f"{thread_id}_email_{i}"]
                )
                print(f"[DEBUG] Successfully stored email chunk {i}")
            except Exception as e:
                print(f"[ERROR] Failed to store email chunk {i}: {str(e)}")
                import traceback
                traceback.print_exc()

        # Store attachment data
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

    @staticmethod
    def retrieve_thread_data(thread_id, query=None, top_k=10):
        try:
            # Query the vector database for documents
            if query:
                res = collection.query(query_texts=[query], where={"thread_id": thread_id}, n_results=top_k)
            else:
                res = collection.get(where={"thread_id": thread_id})

            # Process the results
            documents = []
            if res and 'documents' in res:
                docs = res['documents'][0] if query else res['documents']
                metas = res['metadatas'][0] if query else res['metadatas']
                
                # Print debug info
                print(f"[DEBUG] Retrieved {len(docs)} documents for thread {thread_id}")
                
                # Process each document and its metadata
                for d, m in zip(docs, metas):
                    # Ensure the document content is properly decoded
                    if isinstance(d, bytes):
                        d = d.decode('utf-8', errors='replace')
                    
                    # Add the document to the list
                    documents.append({"content": d, "metadata": m})
                    
                    # Debug output to verify document content
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