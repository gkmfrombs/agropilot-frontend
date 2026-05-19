import base64
import json
import logging
from fastapi import APIRouter, UploadFile, File, Form
from services.claude import vision_chat, chat
from services.context import SYSTEM_PROMPT_SCAN

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/scan", tags=["scan"])

# ── Yield & cost data (shared with calculator) ────────────────────────
CROP_YIELD = {
    "wheat": {"yield_qtl_acre": 18, "price_per_qtl": 2275},
    "mustard": {"yield_qtl_acre": 8, "price_per_qtl": 5650},
    "chickpea": {"yield_qtl_acre": 6, "price_per_qtl": 5440},
    "potato": {"yield_qtl_acre": 120, "price_per_qtl": 800},
    "rice": {"yield_qtl_acre": 22, "price_per_qtl": 2183},
}

DISEASE_LOSS = {"mild": 0.10, "moderate": 0.25, "severe": 0.45}

PRODUCT_COST = {
    "SY_TILT_250EC": 850,
    "SY_SCO_250EC": 920,
    "SY_TOP_15WP": 680,
    "SY_ACT_25WG": 1200,
    "SY_KAV_75WP": 560,
    "SY_VER_18EC": 1450,
}


def _build_yield_comparison(crop: str, severity: str, product_sku: str, farm_size: float = 1.0):
    """Build side-by-side yield loss comparison for 1 acre (default)."""
    crop_data = CROP_YIELD.get(crop.lower(), CROP_YIELD["wheat"])
    loss_rate = DISEASE_LOSS.get(severity.lower(), 0.25)
    cost_per_acre = PRODUCT_COST.get(product_sku, 850)

    yield_qtl = crop_data["yield_qtl_acre"] * farm_size
    price = crop_data["price_per_qtl"]

    loss_qtl = yield_qtl * loss_rate
    loss_kg = round(loss_qtl * 100, 1)  # 1 qtl = 100 kg
    loss_inr = round(loss_qtl * price)

    saved_qtl = loss_qtl * 0.85  # 85% efficacy
    saved_kg = round(saved_qtl * 100, 1)
    saved_inr = round(saved_qtl * price)
    treatment_cost = round(cost_per_acre * farm_size)
    net_benefit = saved_inr - treatment_cost

    return {
        "without_treatment": {
            "loss_kg_total": loss_kg,
            "loss_inr_total": loss_inr,
        },
        "with_treatment": {
            "saved_kg_total": saved_kg,
            "saved_inr_total": saved_inr,
            "treatment_cost_inr": treatment_cost,
            "net_benefit_inr": net_benefit,
        },
    }


def _build_whatsapp_message(result: dict, yield_comp: dict) -> str:
    """Build a WhatsApp-ready advisory message from scan result."""
    disease = result.get("disease", "Unknown")
    crop = result.get("crop", "crop")
    severity = result.get("severity", "unknown")
    explanation = result.get("explanation", "")
    urgency = result.get("urgency", "monitor")
    products = result.get("products", [])

    lines = [
        "🌾 *AgroPilot Crop Advisory*",
        "",
        f"*Diagnosis:* {disease}",
        f"*Crop:* {crop.title()}",
        f"*Severity:* {severity.title()}",
        "",
        f"📋 {explanation}",
        "",
    ]

    if products:
        p = products[0]
        lines.append(f"💊 *Recommended:* {p.get('name', '')}")
        lines.append(f"📏 *Dosage:* {p.get('dose', '')}")
        lines.append(f"⏰ *Timing:* {p.get('timing', '')}")
        lines.append("")

    wt = yield_comp.get("without_treatment", {})
    wth = yield_comp.get("with_treatment", {})
    lines.append(f"📉 *Without treatment:* ₹{wt.get('loss_inr_total', 0):,} total loss")
    lines.append(f"📈 *With treatment:* ₹{wth.get('net_benefit_inr', 0):,} net benefit")
    lines.append("")

    urgency_map = {
        "treat_immediately": "🔴 Treat immediately",
        "treat_within_48h": "🟠 Treat within 48 hours",
        "monitor": "🟡 Monitor closely",
        "no_action": "🟢 No action needed",
    }
    lines.append(f"⚡ *Urgency:* {urgency_map.get(urgency, urgency)}")
    lines.append("")
    lines.append("— Sent via AgroPilot by Syngenta")

    return "\n".join(lines)


