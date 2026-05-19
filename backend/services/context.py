"""
Builds rich GraphRAG-style context from real CSV data for Claude.
This is what makes the AI feel connected to the actual territory data.
"""
import json
from data import loader

PRODUCTS_CATALOG = {
    "SY_TILT_250EC": {
        "name": "Tilt 250 EC",
        "sku": "SY_TILT_250EC",
        "category": "Fungicide",
        "crops": ["wheat", "barley", "rice"],
        "diseases": ["Septoria blight", "Powdery mildew", "Rust", "Helminthosporium"],
        "dose": "200ml per acre in 200L water",
        "timing": "Apply at flowering/heading stage. Repeat after 14 days if needed.",
        "price_per_unit": 850,
        "margin": "18%",
    },
    "SY_SCO_250EC": {
        "name": "Score 250 EC",
        "sku": "SY_SCO_250EC",
        "category": "Fungicide",
        "crops": ["wheat", "mustard", "potato"],
        "diseases": ["Brown rust", "Yellow rust", "Alternaria blight"],
        "dose": "250ml per acre",
        "timing": "Apply at disease onset. Pre-emptive application recommended in high-risk conditions.",
        "price_per_unit": 920,
        "margin": "20%",
    },
    "SY_TOP_15WP": {
        "name": "Topik 15 WP",
        "sku": "SY_TOP_15WP",
        "category": "Herbicide",
        "crops": ["wheat"],
        "weeds": ["Wild oat", "Canary grass", "Ryegrass"],
        "dose": "160g per acre",
        "timing": "Apply at 2-3 leaf stage of weeds.",
        "price_per_unit": 680,
        "margin": "22%",
    },
    "SY_ACT_25WG": {
        "name": "Actara 25 WG",
        "sku": "SY_ACT_25WG",
        "category": "Insecticide",
        "crops": ["wheat", "chickpea", "potato"],
        "pests": ["Aphids", "Whitefly", "Thrips", "BPH"],
        "dose": "80g per acre",
        "timing": "Apply at pest appearance. Systemic action within 24 hours.",
        "price_per_unit": 1200,
        "margin": "25%",
    },
    "SY_KAV_75WP": {
        "name": "Kavach 75 WP",
        "sku": "SY_KAV_75WP",
        "category": "Fungicide",
        "crops": ["potato", "tomato", "onion"],
        "diseases": ["Late blight", "Early blight", "Downy mildew"],
        "dose": "400g per acre in 200L water",
        "timing": "Preventive spray before disease onset. Repeat every 7-10 days.",
        "price_per_unit": 560,
        "margin": "16%",
    },
    "SY_VER_18EC": {
        "name": "Vertimec 1.8 EC",
        "sku": "SY_VER_18EC",
        "category": "Insecticide/Acaricide",
        "crops": ["wheat", "cotton", "vegetables"],
        "pests": ["Spider mites", "Leaf miners", "Thrips"],
        "dose": "200ml per acre",
        "timing": "Apply when pest population exceeds threshold.",
        "price_per_unit": 1450,
        "margin": "28%",
    },
}

WEATHER_MOCK = {
    "current": {
        "temp_c": 24,
        "humidity_pct": 82,
        "rainfall_7d_mm": 48,
        "condition": "Partly cloudy with high humidity",
        "wind_kmh": 12,
    },
    "forecast": [
        {"day": "Tomorrow", "rain_prob": 65, "temp_c": 23},
        {"day": "Day+2", "rain_prob": 40, "temp_c": 25},
        {"day": "Day+3", "rain_prob": 20, "temp_c": 27},
    ],
    "risk_flags": [
        "High humidity (82%) — elevated fungal disease risk for wheat",
        "48mm rainfall in past 7 days — blight-favorable conditions",
    ],
}


