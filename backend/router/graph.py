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

@router.get("/{rep_id}", response_model=GraphResponse)
async def get_graph(rep_id: str):
    """Returns the reasoning graph representation for the AI recommendations."""
    from config import llm
    if not llm:
        return GraphResponse(
            rep_id=rep_id,
            recommendation=MOCK_GRAPH_DATA["recommendation"],
            nodes=MOCK_GRAPH_DATA["nodes"],
            steps=MOCK_GRAPH_DATA["steps"]
        )
        
    prompt = f"""
You are the AgroPilot reasoning engine. The user (rep_id: {rep_id}) is viewing their territory's AI recommendation graph.
Generate a valid JSON object matching exactly this schema representing a realistic agricultural scenario (e.g. disease detected, product recommended):
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
