import json
from fastapi import APIRouter, Query
from services.claude import chat
from services.context import build_rep_context, SYSTEM_PROMPT_BRIEFING

router = APIRouter(prefix="/api/briefing", tags=["briefing"])


@router.get("")
def get_briefing(rep_id: str = Query(default="REP_0001")):
    context = build_rep_context(rep_id)
    user_msg = f"Generate today's morning briefing for rep {rep_id}. Date: May 17, 2026.\n\nContext:\n{context}"

    raw = chat(SYSTEM_PROMPT_BRIEFING, [{"role": "user", "content": user_msg}], max_tokens=1200)

    # Try to parse JSON, fall back to raw text
    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        briefing = json.loads(raw[start:end])
    except Exception:
        briefing = {"raw": raw}

    return {"rep_id": rep_id, "date": "2026-05-17", "briefing": briefing}
