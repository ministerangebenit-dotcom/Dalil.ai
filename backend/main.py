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
You answer questions exclusively using knowledge about Cameroon — its laws,
administrative procedures, government institutions, business regulations,
tax obligations, and official processes.

CRITICAL RULES:
- Only answer questions related to Cameroon
- Always cite Cameroonian sources (minfi.gov.cm, cnps.cm, apme.cm, etc.)
- Structure every answer as a JSON object with this EXACT format, no extra text:
{
  "sovereignVerified": true,
  "summary": "Brief 1-2 sentence overview",
  "totalTime": "estimated time or null",
  "totalCost": "estimated cost in FCFA or null",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed description",
      "documents": ["doc1", "doc2"],
      "time": "time for this step",
      "cost": "cost for this step",
      "risk": "common mistake or risk, empty string if none",
      "sources": [1],
      "type": "standard"
    }
  ],
  "commonMistakes": ["mistake1", "mistake2"],
  "sources": [
    {
      "title": "Source title",
      "url": "https://actual-url.cm",
      "snippet": "Brief description",
      "domain": "domain.cm",
      "isOfficial": true
    }
  ]
}

- type must be one of: "standard", "law", or "contact"
- isOfficial must be true only for .gov.cm or well-known official institution domains
- Respond with valid JSON ONLY — no markdown fences, no explanation outside JSON
"""

class ChatRequest(BaseModel):
    message: str
    language: str = "fr"

@app.get("/")
def root():
    return {
        "service": "Dalil — Cameroon Sovereign Knowledge Engine",
        "status": "running",
        "groq_key_set": bool(GROQ_API_KEY),
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Dalil API",
        "version": "1.0.0",
        "groq_key_set": bool(GROQ_API_KEY)
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY not set. Add it in Railway Variables."
        )

    lang_instruction = {
        "fr": "Réponds en français.",
        "en": "Reply in English.",
        "pid": "Reply in Cameroonian Pidgin English.",
    }.get(request.language, "Réponds en français.")

    try:
        client = Groq(api_key=GROQ_API_KEY)

        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT + f"\n\nLanguage instruction: {lang_instruction}"
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.3,
            max_tokens=2048,
        )

        raw_response = completion.choices[0].message.content.strip()

        # Strip markdown fences if model adds them
        if raw_response.startswith("```"):
            lines = raw_response.split("\n")
            raw_response = "\n".join(
                line for line in lines
                if not line.startswith("```")
            ).strip()

        try:
