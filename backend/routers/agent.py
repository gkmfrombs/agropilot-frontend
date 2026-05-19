"""
LangGraph-style multi-step agent for AgroPilot daily field planning.

Pipeline: graph_query → signal_fetch → score → llm_reason

Each step is a pure function that takes inputs and returns a typed dict.
No LangGraph library is required — the pattern is implemented directly
as a sequential function pipeline, making it easy to swap in a real
LangGraph StateGraph later if needed.
"""
from datetime import date
from fastapi import APIRouter
from data import loader
from services.claude import chat
from services.context import build_rep_context
from services.graphrag_queries import get_priority_retailers, get_oos_clusters

router = APIRouter(prefix='/api/agent', tags=['agent'])


# ---------------------------------------------------------------------------
# Step 1 — Query knowledge graph
# ---------------------------------------------------------------------------

def _query_graph_step(rep_id: str) -> dict:
    """Query the knowledge graph for priority retailers and OOS clusters."""
    priority = get_priority_retailers(rep_id, limit=5)
    clusters = get_oos_clusters(rep_id)
    return {
        'priority_retailers': priority,
        'oos_clusters': clusters,
        'step': 'graph_queried',
    }


# ---------------------------------------------------------------------------
# Step 2 — Fetch live signals (weather + campaign heat)
# ---------------------------------------------------------------------------

def _signal_step(rep_id: str) -> dict:
    """Fetch real-time weather conditions and the hottest running campaign."""
    from services.weather import get_weather

    rep = loader.get_rep(rep_id)
    district = rep.get('district', 'Pune') if rep else 'Pune'
    weather = get_weather(district)

    funnel = loader.get_funnel_summary()
    top_campaign = (
        max(funnel, key=lambda f: f.get('impressions', 0))
        if funnel
        else {}
    )

    return {
        'weather': weather.get('current', {}),
        'risk_flags': weather.get('risk_flags', []),
        'top_campaign': top_campaign,
        'step': 'signals_fetched',
    }


# ---------------------------------------------------------------------------
# Step 3 — Score and rank retailers
# ---------------------------------------------------------------------------

def _score_step(graph_result: dict, signals: dict) -> dict:
    """
    Boost graph priority scores with weather signals.

    Humidity >75% and recent heavy rainfall indicate elevated crop disease
    risk, making retailer visits more urgent — hence the additive boosts.
    """
    retailers = graph_result.get('priority_retailers', [])
    weather = signals.get('weather', {})
    humidity = weather.get('humidity_pct', 0)
    rainfall = weather.get('rainfall_7d_mm', 0)

    scored = []
    for r in retailers:
        base_score = r.get('priority_score', 0)
        weather_boost = 15 if humidity > 75 else (8 if humidity > 60 else 0)
        rainfall_boost = 10 if rainfall > 40 else 0
        final_score = base_score + weather_boost + rainfall_boost
        scored.append({**r, 'final_score': final_score})

    scored.sort(key=lambda x: x['final_score'], reverse=True)
    return {'scored_retailers': scored[:3], 'step': 'scored'}


# ---------------------------------------------------------------------------
# Step 4 — LLM reasoning (final plan generation)
# ---------------------------------------------------------------------------

def _reason_step(rep_id: str, graph: dict, signals: dict, scored: dict) -> str:
    """
    Generate the final actionable visit plan via LLM.

    Combines graph intelligence, weather risk, and scored retailers into a
    concise prompt so the model can produce a specific, grounded daily plan.
    """
    context = build_rep_context(rep_id)
    top = scored.get('scored_retailers', [])
    clusters = graph.get('oos_clusters', [])
    weather = signals.get('weather', {})
    risk_flags = signals.get('risk_flags', [])

    top_retailers_block = (
        chr(10).join(
            f'  {i + 1}. {r.get("retailer_id", "?")} ({r.get("tehsil", "?")}) '
            f'— score {r.get("final_score", 0)}'
            for i, r in enumerate(top)
        )
        or '  None found'
    )

    clusters_block = (
        chr(10).join(
            f'  {c.get("product", "?")} OOS at {c.get("oos_retailers", 0)} '
            f'retailers in {c.get("tehsil", "?")}'
            for c in clusters
        )
        or '  None detected'
    )

    data_block = f"""
TODAY: {date.today()}
REP: {rep_id}

TOP PRIORITY RETAILERS (graph-scored + weather-boosted):
{top_retailers_block}

STOCKOUT CLUSTERS:
{clusters_block}

WEATHER: {weather.get('humidity_pct', 0)}% humidity, {weather.get('rainfall_7d_mm', 0)}mm rainfall (7-day)
RISK FLAGS: {', '.join(risk_flags) or 'None'}
"""

    system = (
        'You are AgroPilot AI agent. You have completed a 4-step analysis pipeline: '
        'graph query → signal fetch → scoring → reasoning. '
        'Generate a concise, actionable daily field visit plan in 3-5 bullet points. '
        'Be specific: name retailers, products, and reasons. Keep it under 200 words.'
    )

    return chat(
        system,
        [{'role': 'user', 'content': f'Territory data:\n{context}\n\nAgent analysis:\n{data_block}\n\nCreate today\'s visit plan.'}],
        max_tokens=400,
    )


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.get('/daily-plan/{rep_id}')
def get_agent_daily_plan(rep_id: str):
    """
    4-step agentic pipeline: graph query → signal fetch → score → LLM reason.

    Demonstrates a LangGraph-style multi-step AI agent for AgroPilot field
    planning without requiring the LangGraph library.

    Returns structured data at each pipeline step plus the final LLM plan,
    so the frontend can display both the reasoning trace and the action items.
    """
    # Step 1: Query knowledge graph
    graph_result = _query_graph_step(rep_id)

    # Step 2: Fetch live signals
    signals = _signal_step(rep_id)

    # Step 3: Score and rank
    scored_result = _score_step(graph_result, signals)

    # Step 4: LLM reasoning
    final_plan = _reason_step(rep_id, graph_result, signals, scored_result)

    return {
        'rep_id': rep_id,
        'date': str(date.today()),
        'agent_steps': [
            {'step': 1, 'name': 'Graph Query', 'result': graph_result['step']},
            {'step': 2, 'name': 'Signal Fetch', 'result': signals['step']},
            {'step': 3, 'name': 'Scoring', 'result': scored_result['step']},
            {'step': 4, 'name': 'LLM Reasoning', 'result': 'complete'},
        ],
        'priority_retailers': scored_result.get('scored_retailers', []),
        'oos_clusters': graph_result.get('oos_clusters', []),
        'weather_signals': signals.get('weather', {}),
        'risk_flags': signals.get('risk_flags', []),
        'final_plan': final_plan,
    }
