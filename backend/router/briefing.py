from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from config import llm
from data_utils import get_reps_territory

router = APIRouter(prefix="/api/briefing")

class BriefingResponse(BaseModel):
    briefing_text: str

@router.get("", response_model=BriefingResponse)
async def get_briefing(rep_id: Optional[str] = "REP_0001"):
    territory = get_reps_territory()
    
    context = "You are an AI assistant providing a morning briefing for an agricultural sales rep."
    
    if not territory.empty:
        rep_data = territory[territory['rep_id'] == rep_id]
        if not rep_data.empty:
            row = rep_data.iloc[0]
            district = row.get("district", "Unknown")
            state = row.get("state", "Unknown")
            context += f"\nThe rep operates in {district}, {state}."

    prompt = f"{context}\nGenerate a short, motivating morning briefing (2-3 sentences) focusing on today's priorities, weather impact, and farmer visits."

    if not llm:
        return BriefingResponse(briefing_text="Good morning! Today is a great day to visit your farmers and check on their crop health.")

    try:
        response = llm.invoke(prompt).content.strip()
        return BriefingResponse(briefing_text=response)
    except Exception as e:
        print(f"Briefing generation error: {e}")
        return BriefingResponse(briefing_text="Good morning! Today is a great day to visit your farmers and check on their crop health.")
