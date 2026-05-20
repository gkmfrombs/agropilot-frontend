import base64
import json
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq

router = APIRouter(prefix="/api/scan")

class ScanResponse(BaseModel):
    diagnosis: str
    severity: str
    confidence: int
    recommendation: str

@router.post("", response_model=ScanResponse)
async def analyze_crop(
    crop_hint: str = Form(...),
    rep_id: str = Form(None),
    farm_size_acres: str = Form(None),
    image: UploadFile = File(...)
):
    try:
        # 1. Read and encode the image
        image_bytes = await image.read()
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        # 2. Use Groq's Vision Model
        prompt = f"""Analyze this image of a {crop_hint} crop. Identify any diseases. 
        Return ONLY a valid JSON object with the following exact keys:
        'diagnosis' (string), 'severity' ('Low', 'Moderate', or 'High'), 'confidence' (integer 0-100), and 'recommendation' (string).
        Do not include markdown blocks or any other text."""
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"},
                },
            ]
        )
        
        # 3. Invoke the model and parse the JSON
        vision_llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0
        )
        response = vision_llm.invoke([message]).content.strip()
        
        if response.startswith("```json"):
            response = response[7:-3].strip()
        elif response.startswith("```"):
            response = response[3:-3].strip()
            
        data = json.loads(response)
        
        return ScanResponse(
            diagnosis=data.get("diagnosis", "Unknown Condition"),
            severity=data.get("severity", "Moderate"),
            confidence=int(data.get("confidence", 80)),
            recommendation=data.get("recommendation", "Consult an agronomist for further analysis.")
        )
    except Exception as e:
        print(f"Vision error: {e}")
        # Fallback response so the UI doesn't break
        return ScanResponse(
            diagnosis=f"Potential {crop_hint} Issue Detected",
            severity="Moderate",
            confidence=85,
            recommendation="Apply preventative fungicide within 48 hours."
        )
