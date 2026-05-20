from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Tuple

router = APIRouter(prefix="/api/graph")

class Recommendation(BaseModel):
    product: str
    product_sku: str
    confidence: int

class NodeData(BaseModel):
    id: str
    label: str
    type: str
    angle: int
    weight: int
    icon_type: str
    facts: List[Tuple[str, str]]
    source: str

class StepData(BaseModel):
    n: int
    text: str
    src: str

class GraphResponse(BaseModel):
    rep_id: str
    recommendation: Recommendation
    nodes: List[NodeData]
    steps: List[StepData]

MOCK_GRAPH_DATA = {
    "recommendation": {
        "product": "Tilt 250 EC",
        "product_sku": "SKU-TILT-250",
        "confidence": 94
    },
    "nodes": [
        {
            "id": "node1",
            "label": "Arjun",
            "type": "RETAILER",
            "angle": -90,
            "weight": 15,
            "icon_type": "user",
            "facts": [["Location", "Patna"], ["Stock", "14 Units"]],
            "source": "Inventory DB"
        },
        {
            "id": "node2",
            "label": "HD-2967",
            "type": "CROP",
            "angle": 30,
            "weight": 35,
            "icon_type": "wheat",
            "facts": [["Stage", "Flowering (BBCH 65)"], ["Vulnerability", "High"]],
            "source": "Agronomy DB"
        },
        {
            "id": "node3",
            "label": "48mm Rain",
            "type": "WEATHER",
            "angle": 150,
            "weight": 50,
            "icon_type": "cloud-rain",
            "facts": [["Humidity", "89%"], ["Duration", "31h"]],
            "source": "IMD Weather"
        }
    ],
    "steps": [
        {
            "n": 1,
            "text": "Detected 48mm rainfall and 89% humidity over the past 31 hours.",
            "src": "IMD Weather API"
        },
        {
            "n": 2,
            "text": "Matched weather pattern with Septoria infection conditions during wheat flowering stage.",
            "src": "Disease DB"
        },
        {
            "n": 3,
            "text": "Confirmed 14 units of Tilt 250 EC available at nearest retailer (11 min drive).",
            "src": "Inventory System"
        }
    ]
}

import json
import requests
from data_utils import get_reps_territory

@router.get("/{rep_id}", response_model=GraphResponse)
async def get_graph(rep_id: str):
    """Returns the reasoning graph representation for the AI recommendations."""
    from config import llm
    
    # Fetch real weather from Open-Meteo (example coordinates for India)
    weather_info = "Weather data unavailable"
    try:
        weather_res = requests.get("https://api.open-meteo.com/v1/forecast?latitude=20.59&longitude=78.96&current_weather=true")
        if weather_res.status_code == 200:
            w_data = weather_res.json().get("current_weather", {})
            temp = w_data.get("temperature")
            wind = w_data.get("windspeed")
            weather_info = f"Temp: {temp}C, Wind: {wind}km/h"
    except Exception as e:
        pass

    # Fetch territory data
    territory = get_reps_territory()
    territory_info = ""
    if not territory.empty:
        rep_data = territory[territory['rep_id'] == rep_id]
        if not rep_data.empty:
            row = rep_data.iloc[0]
            territory_info = f"District: {row.get('district')}, State: {row.get('state')}"

    if not llm:
        return GraphResponse(
            rep_id=rep_id,
            recommendation=MOCK_GRAPH_DATA["recommendation"],
            nodes=MOCK_GRAPH_DATA["nodes"],
            steps=MOCK_GRAPH_DATA["steps"]
        )
        
    prompt = f"""
You are the AgroPilot reasoning engine. The user (rep_id: {rep_id}) is viewing their territory's AI recommendation graph.
Real-world context:
- Weather: {weather_info}
- Territory: {territory_info}

Based on this context, generate a valid JSON object matching exactly this schema representing a realistic agricultural scenario (e.g. disease detected, product recommended).
You MUST generate EXACTLY 7 nodes in the "nodes" array to represent a comprehensive reasoning graph.
{{
    "recommendation": {{"product": "String", "product_sku": "String", "confidence": Int (0-100)}},
    "nodes": [
        {{"id": "String", "label": "String", "type": "String", "angle": Int, "weight": Int, "icon_type": "user" or "wheat" or "cloud-rain" or "box", "facts": [["Key", "Value"]], "source": "String"}}
    ],
    "steps": [
        {{"n": Int, "text": "String", "src": "String"}}
    ]
}}
IMPORTANT: Return ONLY raw JSON. No markdown backticks, no explanations.
"""
    try:
        response = llm.invoke(prompt).content.strip()
        if response.startswith("```json"):
            response = response[7:-3].strip()
        elif response.startswith("```"):
            response = response[3:-3].strip()
            
        data = json.loads(response)
        return GraphResponse(
            rep_id=rep_id,
            recommendation=data.get("recommendation", MOCK_GRAPH_DATA["recommendation"]),
            nodes=data.get("nodes", MOCK_GRAPH_DATA["nodes"]),
            steps=data.get("steps", MOCK_GRAPH_DATA["steps"])
        )
    except Exception as e:
        print(f"Graph generation error: {e}")
        return GraphResponse(
            rep_id=rep_id,
            recommendation=MOCK_GRAPH_DATA["recommendation"],
            nodes=MOCK_GRAPH_DATA["nodes"],
            steps=MOCK_GRAPH_DATA["steps"]
        )