def _build_chatbot_context(result: dict) -> str:
    """Build context string to pre-load into chatbot after scan."""
    disease = result.get("disease", "Unknown condition")
    crop = result.get("crop", "crop")
    severity = result.get("severity", "unknown")
    products = result.get("products", [])
    explanation = result.get("explanation", "")

    product_text = ""
    if products:
        p = products[0]
        product_text = f" I recommend {p.get('name', '')} at {p.get('dose', '')}. {p.get('timing', '')}"

    return (
        f"I just scanned a {crop} crop and detected {disease} "
        f"(severity: {severity}). {explanation}{product_text} "
        f"What else should I know about treating this?"
    )


def _parse_ai_response(raw: str) -> dict:
    """Extract JSON from AI response, handling markdown code blocks."""
    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        return json.loads(raw[start:end])
    except Exception:
        return {
            "disease": "Analysis complete",
            "crop": "unknown",
            "severity": "unknown",
            "confidence": 50,
            "explanation": raw[:500] if raw else "Could not parse diagnosis.",
            "products": [],
            "urgency": "monitor",
        }


def _enrich_response(result: dict, rep_id: str, farm_size: float = 1.0) -> dict:
    """Add yield comparison, WhatsApp message, and chatbot context."""
    crop = result.get("crop", "wheat")
    severity = result.get("severity", "moderate")
    products = result.get("products", [])
    product_sku = products[0].get("sku", "SY_TILT_250EC") if products else "SY_TILT_250EC"

    yield_comp = _build_yield_comparison(crop, severity, product_sku, farm_size)
    whatsapp = _build_whatsapp_message(result, yield_comp)
    chatbot_ctx = _build_chatbot_context(result)

    return {
        "scan_result": result,
        "yield_comparison": yield_comp,
        "whatsapp_message": whatsapp,
        "chatbot_context": chatbot_ctx,
        "rep_id": rep_id,
    }


# ── Mock fallback data (used when LLM is unavailable) ─────────────────
MOCK_DIAGNOSES = {
    "wheat": {
        "disease": "Septoria Leaf Blotch",
        "crop": "wheat",
        "severity": "moderate",
        "confidence": 89,
        "explanation": "Early-stage Septoria leaf blotch detected on wheat leaves. The brown lesions with yellow halos are characteristic of this fungal disease. High humidity and recent rainfall have created favorable conditions for rapid spread. If untreated, this can reduce yield by 20-30% within two weeks.",
        "products": [{"name": "Tilt 250 EC", "sku": "SY_TILT_250EC", "dose": "200ml per acre in 200L water", "timing": "Apply immediately. Repeat after 14 days if symptoms persist."}],
        "urgency": "treat_within_48h",
    },
    "mustard": {
        "disease": "Alternaria Blight",
        "crop": "mustard",
        "severity": "moderate",
        "confidence": 85,
        "explanation": "Alternaria blight detected on mustard leaves. Dark brown circular spots with concentric rings are visible. The disease spreads rapidly during flowering stage, especially in humid conditions. Early treatment prevents pod infection.",
        "products": [{"name": "Score 250 EC", "sku": "SY_SCO_250EC", "dose": "250ml per acre in 200L water", "timing": "Apply at disease onset. Repeat after 10-14 days."}],
        "urgency": "treat_within_48h",
    },
    "chickpea": {
        "disease": "Ascochyta Blight",
        "crop": "chickpea",
        "severity": "mild",
        "confidence": 82,
        "explanation": "Early signs of Ascochyta blight detected on chickpea. Small brown lesions visible on leaves. The disease is in early stages and can be controlled with timely fungicide application. Monitor closely for spread.",
        "products": [{"name": "Score 250 EC", "sku": "SY_SCO_250EC", "dose": "250ml per acre", "timing": "Apply preventively. Repeat after 10 days if rain continues."}],
        "urgency": "monitor",
    },
    "potato": {
        "disease": "Late Blight",
        "crop": "potato",
        "severity": "severe",
        "confidence": 92,
        "explanation": "Late blight detected on potato leaves. Water-soaked lesions with white fungal growth on the undersides are visible. This is a fast-spreading disease that can destroy the entire crop within days if untreated. Immediate action is required.",
        "products": [{"name": "Kavach 75 WP", "sku": "SY_KAV_75WP", "dose": "400g per acre in 200L water", "timing": "Apply immediately. Repeat every 7 days during wet conditions."}],
        "urgency": "treat_immediately",
    },
}