def build_rep_context(rep_id: str) -> str:
    """Build comprehensive context string for Claude about a rep's territory."""
    rep = loader.get_rep(rep_id)
    retailers = loader.get_retailers_for_rep(rep_id, limit=10)
    growers = loader.get_growers_for_rep(rep_id, limit=8)
    visits = loader.get_visit_history_for_rep(rep_id, limit=10)
    stockout_alerts = loader.get_stockout_alerts()[:5]

    # Summarize growers
    grower_summary = []
    for g in growers[:6]:
        cal = g.get("grower_crop_calendar", {})
        crop = cal.get("crop", "unknown")
        stages = cal.get("stages", [])
        current_stage = stages[-1]["stage"] if stages else "unknown"
        grower_summary.append({
            "id": g["grower_id"],
            "district": g.get("district", ""),
            "tehsil": g.get("tehsil", ""),
            "crop": crop,
            "current_stage": current_stage,
            "farm_size_acres": round(float(g.get("grower_farm_size", 0)), 1),
            "age": g.get("grower_age", ""),
            "scanned_product": g.get("product_name", None),
        })

    # Summarize retailer inventory (spot-check a few)
    retailer_inv_summary = []
    for r in retailers[:5]:
        inv = loader.get_inventory_for_retailer(r["retailer_id"])
        stockouts = [i for i in inv if i["sku_qty"] == 0]
        low_stock = [i for i in inv if 0 < i["sku_qty"] <= 5]
        retailer_inv_summary.append({
            "retailer_id": r["retailer_id"],
            "tehsil": r.get("tehsil", ""),
            "district": r.get("district", ""),
            "stockouts": [s["sku_name"] for s in stockouts[:3]],
            "low_stock": [s["sku_name"] for s in low_stock[:3]],
        })

    # Recent visit pattern
    products_pitched = {}
    for v in visits:
        p = v.get("product_recommended", "")
        if p:
            products_pitched[p] = products_pitched.get(p, 0) + 1

    lines = [
        f"=== TERRITORY CONTEXT FOR REP {rep_id} ===",
        f"Territory: {rep.get('territory_name', 'Unknown') if rep else 'Unknown'}",
        f"State: {rep.get('state', '') if rep else ''}, District: {rep.get('district', '') if rep else ''}",
        "",
        "=== WEATHER & RISK (Current) ===",
        json.dumps(WEATHER_MOCK, indent=2),
        "",
        "=== PRODUCT CATALOG (Syngenta Rabi 2025-26) ===",
        json.dumps(PRODUCTS_CATALOG, indent=2),
        "",
        "=== GROWERS IN TERRITORY (sample) ===",
        json.dumps(grower_summary, indent=2),
        "",
        "=== RETAILER INVENTORY STATUS ===",
        json.dumps(retailer_inv_summary, indent=2),
        "",
        "=== RECENT STOCKOUT ALERTS ===",
        json.dumps(stockout_alerts, indent=2),
        "",
        "=== PRODUCTS PITCHED THIS MONTH ===",
        json.dumps(products_pitched, indent=2),
    ]
    return "\n".join(lines)


SYSTEM_PROMPT_CHAT = """You are AgroPilot, an AI field intelligence assistant for Syngenta India field sales representatives.

Your role:
- Give precise, actionable product recommendations based on crop stage, weather, and disease risk
- Answer questions about inventory status, dosage, application timing
- Help plan field visits and pitch strategies
- Always reference specific data from the territory context provided

Response style:
- Concise, field-rep friendly (they're on their phone in the field)
- Lead with the recommendation, follow with reasoning
- Mention specific product names, doses, and retailer proximity when relevant
- Include confidence level when making recommendations
- Never make up data not in the context

You have access to real territory data including grower profiles, retailer inventory, recent visit history, and current weather signals. Use this data.
"""

SYSTEM_PROMPT_BRIEFING = """You are AgroPilot generating a morning field briefing for a Syngenta India field rep.

Create a structured daily briefing with:
1. Today's priority visits (2-3 retailers/farmers to visit, with reason)
2. Key risk alert (weather + crop stage signal → product opportunity)
3. Top pitch of the day (specific product, specific farmer/crop, with dosage)
4. Quick inventory heads-up (any stockout or low stock to address)
5. One motivational insight (territory performance or opportunity)

Format as clean JSON with keys: priority_visits, risk_alert, top_pitch, inventory_alert, insight.
Base everything on the territory context provided. Be specific with retailer IDs, grower IDs, product names.
"""

SYSTEM_PROMPT_SCAN = """You are AgroPilot's crop disease diagnosis AI for Syngenta India.

Analyze the crop information or image provided and:
1. Identify the most likely disease or pest infestation (be specific)
2. Assess severity: mild / moderate / severe
3. Provide a confidence score from 0 to 100
4. Write the explanation in plain, farmer-friendly language — no technical jargon.
   The field rep will read this aloud to the farmer. Example: 'Early-stage powdery mildew detected on wheat leaves. This typically spreads rapidly during heading stage if untreated.'
5. Recommend the most appropriate Syngenta product(s) from this catalog:
   - Tilt 250 EC (SY_TILT_250EC, fungicide: blight, rust, mildew on wheat, ₹850/unit)
   - Score 250 EC (SY_SCO_250EC, fungicide: rust, alternaria on wheat/mustard, ₹920/unit)
   - Topik 15 WP (SY_TOP_15WP, herbicide: wild oat/canary grass in wheat, ₹680/unit)
   - Actara 25 WG (SY_ACT_25WG, insecticide: aphids, whitefly, thrips, ₹1200/unit)
   - Kavach 75 WP (SY_KAV_75WP, fungicide: late/early blight on potato, ₹560/unit)
   - Vertimec 1.8 EC (SY_VER_18EC, insecticide/acaricide: mites, leaf miners, ₹1450/unit)
6. Urgency level: treat_immediately / treat_within_48h / monitor / no_action

Respond ONLY as valid JSON with this exact structure:
{
  "disease": "Disease Name",
  "crop": "wheat",
  "severity": "moderate",
  "confidence": 87,
  "explanation": "Plain language explanation for the farmer...",
  "products": [
    {
      "name": "Tilt 250 EC",
      "sku": "SY_TILT_250EC",
      "dose": "200ml per acre in 200L water",
      "timing": "Apply immediately. Repeat after 14 days."
    }
  ],
  "urgency": "treat_within_48h"
}
"""
