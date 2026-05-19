from fastapi import APIRouter, Query, HTTPException
from data import loader

router = APIRouter(prefix="/api/retailers", tags=["retailers"])


@router.get("")
def list_retailers(rep_id: str = Query(default="REP_0001"), limit: int = 20):
    retailers = loader.get_retailers_for_rep(rep_id, limit=limit)
    result = []
    for r in retailers:
        inv = loader.get_inventory_for_retailer(r["retailer_id"])
        stockouts = [i for i in inv if i["sku_qty"] == 0]
        low = [i for i in inv if 0 < i["sku_qty"] <= 5]
        result.append({
            **r,
            "inventory_items": len(inv),
            "stockout_count": len(stockouts),
            "low_stock_count": len(low),
            "stockout_skus": [s["sku_name"] for s in stockouts[:3]],
        })
    return {"retailers": result}


@router.get("/{retailer_id}")
def get_retailer(retailer_id: str):
    retailers = loader.get("retailers")
    if retailers.empty:
        raise HTTPException(status_code=503, detail="Data not loaded")
    rows = retailers[retailers["retailer_id"] == retailer_id]
    if rows.empty:
        raise HTTPException(status_code=404, detail=f"Retailer {retailer_id!r} not found")
    r = rows.iloc[0].to_dict()
    inv = loader.get_inventory_for_retailer(retailer_id)
    return {
        **r,
        "inventory": inv,
        "stockout_count": len([i for i in inv if i["sku_qty"] == 0]),
        "low_stock_count": len([i for i in inv if 0 < i["sku_qty"] <= 5]),
    }
