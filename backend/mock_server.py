"""
AgroPilot Mock API — prototype only.
Hardcoded data sampled from real Syngenta hackathon CSVs.
No LLM, no DB. Just fast JSON for frontend demo.
Run: python mock_server.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="AgroPilot Mock API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# ── Data (sampled from real CSVs) ─────────────────────────────────────

FARMERS = [
    {"id": "GRW_00001", "name": "Ramesh Yadav", "state": "Rajasthan", "district": "Bharatpur",
     "tehsil": "Bharatpur_T023", "age": 67, "gender": "male", "farm_size_acres": 3.54,
     "crop": "wheat", "stage": "flowering", "language": "Hindi", "device": "smartphone",
     "risk": "high", "risk_reason": "48mm rain + 82% humidity → Septoria blight risk"},
    {"id": "GRW_00002", "name": "Suresh Kumar", "state": "Uttar Pradesh", "district": "Kanpur Nagar",
     "tehsil": "Kanpur_Nagar_T023", "age": 71, "gender": "male", "farm_size_acres": 1.34,
     "crop": "wheat", "stage": "tillering", "language": "Hindi", "device": "smartphone",
     "risk": "medium", "risk_reason": "Wild oat pressure — Topik 15 WP recommended"},
    {"id": "GRW_00003", "name": "Gurpreet Singh", "state": "Punjab", "district": "Patiala",
     "tehsil": "Patiala_T104", "age": 52, "gender": "male", "farm_size_acres": 0.55,
     "crop": "wheat", "stage": "heading", "language": "Punjabi", "device": "smartphone",
     "risk": "low", "risk_reason": "Crop healthy, routine monitoring"},
    {"id": "GRW_00004", "name": "Mohan Lal", "state": "Rajasthan", "district": "Jaipur",
     "tehsil": "Jaipur_T007", "age": 65, "gender": "male", "farm_size_acres": 0.79,
     "crop": "mustard", "stage": "flowering", "language": "Hindi", "device": "keypad",
     "risk": "high", "risk_reason": "Alternaria blight — Score 250 EC window open"},
    {"id": "GRW_00005", "name": "Priya Devi", "state": "Uttar Pradesh", "district": "Kanpur Nagar",
     "tehsil": "Kanpur_Nagar_T124", "age": 26, "gender": "female", "farm_size_acres": 1.33,
     "crop": "wheat", "stage": "flowering", "language": "Hindi", "device": "smartphone",
     "risk": "high", "risk_reason": "First-time grower, high disease risk period"},
]

RETAILERS = [
    {"id": "RTL_00001", "name": "Kisan Agro Store", "owner": "Bharat Agarwal",
     "district": "Patna", "tehsil": "Patna_T012", "state": "Bihar",
     "days_since_visit": 3, "stockout_skus": [], "low_stock_skus": ["Score 250 EC"],
     "inventory": [
         {"sku": "SY_TILT_250EC", "name": "Tilt 250 EC", "qty": 94},
         {"sku": "SY_SCO_250EC", "name": "Score 250 EC", "qty": 4},
         {"sku": "SY_AXI_50EC", "name": "Axial 50 EC", "qty": 193},
     ]},
    {"id": "RTL_00002", "name": "Raj Krishi Kendra", "owner": "Rajesh Sharma",
     "district": "Patna", "tehsil": "Patna_T004", "state": "Bihar",
     "days_since_visit": 12, "stockout_skus": ["Topik 15 WP"], "low_stock_skus": [],
     "inventory": [
         {"sku": "SY_TILT_250EC", "name": "Tilt 250 EC", "qty": 22},
         {"sku": "SY_TOP_15WP", "name": "Topik 15 WP", "qty": 0},
         {"sku": "SY_ACT_25WG", "name": "Actara 25 WG", "qty": 45},
     ]},
    {"id": "RTL_00003", "name": "Green Fields Supply", "owner": "Anil Verma",
     "district": "Kanpur Nagar", "tehsil": "Kanpur_Nagar_T023", "state": "Uttar Pradesh",
     "days_since_visit": 18, "stockout_skus": [], "low_stock_skus": ["Kavach 75 WP"],
     "inventory": [
         {"sku": "SY_KAV_75WP", "name": "Kavach 75 WP", "qty": 3},
         {"sku": "SY_VER_18EC", "name": "Vertimec 1.8 EC", "qty": 67},
     ]},
]

ALERTS = [
    {"id": "ALT_001", "type": "disease_risk", "severity": "critical",
     "title": "Blight outbreak risk — Wheat flowering zone",
     "description": "48mm rainfall + 82% humidity = high Septoria blight risk. 14 farmers at flowering stage. Intervene within 48h.",
     "product": "Tilt 250 EC", "sku": "SY_TILT_250EC", "affected_farmers": 14,
     "action": "Pitch Tilt 250 EC at 200ml/acre. In-stock at RTL_00001.", "created_at": "2026-05-17T06:00:00Z"},
    {"id": "ALT_002", "type": "stockout", "severity": "high",
     "title": "Topik 15 WP — Stockout at RTL_00002",
     "description": "Wild oat pressure is high. Topik demand spike, RTL_00002 out of stock.",
     "product": "Topik 15 WP", "sku": "SY_TOP_15WP", "affected_retailers": 1,
     "action": "Alert distributor. Redirect to RTL_00001 (good stock).", "created_at": "2026-05-16T18:00:00Z"},
    {"id": "ALT_003", "type": "opportunity", "severity": "medium",
     "title": "Actara 25 WG — Aphid season window open",
     "description": "Aphid populations 2x above baseline. 67 growers at tillering stage.",
     "product": "Actara 25 WG", "sku": "SY_ACT_25WG", "affected_farmers": 67,
     "action": "Pitch Actara at next retailer meetings. ROI: ₹3,200/acre protection vs ₹1,200 treatment.", "created_at": "2026-05-15T09:00:00Z"},
    {"id": "ALT_004", "type": "visit_overdue", "severity": "medium",
     "title": "3 retailers not visited in 14+ days",
     "description": "RTL_00002 (12 days), RTL_00003 (18 days) need follow-up. Risk of competitor capture.",
     "action": "Add to today's route. Priority: RTL_00002.", "created_at": "2026-05-17T07:00:00Z"},
    {"id": "ALT_005", "type": "weather", "severity": "low",
     "title": "Rain forecast in 48h — pre-emptive fungicide window",
     "description": "65% rain probability tomorrow. Pre-rain application most effective.",
     "product": "Score 250 EC", "sku": "SY_SCO_250EC",
     "action": "Contact 8 mustard growers for pre-rain Score application.", "created_at": "2026-05-17T08:00:00Z"},
]

VISITS = [
    {"rep_id": "REP_0001", "date": "2026-05-15", "tehsil": "Patna_T012", "type": "retailer meeting", "product": "Tilt 250 EC", "retailer": "RTL_00001"},
    {"rep_id": "REP_0001", "date": "2026-05-14", "tehsil": "Patna_T004", "type": "grower meeting", "product": "Actara 25 WG", "retailer": "RTL_00002"},
    {"rep_id": "REP_0001", "date": "2026-05-13", "tehsil": "Patna_T023", "type": "campaign_conducted", "product": "Topik 15 WP", "retailer": "RTL_00003"},
    {"rep_id": "REP_0001", "date": "2026-05-12", "tehsil": "Patna_T012", "type": "retailer meeting", "product": "Score 250 EC", "retailer": "RTL_00001"},
    {"rep_id": "REP_0001", "date": "2026-05-10", "tehsil": "Patna_T004", "type": "retailer meeting", "product": "Kavach 75 WP", "retailer": "RTL_00002"},
]

CAMPAIGN_DATA = [
    {"campaign_id": "CMP_RABI25_001", "crop": "wheat", "product": "Topik 15 WP",
     "impressions": 29663, "visits": 665, "leads": 47, "week": "2025-10-06"},
    {"campaign_id": "CMP_RABI25_002", "crop": "mustard", "product": "Score 250 EC",
     "impressions": 18420, "visits": 392, "leads": 31, "week": "2025-10-06"},
    {"campaign_id": "CMP_RABI25_003", "crop": "chickpea", "product": "Actara 25 WG",
     "impressions": 12800, "visits": 274, "leads": 22, "week": "2025-10-06"},
    {"campaign_id": "CMP_RABI25_004", "crop": "potato", "product": "Kavach 75 WP",
     "impressions": 9400, "visits": 201, "leads": 18, "week": "2025-10-06"},
]

ROUTE = [
    {"stop": 1, "retailer_id": "RTL_00002", "name": "Raj Krishi Kendra", "tehsil": "Patna_T004",
     "priority": "high", "reason": "18 days since visit + Topik stockout", "pitch": "Tilt 250 EC — blight risk high"},
    {"stop": 2, "retailer_id": "RTL_00003", "name": "Green Fields Supply", "tehsil": "Kanpur_Nagar_T023",
     "priority": "high", "reason": "18 days since visit", "pitch": "Actara 25 WG — aphid season"},
    {"stop": 3, "retailer_id": "RTL_00001", "name": "Kisan Agro Store", "tehsil": "Patna_T012",
     "priority": "medium", "reason": "Score 250 EC running low (4 units)", "pitch": "Score 250 EC — restock before rain"},
]

BRIEFING = {
    "date": "2026-05-17",
    "rep_name": "Arjun Mehta",
    "priority_visits": [
        {"retailer": "Raj Krishi Kendra", "id": "RTL_00002", "reason": "Topik stockout + 18 days no visit"},
        {"retailer": "Green Fields Supply", "id": "RTL_00003", "reason": "Kavach low stock (3 units)"},
    ],
    "risk_alert": {
        "title": "Septoria Blight — Critical Window",
        "detail": "48mm rain last 7 days + 82% humidity. 14 wheat growers at flowering stage. Treat within 48h.",
        "product": "Tilt 250 EC",
        "confidence": 94,
    },
    "top_pitch": {
        "farmer": "Ramesh Yadav (GRW_00001)",
        "crop": "Wheat, 3.54 acres, flowering",
        "product": "Tilt 250 EC",
        "dose": "200ml/acre in 200L water",
        "stock": "Kisan Agro Store — 94 units, 2km",
    },
    "inventory_alert": "Topik 15 WP: 0 units at RTL_00002. Score 250 EC: 4 units at RTL_00001 (low).",
    "insight": "Territory coverage 64%. 3 retailers overdue for visit. Competitor activity reported in Patna_T004.",
    "weather": {"temp_c": 24, "humidity": 82, "rain_7d_mm": 48, "forecast": "Rain in 48h (65% probability)"},
}


# ── Endpoints ──────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "app": "AgroPilot Mock API", "docs": "/docs"}

@app.post("/auth/login")
def login(body: dict):
    creds = {"arjun": "rep", "manager": "manager"}
    names = {"arjun": "Arjun Mehta", "manager": "Priya Sharma"}
    user = body.get("username", "").lower()
    if user in creds and body.get("password") == "agropilot2026":
        return {"token": "mock-token-123", "role": creds[user], "rep_id": "REP_0001", "name": names[user]}
    return {"error": "Invalid credentials"}, 401

@app.get("/api/briefing")
def briefing():
    return {"briefing": BRIEFING}

@app.get("/api/alerts")
def alerts():
    return {"total": len(ALERTS), "alerts": ALERTS}

@app.get("/api/alerts/{alert_id}")
def alert_detail(alert_id: str):
    for a in ALERTS:
        if a["id"] == alert_id:
            return a
    return {"error": "not found"}

@app.get("/api/farmers")
def farmers():
    return {"total": len(FARMERS), "farmers": FARMERS}

@app.get("/api/farmers/{farmer_id}")
def farmer(farmer_id: str):
    for f in FARMERS:
        if f["id"] == farmer_id:
            return f
    return {"error": "not found"}

@app.get("/api/retailers")
def retailers():
    return {"total": len(RETAILERS), "retailers": RETAILERS}

@app.get("/api/retailers/{retailer_id}")
def retailer(retailer_id: str):
    for r in RETAILERS:
        if r["id"] == retailer_id:
            return r
    return {"error": "not found"}

@app.get("/api/route")
def route():
    return {"rep_id": "REP_0001", "date": "2026-05-17", "stops": len(ROUTE), "route": ROUTE}

@app.get("/api/visits")
def visits():
    return {"visits": VISITS}

@app.post("/api/calculator/roi")
def roi(body: dict):
    crop = body.get("crop", "wheat")
    size = float(body.get("farm_size_acres", 2))
    severity = body.get("disease_severity", "moderate")
    loss = {"mild": 0.10, "moderate": 0.25, "severe": 0.45}.get(severity, 0.25)
    yield_val = {"wheat": 18 * 2275, "mustard": 8 * 5650, "chickpea": 6 * 5440, "potato": 120 * 800}.get(crop, 40950)
    gross = yield_val * size
    loss_val = gross * loss
    treatment = 850 * size
    roi_val = loss_val * 0.85 - treatment
    return {
        "gross_value_inr": round(gross),
        "yield_loss_without_treatment_inr": round(loss_val),
        "treatment_cost_inr": round(treatment),
        "net_roi_inr": round(roi_val),
        "roi_ratio": round((loss_val * 0.85) / treatment, 1),
        "recommendation": f"For every ₹1 spent, farmer saves ₹{round((loss_val * 0.85) / treatment, 1)}",
    }

@app.post("/api/chat")
def chat(body: dict):
    msg = body.get("messages", [{}])[-1].get("content", "").lower()
    if any(w in msg for w in ["blight", "ramesh", "pitch", "recommend"]):
        return {"response": "Based on current weather (48mm rain, 82% humidity) and Ramesh's wheat at flowering stage, recommend **Tilt 250 EC** immediately. Dose: 200ml/acre in 200L water. Available at Kisan Agro Store (94 units, 2km away). 94% confidence — same pattern as 2023 Patna outbreak."}
    if any(w in msg for w in ["stock", "inventory"]):
        return {"response": "Topik 15 WP: OUT OF STOCK at RTL_00002. Score 250 EC: LOW (4 units) at RTL_00001. Tilt 250 EC: Healthy across territory (94 units at RTL_00001)."}
    if any(w in msg for w in ["dose", "dosage", "apply"]):
        return {"response": "Tilt 250 EC on wheat: **200ml per acre** mixed in 200L water. Best applied early morning or late afternoon. Avoid application if rain expected within 6 hours. Repeat after 14 days if needed."}
    if any(w in msg for w in ["route", "visit", "today"]):
        return {"response": "Priority today: 1) RTL_00002 (Topik stockout, 18 days no visit) 2) RTL_00003 (Kavach low) 3) RTL_00001 (Score restock). Estimated 4.5 hours total."}
    return {"response": "I can help with product recommendations, inventory status, crop advice, and territory intelligence. Try: 'What should I pitch to Ramesh?' or 'Check inventory status'."}

@app.post("/api/scan/demo")
def scan_demo(body: dict):
    symptom = body.get("symptom", "yellow patches")
    return {"scan_result": {
        "disease": "Septoria Leaf Blotch",
        "crop": "Wheat",
        "severity": "moderate",
        "products": ["Tilt 250 EC", "Score 250 EC"],
        "dose": "200ml Tilt 250 EC per acre in 200L water",
        "timing": "Apply immediately. Repeat after 14 days.",
        "urgency": "treat_within_48h",
        "explanation": f"Symptom '{symptom}' matches Septoria blight pattern. High humidity conditions favor rapid spread. Tilt 250 EC is first-line treatment for wheat fungal infections.",
        "confidence": 89,
    }}

@app.get("/api/manager/kpi")
def kpi():
    return {
        "total_visits_mtd": 312,
        "total_reps": 8,
        "avg_visits_per_rep": 39,
        "revenue_mtd_lakh": 84.3,
        "revenue_target_lakh": 120.0,
        "ai_accept_rate_pct": 76,
        "coverage_pct": 64,
        "top_product": "Tilt 250 EC",
        "top_product_units": 1842,
        "alerts_active": 5,
    }

@app.get("/api/manager/reps")
def reps_performance():
    return {"reps": [
        {"rep_id": "REP_0001", "name": "Arjun Mehta", "territory": "Patna North", "state": "Bihar",
         "visits": 58, "revenue_lakh": 12.4, "coverage_pct": 64, "ai_accept_rate": 78, "top_product": "Tilt 250 EC"},
        {"rep_id": "REP_0002", "name": "Priya Singh", "territory": "Hisar South", "state": "Haryana",
         "visits": 72, "revenue_lakh": 18.2, "coverage_pct": 81, "ai_accept_rate": 84, "top_product": "Topik 15 WP"},
        {"rep_id": "REP_0003", "name": "Ravi Kumar", "territory": "Jalgaon West", "state": "Maharashtra",
         "visits": 45, "revenue_lakh": 9.8, "coverage_pct": 52, "ai_accept_rate": 71, "top_product": "Score 250 EC"},
        {"rep_id": "REP_0004", "name": "Sunita Patel", "territory": "Bharatpur East", "state": "Rajasthan",
         "visits": 61, "revenue_lakh": 14.1, "coverage_pct": 73, "ai_accept_rate": 82, "top_product": "Actara 25 WG"},
    ]}

@app.get("/api/manager/territory")
def territory():
    return {"territories": [
        {"id": "TER_0001", "name": "Patna North", "state": "Bihar", "district": "Patna",
         "visits": 58, "risk_level": "medium", "revenue_lakh": 12.4, "coverage_pct": 64},
        {"id": "TER_0002", "name": "Hisar South", "state": "Haryana", "district": "Hisar",
         "visits": 72, "risk_level": "low", "revenue_lakh": 18.2, "coverage_pct": 81},
        {"id": "TER_0203", "name": "Jalgaon West", "state": "Maharashtra", "district": "Jalgaon",
         "visits": 45, "risk_level": "high", "revenue_lakh": 9.8, "coverage_pct": 52},
        {"id": "TER_0004", "name": "Bharatpur East", "state": "Rajasthan", "district": "Bharatpur",
         "visits": 61, "risk_level": "medium", "revenue_lakh": 14.1, "coverage_pct": 73},
    ]}

@app.get("/api/manager/campaigns")
def campaigns():
    return {"campaigns": CAMPAIGN_DATA}

@app.get("/api/sync/status")
def sync_status():
    return {"pending_uploads": 3, "last_synced": "2026-05-17T06:30:00Z", "offline_bundle_size_mb": 2.4}


if __name__ == "__main__":
    uvicorn.run("mock_server:app", host="0.0.0.0", port=8000, reload=True)
