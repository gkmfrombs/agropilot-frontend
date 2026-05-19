from datetime import datetime
from fastapi import APIRouter, Query
from data import loader

router = APIRouter(prefix="/api/route", tags=["route"])


@router.get("")
def get_optimized_route(rep_id: str = Query(default="REP_0001"), date: str = Query(default="2026-05-17")):
    retailers = loader.get_retailers_for_rep(rep_id, limit=8)
    visits = loader.get_visit_history_for_rep(rep_id, limit=200)

    # Visit log is tehsil-level — build tehsil → most-recent visit_date map.
    tehsil_last_visit: dict[str, datetime] = {}
    for v in visits:
        tehsil = v.get("visit_tehsil", "")
        if not tehsil or tehsil in tehsil_last_visit:
            continue
        raw_date = v.get("visit_date")
        if raw_date is None:
            continue
        if hasattr(raw_date, "to_pydatetime"):
            tehsil_last_visit[tehsil] = raw_date.to_pydatetime()
        elif isinstance(raw_date, datetime):
            tehsil_last_visit[tehsil] = raw_date
        else:
            try:
                tehsil_last_visit[tehsil] = datetime.fromisoformat(str(raw_date))
            except ValueError:
                pass

    now = datetime.now()

    route_stops = []
    for i, r in enumerate(retailers[:6]):
        retailer_id = r["retailer_id"]
        tehsil = r.get("tehsil", "")
        last_visit_dt = tehsil_last_visit.get(tehsil)

        if last_visit_dt is not None:
            # Strip timezone info if present so subtraction is safe
            if last_visit_dt.tzinfo is not None:
                last_visit_dt = last_visit_dt.replace(tzinfo=None)
            last_visit_days = (now - last_visit_dt).days
        else:
            # Never visited — treat as 30 days to give it elevated priority
            last_visit_days = 30

        priority = "high" if last_visit_days > 14 else ("medium" if last_visit_days > 7 else "low")
        route_stops.append({
            "stop_number": i + 1,
            "retailer_id": retailer_id,
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
