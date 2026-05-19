from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any

router = APIRouter(prefix='/api/sync', tags=['sync'])


class SyncPushRequest(BaseModel):
    items: list[Any] = []


@router.post('/push')
def sync_push(body: SyncPushRequest):
    """Accept offline-queued items from the field app and acknowledge receipt."""
    return {
        'success': True,
        'synced': len(body.items),
        'message': f'Synced {len(body.items)} item{"s" if len(body.items) != 1 else ""}',
    }
