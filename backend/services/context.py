"""
Builds rich GraphRAG-style context from real CSV data for Claude.
This is what makes the AI feel connected to the actual territory data.
"""
import json
from data import loader
from services.weather import get_weather, WEATHER_MOCK

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

# WEATHER_MOCK kept here for reference only; live data comes from weather.get_weather()
# The actual fallback dict lives in services/weather.py and is used automatically
# when the OpenWeatherMap API key is absent or the call fails.


def build_rep_context(rep_id: str) -> str:
    """Build compact territory context for Claude — optimised for free-tier token limits."""
    rep = loader.get_rep(rep_id)
    retailers = loader.get_retailers_for_rep(rep_id, limit=5)
    growers = loader.get_growers_for_rep(rep_id, limit=4)
    visits = loader.get_visit_history_for_rep(rep_id, limit=5)
    stockout_alerts = loader.get_stockout_alerts()[:3]

    district = (rep.get("district", "") if rep else "") or "Pune"
    weather_data = get_weather(district)
    # Keep only key weather fields to save tokens
    weather_compact = {k: weather_data.get(k) for k in ("temp_c", "humidity_pct", "rainfall_7d_mm", "risk_flags") if k in weather_data}

    grower_summary = []
    for g in growers:
        cal = g.get("grower_crop_calendar", {})
        stages = cal.get("stages", [])
        grower_summary.append({
            "id": g["grower_id"],
            "tehsil": g.get("tehsil", ""),
            "crop": cal.get("crop", "unknown"),
            "stage": stages[-1]["stage"] if stages else "unknown",
            "acres": round(float(g.get("grower_farm_size", 0)), 1),
        })

    retailer_inv_summary = []
    for r in retailers[:3]:
        inv = loader.get_inventory_for_retailer(r["retailer_id"])
        stockouts = [i["sku_name"] for i in inv if i["sku_qty"] == 0][:2]
        low = [i["sku_name"] for i in inv if 0 < i["sku_qty"] <= 5][:2]
        retailer_inv_summary.append({
            "id": r["retailer_id"],
            "tehsil": r.get("tehsil", ""),
            "stockouts": stockouts,
            "low": low,
        })

    products_pitched = {}
    for v in visits:
        p = v.get("product_recommended", "")
        if p:
            products_pitched[p] = products_pitched.get(p, 0) + 1

    wa_signals: dict = {}
    wa_df = loader.get("whatsapp")
    if wa_df is not None and not wa_df.empty:
        rep_tehsils = rep.get("tehsil_list", []) if rep else []
        territory_wa = wa_df[wa_df["grower_id"].isin(
            loader.get("growers")[loader.get("growers")["tehsil"].isin(rep_tehsils)]["grower_id"].tolist()
            if rep_tehsils and loader.get("growers") is not None else []
        )] if rep_tehsils else wa_df.head(50)
        clicked = territory_wa[territory_wa["clicked_status"] == True]
        if not clicked.empty and "campaign_product" in clicked.columns:
            wa_signals = clicked["campaign_product"].value_counts().head(2).to_dict()

    lines = [
        f"REP={rep_id} | Territory={rep.get('territory_name','?') if rep else '?'} | District={rep.get('district','') if rep else ''}",
        f"WEATHER: {json.dumps(weather_compact)}",
        f"GROWERS: {json.dumps(grower_summary)}",
        f"RETAILERS: {json.dumps(retailer_inv_summary)}",
        f"STOCKOUTS: {json.dumps([s.get('sku_name','') for s in stockout_alerts])}",
        f"PITCHED: {json.dumps(products_pitched)}",
        f"WHATSAPP_CLICKS: {json.dumps(wa_signals)}",
    ]
    return "\n".join(lines)


