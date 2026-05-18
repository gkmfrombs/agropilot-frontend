from fastapi import APIRouter, Query
from data import loader

router = APIRouter(prefix="/api/farmers", tags=["farmers"])


def enrich_grower(g: dict) -> dict:
    cal = g.get("grower_crop_calendar", {})
    stages = cal.get("stages", [])
    return {
        "id": g["grower_id"],
        "district": g.get("district", ""),
        "tehsil": g.get("tehsil", ""),
        "state": g.get("state", ""),
        "age": g.get("grower_age", ""),
        "gender": g.get("gender", ""),
        "farm_size_acres": round(float(g.get("grower_farm_size", 0)), 1),
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
        return {"error": "No data"}
    rows = growers[growers["grower_id"] == farmer_id]
    if rows.empty:
        return {"error": "Farmer not found"}
    return enrich_grower(rows.iloc[0].to_dict())
