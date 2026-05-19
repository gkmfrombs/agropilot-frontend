import math
from fastapi import APIRouter, Query, HTTPException
from data import loader

router = APIRouter(prefix="/api/farmers", tags=["farmers"])


def _safe_float(v: object, default: float = 0.0) -> float:
    try:
        f = float(v)  # type: ignore[arg-type]
        return default if (math.isnan(f) or math.isinf(f)) else f
    except (ValueError, TypeError):
        return default


def enrich_grower(g: dict) -> dict:
    cal = g.get("grower_crop_calendar", {})
    stages = cal.get("stages", [])
    return {
        "id": g["grower_id"],
        "district": str(g.get("district", "") or ""),
        "tehsil": str(g.get("tehsil", "") or ""),
        "state": str(g.get("state", "") or ""),
        "age": int(_safe_float(g.get("grower_age", 0))),
        "gender": str(g.get("gender", "") or ""),
        "farm_size_acres": round(_safe_float(g.get("grower_farm_size")), 1),
        "language": g.get("language", "Hindi"),
        "device_type": g.get("device_type", "smartphone"),
        "crop": cal.get("crop", "wheat"),
        "season": cal.get("season", "Rabi_2025-26"),
        "current_stage": stages[-1]["stage"] if stages else "tillering",
        "stages": stages,
        "harvest_start": cal.get("harvest", {}).get("start", ""),
        "scanned_product": g.get("product_name") if g.get("product_scan") else None,
        "campaign_attended": g.get("offline_campaign_attended", False),
    }


@router.get("")
def list_farmers(rep_id: str = Query(default="REP_0001"), limit: int = 20):
    growers = loader.get_growers_for_rep(rep_id, limit=limit)
    return {"farmers": [enrich_grower(g) for g in growers]}


@router.get("/{farmer_id}")
def get_farmer(farmer_id: str):
    growers = loader.get("growers")
    if growers.empty:
        raise HTTPException(status_code=503, detail="Data not loaded")
    rows = growers[growers["grower_id"] == farmer_id]
    if rows.empty:
        raise HTTPException(status_code=404, detail=f"Farmer {farmer_id!r} not found")
    return enrich_grower(rows.iloc[0].to_dict())
