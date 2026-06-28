import chromadb
from sentence_transformers import SentenceTransformer

# local embedding model (no API needed)
model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="dalil_docs")


def add_document(doc_id: str, text: str):
    embedding = model.encode(text).tolist()

    collection.add(
        ids=[doc_id],
        documents=[text],
        embeddings=[embedding]
    )


def search(query: str, top_k: int = 3):
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results["documents"][0] if results["documents"] else []
