from models.schemas import ProceduralResponse, Step, Source

def get_fallback_response(question: str) -> ProceduralResponse:
    return ProceduralResponse(
        summary=f"No specific Cameroonian procedure found for '{question}'. Please try rephrasing with common administrative terms.",
        totalTime="Unknown",
        totalCost="Unknown",
        steps=[],
        commonMistakes=["Query too vague or not covered in current knowledge base."],
        sources=[]
    )