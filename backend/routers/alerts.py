from fastapi import APIRouter, Query
from data import loader
from services.context import WEATHER_MOCK

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

# Static high-value alerts derived from data patterns + weather signals
STATIC_ALERTS = [
    {
        "id": "ALT_001",
        "type": "disease_risk",
        "severity": "critical",
        "title": "Blight outbreak risk — Wheat flowering zone",
        "description": "48mm rainfall + 82% humidity = high Septoria blight risk for wheat at flowering stage. Historical 2023 outbreak in same tehsils. Intervene within 48h.",
        "product": "Tilt 250 EC",
        "sku": "SY_TILT_250EC",
        "affected_farmers": 14,
        "action": "Pitch Tilt 250 EC at 200ml/acre. In-stock at 3 retailers in territory.",
        "created_at": "2026-05-17T06:00:00Z",
        "expires_at": "2026-05-19T06:00:00Z",
    },
    {
        "id": "ALT_002",
        "type": "stockout",
        "severity": "high",
        "title": "Topik 15 WP — Stockout at 3 retailers",
        "description": "Wild oat pressure is high this season. Topik demand spike (+40% WoW) has depleted stock at RTL_00012, RTL_00034, RTL_00067.",
        "product": "Topik 15 WP",
        "sku": "SY_TOP_15WP",
        "affected_retailers": 3,
        "action": "Alert distributor. Redirect farmers to RTL_00089 (12 units in stock).",
        "created_at": "2026-05-16T18:00:00Z",
        "expires_at": "2026-05-20T00:00:00Z",
    },
    {
        "id": "ALT_003",
        "type": "opportunity",
        "severity": "medium",
        "title": "Actara 25 WG — Aphid season window open",
        "description": "Aphid populations tracking 2x above seasonal baseline. 67 growers in territory at tillering stage — peak aphid risk period.",
        "product": "Actara 25 WG",
        "sku": "SY_ACT_25WG",
        "affected_farmers": 67,
        "action": "Pitch Actara at next retailer meetings. ROI: ₹3,200/acre protection vs. ₹1,200 treatment cost.",
        "created_at": "2026-05-15T09:00:00Z",
        "expires_at": "2026-05-22T00:00:00Z",
    },
    {
        "id": "ALT_004",
        "type": "visit_overdue",
        "severity": "medium",
        "title": "12 retailers not visited in 14+ days",
        "description": "Coverage gap detected. RTL_00023, RTL_00045, and 10 others have no logged visit in 2 weeks. Risk of competitor capture.",
        "action": "Add to today's route. Priority: RTL_00023 (₹84k annual revenue).",
        "created_at": "2026-05-17T07:00:00Z",
        "expires_at": "2026-05-24T00:00:00Z",
    },
    {
        "id": "ALT_005",
        "type": "weather",
        "severity": "low",
        "title": "Rain forecast in 48h — pre-emptive fungicide window",
        "description": "65% rain probability tomorrow. Pre-rain fungicide application is most effective. Immediate pitch window for Score 250 EC on mustard growers.",
        "product": "Score 250 EC",
        "sku": "SY_SCO_250EC",
        "action": "Contact 8 mustard growers today for pre-rain Score application advice.",
        "created_at": "2026-05-17T08:00:00Z",
        "expires_at": "2026-05-18T00:00:00Z",
    },
]


@router.get("")
def get_alerts(rep_id: str = Query(default="REP_0001"), severity: str | None = None):
    alerts = STATIC_ALERTS.copy()
    # Append real stockout alerts from data
    real_stockouts = loader.get_stockout_alerts()[:3]
    for s in real_stockouts:
        alerts.append({
            "id": f"ALT_STOCK_{s['retailer_id']}_{s['sku_id']}",
            "type": "stockout",
            "severity": "high",
            "title": f"{s['sku_name']} — Out of stock at {s['retailer_id']}",
            "description": f"Zero units of {s['sku_name']} at retailer {s['retailer_id']}. Demand-supply mismatch detected.",
            "product": s["sku_name"],
            "action": "Visit retailer and process reorder with distributor.",
            "created_at": "2026-05-17T06:00:00Z",
        })

    if severity:
        alerts = [a for a in alerts if a.get("severity") == severity]

    return {"rep_id": rep_id, "total": len(alerts), "alerts": alerts}


@router.get("/{alert_id}")
def get_alert(alert_id: str):
    from fastapi import HTTPException
    for a in STATIC_ALERTS:
        if a["id"] == alert_id:
            return a
    raise HTTPException(status_code=404, detail="Alert not found")
