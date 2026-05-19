from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Any
from datetime import datetime

router = APIRouter(prefix="/api/sync", tags=["sync"])


class SyncPushRequest(BaseModel):
    items: List[Any] = []
    rep_id: str = "REP_0001"


@router.post("/push")
def sync_push(req: SyncPushRequest):
    results = []
    for item in req.items:
        results.append({
            "offline_id": item.get("offline_id", "unknown") if isinstance(item, dict) else "unknown",
            "status": "success",
            "synced_at": datetime.utcnow().isoformat(),
        })
    return {
        "synced": len(results),
        "failed": 0,
        "results": results,
        "server_time": datetime.utcnow().isoformat(),
    }


@router.get("/status")
def sync_status(rep_id: str = "REP_0001"):
    return {
        "rep_id": rep_id,
        "pending": 0,
        "last_sync": datetime.utcnow().isoformat(),
        "status": "online",
    }
