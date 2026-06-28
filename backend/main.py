from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import QueryRequest, ProceduralResponse
from rag.retriever import retrieve
from services.llm import generate_procedure
from utils.cache import get_cache, set_cache
from utils.fallback import get_fallback_response
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/query", response_model=ProceduralResponse)
async def handle_query(req: QueryRequest):
    # 1. Check cache
    cached = await get_cache(req.query)
    if cached:
        return cached

    # 2. Retrieve relevant context
    contexts = retrieve(req.query)
    context_text = "\n\n".join(contexts)

    # 3. If no context found, return fallback
    if not context_text.strip():
        fallback = get_fallback_response(req.query)
        await set_cache(req.query, fallback.model_dump(), ttl=600)
        return fallback

    # 4. Generate structured answer
    try:
        procedure = await generate_procedure(req.query, context_text)
    except Exception as e:
        print(f"LLM error: {e}")
        procedure = get_fallback_response(req.query)

    # 5. Cache and return
    await set_cache(req.query, procedure.model_dump(), ttl=3600)
    return procedure