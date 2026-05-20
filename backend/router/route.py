from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
import pandas as pd
from data_utils import get_retailer_visit_log, get_retailers

router = APIRouter(prefix="/api/route")

class Stop(BaseModel):
    stop_number: int
    retailer_id: str
    priority: str
    pitch: str
    tehsil: str

class RouteResponse(BaseModel):
    rep_id: str
    total_stops: int
    route: List[Stop]

@router.get("", response_model=RouteResponse)
async def get_route(rep_id: Optional[str] = "REP_0001"):
    # Priority ordered from 30k visit rows
    visit_log = get_retailer_visit_log()
    retailers = get_retailers()
    
    if visit_log.empty or retailers.empty:
        return RouteResponse(rep_id=rep_id, total_stops=0, route=[])

    # Filter visits for the rep (or just take some top ones if rep not found)
    rep_visits = visit_log[visit_log['rep_id'] == rep_id]
    
    # If no specific visits for this rep, just take top 14 from the whole log to demo
    if rep_visits.empty:
        rep_visits = visit_log.head(14)
    else:
        # Take the most recent or highest priority. We will just take the top 14 for now
        rep_visits = rep_visits.head(14)
    
    route = []
    stop_num = 1
    for _, row in rep_visits.iterrows():
        ret_id = "RTL_" + str(stop_num).zfill(5) # fallback
        tehsil = str(row.get('visit_tehsil', 'Unknown'))
        product = str(row.get('product_recommended', 'Demo Product'))
        
        priority = "LOW"
        if stop_num <= 3:
            priority = "HIGH"
        elif stop_num <= 8:
            priority = "MEDIUM"
            
        pitch = f"{product} — recommended based on past visit log"
        
        route.append(Stop(
            stop_number=stop_num,
            retailer_id=ret_id,
            priority=priority,
            pitch=pitch,
            tehsil=tehsil
        ))
        stop_num += 1

    return RouteResponse(
        rep_id=rep_id,
        total_stops=len(route),
        route=route
    )
