import chromadb
from pathlib import Path
from .embedder import embed_texts

def build_index(documents_dir: str = "rag/data/documents"):
    client = chromadb.PersistentClient(path="chroma_db")
    collection = client.get_or_create_collection("cameroon_procedures")

    docs = []
    metadatas = []
    ids = []

    for file_path in Path(documents_dir).glob("*.md"):
        content = file_path.read_text(encoding="utf-8")
        chunks = [c.strip() for c in content.split("\n\n") if c.strip()]
        for i, chunk in enumerate(chunks):
            ids.append(f"{file_path.stem}_{i}")
            docs.append(chunk)
            metadatas.append({"source": file_path.name})

    if not docs:
        print("No documents found!")
        return

    embeddings = embed_texts(docs)
    collection.add(embeddings=embeddings, documents=docs, metadatas=metadatas, ids=ids)
    print(f"Indexed {len(docs)} chunks from {len(set(m['source'] for m in metadatas))} documents.")

if __name__ == "__main__":
    build_index()