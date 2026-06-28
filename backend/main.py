from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import json
import traceback

app = FastAPI(title="Dalil API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

SYSTEM_PROMPT = """You are Dalil, a sovereign Cameroonian AI knowledge engine.
You answer questions exclusively using knowledge about Cameroon.

Always respond with this exact JSON structure and nothing else:
{
  "sovereignVerified": true,
  "summary": "1-2 sentence overview",
  "totalTime": "estimated time or null",
  "totalCost": "estimated cost in FCFA or null",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Description",
      "documents": ["doc1"],
      "time": "time",
      "cost": "cost",
      "risk": "risk or empty string",
      "sources": [1],
      "type": "standard"
    }
  ],
  "commonMistakes": ["mistake1"],
  "sources": [
    {
      "title": "Source title",
      "url": "https://url.cm",
      "snippet": "Description",
      "domain": "domain.cm",
      "isOfficial": true
    }
  ]
}

Rules:
- type must be standard, law, or contact
- isOfficial is true only for .gov.cm domains
- No markdown, no text outside JSON
"""


class ChatRequest(BaseModel):
    message: str
    language: str = "fr"


@app.get("/")
def root():
    return {
        "service": "Dalil API",
        "status": "running",
        "groq_key_set": bool(GROQ_API_KEY),
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Dalil API",
        "version": "1.0.0",
        "groq_key_set": bool(GROQ_API_KEY),
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY not set in Railway Variables",
        )

    lang_instruction = {
        "fr": "Reponds en francais.",
        "en": "Reply in English.",
        "pid": "Reply in Cameroonian Pidgin English.",
    }.get(request.language, "Reponds en francais.")

    try:
        client = Groq(api_key=GROQ_API_KEY)

        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT + "\n\n" + lang_instruction,
                },
                {
                    "role": "user",
                    "content": request.message,
                },
            ],
            temperature=0.3,
            max_tokens=2048,
        )

        raw = completion.choices[0].message.content.strip()

        if raw.startswith("```"):
            lines = raw.split("\n")
            raw = "\n".join(
                line for line in lines if not line.startswith("```")
            ).strip()

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {
                "sovereignVerified": False,
                "summary": raw[:400] if raw else "Erreur de parsing.",
                "totalTime": None,
                "totalCost": None,
                "steps": [],
                "commonMistakes": [],
                "sources": [],
            }

        return {"answer": parsed, "raw": raw}

    except HTTPException:
        raise
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
