from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import pandas as pd

from data import loader

router = APIRouter(prefix='/api/visits', tags=['visits'])


class VisitLog(BaseModel):
  rep_id: str = 'REP_0001'
  retailer_id: str
  outcome: str  # "sale_made" | "order_placed" | "no_purchase" | "followup_required"
  products_discussed: list[str] = []
  competitor_products: list[str] = []
  notes: str = ''
  visit_date: str = ''  # ISO string — defaults to now if empty


_VALID_OUTCOMES = {'sale_made', 'order_placed', 'no_purchase', 'followup_required'}


@router.post('')
def log_visit(body: VisitLog):
  """
  Log a new field visit for a rep.

  Appends the record to the in-memory visits cache so it is immediately
  visible to all subsequent read calls (e.g. GET /api/visits/{rep_id})
  within the same server process lifetime.
  """
  if body.outcome not in _VALID_OUTCOMES:
    raise HTTPException(
      status_code=422,
      detail=f'outcome must be one of: {", ".join(sorted(_VALID_OUTCOMES))}',
    )

  # Resolve visit timestamp
  if body.visit_date:
    try:
      resolved_dt = datetime.fromisoformat(body.visit_date)
    except ValueError:
      raise HTTPException(
        status_code=422,
        detail='visit_date must be a valid ISO 8601 string (e.g. 2026-05-18T14:30:00)',
      )
  else:
    resolved_dt = datetime.now()

  visit_id = f'VIS_{int(datetime.now().timestamp())}'

  new_row = pd.DataFrame([{
    'visit_id': visit_id,
    'rep_id': body.rep_id,
    'retailer_id': body.retailer_id,
    'outcome': body.outcome,
    'products_discussed': body.products_discussed,
    'competitor_products': body.competitor_products,
    'notes': body.notes,
    'visit_date': resolved_dt,
  }])

  # Append to the in-memory cache — pd.concat avoids the deprecated DataFrame.append
  existing = loader._cache.get('visits', pd.DataFrame())
  loader._cache['visits'] = pd.concat([existing, new_row], ignore_index=True)

  return {
    'success': True,
    'visit_id': visit_id,
    'rep_id': body.rep_id,
    'retailer_id': body.retailer_id,
    'outcome': body.outcome,
    'visit_date': resolved_dt.isoformat(),
    'message': 'Visit logged successfully',
  }


@router.get('/{rep_id}')
def get_visits_for_rep(rep_id: str):
  """
  Return the last 20 visits for a given rep from the in-memory cache.
  Includes any visits logged during this session via POST /api/visits.
  """
  visits = loader.get_visit_history_for_rep(rep_id, limit=20)

  # Normalise datetime objects to ISO strings so JSON serialisation never fails
  for v in visits:
    if isinstance(v.get('visit_date'), pd.Timestamp):
      v['visit_date'] = v['visit_date'].isoformat()
    elif isinstance(v.get('visit_date'), datetime):
      v['visit_date'] = v['visit_date'].isoformat()

  return {
    'success': True,
    'rep_id': rep_id,
    'count': len(visits),
    'visits': visits,
  }
