import json
from datetime import datetime
from fastapi import APIRouter, Query
from services.claude import chat
from services.context import build_rep_context, SYSTEM_PROMPT_BRIEFING
from routers.route_planning import get_optimized_route

router = APIRouter(prefix='/api/briefing', tags=['briefing'])


@router.get('')
def get_briefing(rep_id: str = Query(default='REP_0001')):
    """
    Morning briefing for a field rep.

    Returns two things:
      - briefing: LLM-generated JSON (priority_visits, risk_alert, top_pitch,
                  inventory_alert, insight)
      - priority_visits: structured route stops from the route-planning engine,
                         so the frontend can render real visit cards without
                         waiting for LLM parsing.
    """
    context = build_rep_context(rep_id)
    user_msg = (
        f'Generate today\'s morning briefing for rep {rep_id}. '
        f'Date: {datetime.now().strftime("%B %d, %Y")}.\n\nContext:\n{context}'
    )

    raw = chat(SYSTEM_PROMPT_BRIEFING, [{'role': 'user', 'content': user_msg}], max_tokens=800)

    # Parse LLM JSON; fall back to raw text so the endpoint never 500s
    try:
        start = raw.index('{')
        end = raw.rindex('}') + 1
        briefing = json.loads(raw[start:end])
    except Exception:
        briefing = {'raw': raw}

    # Structured visit cards from the route-planning engine
    # Using today's date so priority (days_since_last_visit) is current
    today = datetime.now().strftime('%Y-%m-%d')
    try:
        route = get_optimized_route(rep_id=rep_id, date=today)
        priority_visits = route.get('route', [])[:6]
    except Exception:
        priority_visits = []

    return {
        'rep_id': rep_id,
        'date': datetime.now().date().isoformat(),
        'briefing': briefing,
        'priority_visits': priority_visits,  # structured real data for visit cards
        'total_stops': len(priority_visits),
    }
