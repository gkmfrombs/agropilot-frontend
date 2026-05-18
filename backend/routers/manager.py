from fastapi import APIRouter
from data import loader

router = APIRouter(prefix="/api/manager", tags=["manager"])


@router.get("/kpi")
def get_kpi():
    visits = loader.get("visits")
    reps = loader.get("reps")
    total_visits = len(visits) if not visits.empty else 0
    total_reps = len(reps) if not reps.empty else 0

    return {
        "total_visits_mtd": total_visits,
        "total_reps": total_reps,
        "avg_visits_per_rep": round(total_visits / total_reps, 1) if total_reps else 0,
        "revenue_mtd_lakh": 84.3,
        "revenue_target_lakh": 120.0,
        "ai_accept_rate_pct": 76,
        "coverage_pct": 64,
        "top_product": "Tilt 250 EC",
        "top_product_units": 1842,
        "alerts_active": 5,
        "alerts_resolved_today": 2,
    }


@router.get("/reps")
def get_rep_performance():
    reps = loader.get("reps")
    visits = loader.get("visits")
    result = []
    for _, rep in reps.head(10).iterrows():
        rep_visits = visits[visits["rep_id"] == rep["rep_id"]] if not visits.empty else []
        visit_count = len(rep_visits)
        products = list(rep_visits["product_recommended"].value_counts().head(2).index) if visit_count > 0 else []
        result.append({
            "rep_id": rep["rep_id"],
            "territory": rep.get("territory_name", ""),
            "state": rep.get("state", ""),
            "district": rep.get("district", ""),
            "visits_total": visit_count,
            "top_products": products,
            "revenue_lakh": round(visit_count * 0.08, 1),
            "coverage_pct": min(95, 40 + visit_count // 2),
            "ai_accept_rate_pct": 70 + (visit_count % 20),
        })
    return {"reps": result}


@router.get("/territory")
def get_territory_heatmap():
    reps = loader.get("reps")
    visits = loader.get("visits")
    if reps.empty:
        return {"territories": []}

    territories = []
    for _, rep in reps.head(20).iterrows():
        rep_visits = visits[visits["rep_id"] == rep["rep_id"]] if not visits.empty else []
        visit_count = len(rep_visits)
        territories.append({
            "territory_id": rep.get("territory_id", ""),
            "territory_name": rep.get("territory_name", ""),
            "state": rep.get("state", ""),
            "district": rep.get("district", ""),
            "rep_id": rep["rep_id"],
            "visit_count": visit_count,
            "risk_level": "high" if visit_count < 10 else ("medium" if visit_count < 30 else "low"),
            "revenue_lakh": round(visit_count * 0.08, 1),
        })
    return {"territories": territories}


@router.get("/campaigns")
def get_campaigns():
    funnel = loader.get_funnel_summary()
    return {"campaigns": funnel}
