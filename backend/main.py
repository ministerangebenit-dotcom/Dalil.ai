from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
import json

app = FastAPI(title="Dalil API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are Dalil, a sovereign Cameroonian AI knowledge engine.
You answer questions exclusively using knowledge about Cameroon — its laws, 
administrative procedures, government institutions, business regulations, 
tax obligations, and official processes.

CRITICAL RULES:
- Only answer questions related to Cameroon
- Always cite Cameroonian sources (minfi.gov.cm, cnps.cm, apme.cm, etc.)
- Structure every answer as a JSON object with this exact format:
{
  "sovereignVerified": true,
  "summary": "Brief 1-2 sentence overview of the answer",
  "totalTime": "estimated time if applicable, else null",
  "totalCost": "estimated cost in FCFA if applicable, else null",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed description",
      "documents": ["doc1", "doc2"],
      "time": "time for this step",
      "cost": "cost for this step",
      "risk": "common mistake or risk",
      "sources": [1],
      "type": "standard"
    }
  ],
  "commonMistakes": ["mistake1", "mistake2"],
  "sources": [
    {
      "title": "Source title",
      "url": "https://actual-url.cm",
      "snippet": "Brief description of what this source contains",
      "domain": "domain.cm",
      "isOfficial": true
    }
  ]
}

- type can be: "standard", "law", or "contact"
- isOfficial must be true only for .gov.cm or official institution domains
- If the question is not about Cameroon, return the JSON with summary explaining you only cover Cameroon
- Always respond with valid JSON only, no markdown, no explanation outside JSON
"""

class ChatRequest(BaseModel):
    message: str
    language: str = "fr"

class ChatResponse(BaseModel):
    answer: dict
    raw: str

@app.get("/health")
def health():
    return {"status": "healthy", "service": "Dalil API", "version": "1.0.0"}

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    lang_instruction = {
        "fr": "Réponds en français.",
        "en": "Reply in English.",
        "pid": "Reply in Cameroonian Pidgin English.",
    }.get(request.language, "Réponds en français.")

    try:
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

        # Clean markdown if model wraps in ```json
        if raw_response.startswith("```"):
            lines = raw_response.split("\n")
            raw_response = "\n".join(lines[1:-1])

        try:
            parsed = json.loads(raw_response)
        except json.JSONDecodeError:
            # Fallback: wrap raw text in minimal structure
            parsed = {
                "sovereignVerified": False,
                "summary": raw_response[:300],
                "totalTime": None,
                "totalCost": None,
                "steps": [],
                "commonMistakes": [],
                "sources": []
            }

        return {"answer": parsed, "raw": raw_response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {
        "service": "Dalil — Cameroon Sovereign Knowledge Engine",
        "status": "running",
        "docs": "/docs"
    }
