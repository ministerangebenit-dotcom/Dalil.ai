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


@app.get("/")
def root():
    return {"message": "Welcome to the Dalil API!"}


@app.get("/health")
def health():
    return {"status": "healthy"}


# Request model
class ChatRequest(BaseModel):
    message: str


# REAL AI CHAT ENDPOINT
@app.post("/chat")
def chat(req: ChatRequest):

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": req.message
                }
            ]
        )

        return {
            "answer": response.choices[0].message.content,
            "sources": []
        }

    except Exception as e:
        return {
            "answer": f"Error: {str(e)}",
            "sources": []
        }
