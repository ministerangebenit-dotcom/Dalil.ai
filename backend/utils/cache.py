import os
import json
import redis.asyncio as redis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.from_url(REDIS_URL, decode_responses=True)

async def get_cache(query: str):
    data = await r.get(query)
    return json.loads(data) if data else None

async def set_cache(query: str, value, ttl: int = 3600):
    await r.setex(query, ttl, json.dumps(value))