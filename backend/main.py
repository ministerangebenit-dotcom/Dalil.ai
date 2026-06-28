from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"message": "Dalil API running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": req.message}
        ]
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": []
    }
