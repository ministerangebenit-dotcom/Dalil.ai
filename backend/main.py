from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="Dalil API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {"message": "Welcome to the Dalil API!"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# -------------------------
# CHAT ENDPOINT (DUMMY)
# -------------------------

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(req: ChatRequest):
    return {
        "answer": f"You said: {req.message}",
        "sources": []
    }
