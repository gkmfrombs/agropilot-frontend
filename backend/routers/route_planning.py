from fastapi import APIRouter, Query
from data import loader

router = APIRouter(prefix="/api/route", tags=["route"])


@router.get("")
def get_optimized_route(rep_id: str = Query(default="REP_0001"), date: str = Query(default="2026-05-17")):
    retailers = loader.get_retailers_for_rep(rep_id, limit=8)
    visits = loader.get_visit_history_for_rep(rep_id, limit=50)

    # Mark recently visited
    visited_recently = set()
    for v in visits:
        if hasattr(v.get("visit_date"), "strftime"):
            visited_recently.add(v.get("retailer_id", ""))

    route_stops = []
    for i, r in enumerate(retailers[:6]):
        last_visit_days = 8 + (i * 3)  # simulated days since last visit
        priority = "high" if last_visit_days > 14 else ("medium" if last_visit_days > 7 else "low")
        route_stops.append({
            "stop_number": i + 1,
            "retailer_id": r["retailer_id"],
            "tehsil": r.get("tehsil", ""),
            "district": r.get("district", ""),
            "priority": priority,
            "days_since_last_visit": last_visit_days,
            "estimated_time_min": 30 + (i * 5),
            "pitch": _recommend_pitch(i),
        })

    return {
        "rep_id": rep_id,
        "date": date,
        "total_stops": len(route_stops),
        "estimated_total_hours": round(sum(s["estimated_time_min"] for s in route_stops) / 60, 1),
        "route": route_stops,
    }


def _recommend_pitch(idx: int) -> str:
    pitches = [
        "Tilt 250 EC — wheat blight risk high this week",
        "Actara 25 WG — aphid season, push stock",
        "Score 250 EC — pre-rain mustard protection",
        "Topik 15 WP — wild oat pressure, restock needed",
        "Kavach 75 WP — potato late blight prevention",
        "Vertimec 1.8 EC — mite infestation reports nearby",
    ]
    return pitches[idx % len(pitches)]
