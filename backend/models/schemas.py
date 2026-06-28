from pydantic import BaseModel
from typing import List, Optional

class Source(BaseModel):
    title: str
    url: str
    snippet: str

class Step(BaseModel):
    stepNumber: int
    title: str
    description: str
    documents: List[str]
    time: str
    cost: str
    risk: str
    sources: List[str]

class ProceduralResponse(BaseModel):
    summary: str
    totalTime: str
    totalCost: str
    steps: List[Step]
    commonMistakes: List[str]
    sources: List[Source]

class QueryRequest(BaseModel):
    query: str