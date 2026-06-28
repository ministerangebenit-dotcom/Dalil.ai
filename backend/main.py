from rag import search
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

app = FastAPI(
    title="Dalil API",
    version="1.0.0"
)

# CORS (required for frontend + Hoppscotch)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.post("/chat")
def chat(req: ChatRequest):

    # 1. retrieve relevant context
    context_docs = search(req.message)

    context_text = "\n".join(context_docs) if context_docs else "No context available."

    system_prompt = f"""
You are Dalil.

Use the following context if relevant:

{context_text}

Rules:
- Use context when useful
- If context is irrelevant, ignore it
- Be clear and structured
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.message}
        ]
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": context_docs
    }
    
    class IngestRequest(BaseModel):
    id: str
    text: str


@app.post("/ingest")
def ingest(req: IngestRequest):
    add_document(req.id, req.text)
    return {"status": "added"}
    
