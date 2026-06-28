import chromadb
from .embedder import embed_texts

client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_collection("cameroon_procedures")

def retrieve(query: str, top_k: int = 5) -> list[str]:
    query_embedding = embed_texts([query])
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)
    return results['documents'][0]  # list of strings