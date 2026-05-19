from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/visits", tags=["visits"])

_store: List[dict] = []


class VisitRequest(BaseModel):
    rep_id: str = "REP_0001"
    entity_type: str = "retailer"
    entity_id: str = ""
    entity_name: str = ""
    outcome: str = ""
    products_discussed: List[str] = []
    note_text: str = ""
    competitor_observed: bool = False
    competitor_brand: str = ""
    offline_id: Optional[str] = None


@router.post("")
def log_visit(req: VisitRequest):
    visit = req.model_dump()
    visit["id"] = str(uuid.uuid4())
    visit["visit_date"] = datetime.utcnow().isoformat()
    visit["synced"] = True
    _store.append(visit)
    return {"success": True, "visit_id": visit["id"], "message": "Visit logged"}


@router.get("")
def list_visits(rep_id: str = "REP_0001"):
    return {"visits": [v for v in _store if v["rep_id"] == rep_id]}
