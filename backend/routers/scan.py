import base64
import json
from fastapi import APIRouter, UploadFile, File, Form
from services.claude import vision_chat, chat
from services.context import SYSTEM_PROMPT_SCAN

router = APIRouter(prefix="/api/scan", tags=["scan"])


@router.post("")
async def scan_crop(
    image: UploadFile = File(...),
    crop_hint: str = Form(default=""),
    rep_id: str = Form(default="REP_0001"),
):
    raw = await image.read()
    b64 = base64.b64encode(raw).decode()

    media_type = image.content_type or "image/jpeg"
    prompt = f"Analyze this crop image. Crop type hint: {crop_hint if crop_hint else 'unknown'}. Provide diagnosis as JSON."

    raw_response = vision_chat(SYSTEM_PROMPT_SCAN, b64, prompt, media_type=media_type)

    try:
        start = raw_response.index("{")
        end = raw_response.rindex("}") + 1
        result = json.loads(raw_response[start:end])
    except Exception:
        result = {"raw": raw_response, "disease": "Analysis complete", "severity": "unknown"}

    return {"scan_result": result, "rep_id": rep_id}


@router.post("/demo")
def scan_demo(body: dict):
    """Demo endpoint without real image — simulates a scan result."""
    symptom = body.get("symptom", "yellow patches on leaves")
    crop = body.get("crop", "wheat")

    prompt = f"A farmer reports: '{symptom}' on {crop}. Provide diagnosis as JSON."
    raw = chat(SYSTEM_PROMPT_SCAN, [{"role": "user", "content": prompt}])

    try:
        start = raw.index("{")
        end = raw.rindex("}") + 1
        result = json.loads(raw[start:end])
    except Exception:
        result = {"raw": raw}

    return {"scan_result": result}
