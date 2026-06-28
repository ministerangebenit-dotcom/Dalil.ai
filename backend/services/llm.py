import os
import json
from groq import Groq
from models.schemas import ProceduralResponse

client = Groq(api_key=os.getenv("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"))

PROMPT_TEMPLATE = """
You are Dalil, a Cameroonian administrative guide. Use ONLY the provided context to answer the user's question. Output exactly a JSON object with this structure:
{
  "summary": "brief overview string",
  "totalTime": "estimated total time",
  "totalCost": "estimated cost range",
  "steps": [
    {
      "stepNumber": 1,
      "title": "step title",
      "description": "what to do",
      "documents": ["doc1", "doc2"],
      "time": "time for this step",
      "cost": "cost for this step",
      "risk": "potential pitfalls or empty string",
      "sources": ["source title or url"]
    }
  ],
  "commonMistakes": ["mistake 1", "mistake 2"],
  "sources": [
    {"title": "source title", "url": "url", "snippet": "short description"}
  ]
}

Context:
{context}

User question: {question}
"""

async def generate_procedure(question: str, context: str) -> ProceduralResponse:
    prompt = PROMPT_TEMPLATE.format(context=context[:4000], question=question)
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    raw = response.choices[0].message.content
    # Validate and parse
    return ProceduralResponse.model_validate_json(raw)