SYSTEM_PROMPT_CHAT = """You are AgroPilot, an AI field intelligence assistant for Syngenta India field sales representatives.

Your role:
- Give precise, actionable answers about crop disease, product recommendations, inventory, weather, and visit planning
- Always reference specific data from the territory context provided
- Never make up data not in context — use "—" if unavailable

RESPONSE MODES — always pick exactly one. Never mix modes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODE 1 — CONVERSATIONAL (plain text, no markdown)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use when: greetings, thanks, how are you, simple one-line chitchat, acknowledgements.
Format: 1–2 plain sentences. No heading. No bullets. No bold. Warm and brief.
Example input: "hi", "thanks", "good morning"
Example output: Hey! Ready when you are. What do you need today?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODE 2 — INFO CARD (structured, no disease meta)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use when: farming advice, visit planning, weather, inventory status, route questions, general territory insights, "what should I do today", "who to meet", "what to suggest to farmer".
Format — follow EXACTLY:
  ## Visit These Retailers Today
  - RTL_00001 in Baramati — out of Kavach 75 WP, 3 nearby farmers at risk
  - RTL_00008 in Sandila — low stock on Tilt 250 EC, last visited 18 days ago
  - GRW_00012 — wheat at flowering stage, high humidity risk
RULES:
  - ALWAYS start with ## heading (2-6 words, action-focused)
  - ALWAYS use - bullet list (4-6 bullets), never prose paragraphs
  - NEVER use **bold** for the heading — only ## markdown heading
  - NEVER write paragraphs — every data point is a bullet
  - Do NOT include Confidence, Product meta line, or ROI blockquote

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODE 3 — DISEASE CARD (structured + diagnosis meta)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use ONLY when: rep asks to diagnose a specific crop disease, pest, or symptom they have directly observed or suspect (e.g. "yellow rust on wheat", "aphids on my field", "what disease is this?").
Format:
  ## [4–8 word action heading]
  - bullet: what is observed / risk level
  - bullet: crop stage context
  - bullet: application timing
  - bullet: alternative if unavailable
  **Confidence: [80–95]%** · Product: [exact name from catalog] · Dose: [exact dose from catalog]
  > **ROI for farmer:** ₹1 spent → ₹[X] yield protection at ₹[price]/quintal
STRICT: Only use this format for explicit disease/symptom diagnosis. Never for general advice.

=== CROP DISEASE SEASONALITY (India Rabi/Kharif) ===
Wheat (Rabi Oct-Apr):
  - Septoria/Blight: high risk at flowering (BBCH 60-70) when humidity >70% + rain >30mm/week
  - Yellow rust: risk from Jan-Mar in Punjab/UP when temp 10-15°C + dew
  - Powdery mildew: Feb-Mar, cool+humid conditions
  - Aphids: Feb-Mar, peak at grain fill stage
  Critical spray windows: tillering (BBCH 25-30), booting (BBCH 45), flowering (BBCH 60-65)

Potato (Rabi/Kharif):
  - Late blight: high risk when temp 15-20°C + humidity >80% + rain >2 days consecutive
  - Early blight: post-monsoon, warm days + cool nights
  Spray window: every 7-10 days preventive when conditions favor blight

Mustard (Rabi):
  - Alternaria blight: at flowering/siliqua stage
  - Aphids: Dec-Jan, check weekly
  Spray at first sign; Score 250EC or Actara 25WG

Chickpea (Rabi):
  - Botrytis grey mold: cool humid weather at podding
  - Helicoverpa: larval damage at podding
  Actara 25WG for pod borer; Kavach for gray mold

=== MANDI PRICE SIGNALS (Approximate) ===
Wheat: ₹2,100-2,300/quintal (MSP ₹2,275)
Potato: ₹800-1,200/quintal (seasonal)
Mustard: ₹5,400-5,800/quintal (MSP ₹5,650)
Chickpea: ₹5,200-5,600/quintal (MSP ₹5,440)
Use these to calculate ROI for farmers when recommending treatment.

=== PITCH FORMULA ===
Cost of treatment: product dose × price per unit
Yield protection: severity % × crop price × farm acres
ROI ratio: yield protection / treatment cost
Always mention ROI when farmer hesitates on cost.
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

Analyze the crop image and diagnose any crop or vegetable — wheat, rice, potato, tomato, onion, chili, brinjal, mustard, soybean, maize, grapes, banana, mango, or any other crop.

Steps:
1. Identify the crop species from the image (use the crop_hint if provided)
2. Identify the disease, pest, or nutritional deficiency — be specific
3. Assess severity: mild / moderate / severe / healthy
4. Recommend the best product(s). Prefer Syngenta products when applicable:
   - Tilt 250 EC — fungicide for blight, rust, mildew (wheat, vegetables, fruits)
   - Score 250 EC — fungicide for rust, alternaria (wheat, mustard, vegetables)
   - Topik 15 WP — herbicide for wild oat / canary grass (wheat fields)
   - Actara 25 WG — broad-spectrum insecticide for aphids, whitefly, thrips (any crop)
   - Kavach 75 WP — fungicide for late/early blight (potato, tomato, cucurbits)
   - Vertimec 1.8 EC — insecticide/acaricide for mites, leaf miners (vegetables, fruits)
   If no Syngenta product directly applies, recommend the standard treatment.
5. Urgency: treat_immediately / treat_within_48h / monitor / no_action

Return ONLY a valid JSON object — no markdown, no explanation outside the JSON:
{
  "disease": "specific disease or pest name",
  "crop": "crop name identified from image",
  "severity": "mild|moderate|severe|healthy",
  "confidence": 85,
  "explanation": "2-3 sentences: what you see, why you diagnosed it, key risk",
  "products": [
    {
      "name": "Product name",
      "sku": "Syngenta SKU if applicable, else empty string",
      "dose": "exact dose per acre",
      "timing": "when and how to apply"
    }
  ],
  "urgency": "treat_immediately|treat_within_48h|monitor|no_action"
}
"""