@router.post("")
async def scan_crop(
    image: UploadFile = File(...),
    crop_hint: str = Form(default=""),
    rep_id: str = Form(default="REP_0001"),
    farm_size_acres: float = Form(default=1.0),
):
    """Real image scan — sends photo to vision model for diagnosis."""
    raw = await image.read()
    b64 = base64.b64encode(raw).decode()

    media_type = image.content_type or "image/jpeg"
    prompt = (
        f"Analyze this crop image. "
        f"Crop type: {crop_hint if crop_hint else 'unknown'}. "
        f"Provide diagnosis as JSON."
    )

    try:
        raw_response = vision_chat(SYSTEM_PROMPT_SCAN, b64, prompt, media_type=media_type)
        result = _parse_ai_response(raw_response)
    except Exception as e:
        logger.error("Vision scan failed: %s", e, exc_info=True)
        crop_key = (crop_hint or "wheat").lower()
        result = MOCK_DIAGNOSES.get(crop_key, MOCK_DIAGNOSES["wheat"]).copy()

    # Ensure crop field is set
    if result.get("crop", "unknown") == "unknown" and crop_hint:
        result["crop"] = crop_hint.lower()

    return _enrich_response(result, rep_id, farm_size_acres)


@router.post("/demo")
def scan_demo(body: dict):
    """Demo endpoint — text-based diagnosis without real image."""
    symptom = body.get("symptom", "yellow patches on leaves")
    crop = body.get("crop", "wheat")
    farm_size = float(body.get("farm_size_acres", 1.0))
    rep_id = body.get("rep_id", "REP_0001")

    try:
        prompt = (
            f"A farmer reports seeing '{symptom}' on their {crop} crop. "
            f"The crop is currently at flowering/heading stage. "
            f"Provide diagnosis as JSON."
        )
        raw = chat(SYSTEM_PROMPT_SCAN, [{"role": "user", "content": prompt}])
        result = _parse_ai_response(raw)
    except Exception as e:
        logger.error("Demo scan failed: %s", e, exc_info=True)
        crop_key = crop.lower()
        result = MOCK_DIAGNOSES.get(crop_key, MOCK_DIAGNOSES["wheat"]).copy()

    # Ensure crop field is set
    if result.get("crop", "unknown") == "unknown":
        result["crop"] = crop.lower()

    return _enrich_response(result, rep_id, farm_size)


@router.post("/advisory")
def generate_advisory(body: dict):
    """Generate a WhatsApp-ready advisory from existing scan result."""
    scan_result = body.get("scan_result", {})
    crop = scan_result.get("crop", "wheat")
    severity = scan_result.get("severity", "moderate")
    products = scan_result.get("products", [])
    product_sku = products[0].get("sku", "SY_TILT_250EC") if products else "SY_TILT_250EC"
    farm_size = float(body.get("farm_size_acres", 1.0))

    yield_comp = _build_yield_comparison(crop, severity, product_sku, farm_size)
    message = _build_whatsapp_message(scan_result, yield_comp)

    return {"whatsapp_message": message, "yield_comparison": yield_comp}
