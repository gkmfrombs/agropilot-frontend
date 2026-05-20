from fastapi import APIRouter
from data_utils import get_retailer_pos, get_whatsapp_campaign, get_reps_territory, get_retailer_visit_log

router = APIRouter(prefix="/api/manager")

@router.get("/kpi")
async def get_manager_kpi():
    pos = get_retailer_pos()
    
    if pos.empty:
        return {"sales": 0, "growth": 0, "active_retailers": 0}

    # Dummy calculation for total sales
    total_sales = pos['amount'].sum() if 'amount' in pos.columns else 2500000
    active_reps = pos['rep_id'].nunique() if 'rep_id' in pos.columns else 45
    
    return {
        "total_revenue": float(total_sales),
        "revenue_growth": 12.5,
        "active_reps": active_reps,
        "active_retailers": 120,
        "top_product": "Tilt 250 EC",
        "alerts_count": 3
    }

@router.get("/reps")
async def get_manager_reps():
    reps_data = get_reps_territory()
    visits = get_retailer_visit_log()
    
    if reps_data.empty:
        return []

    reps_list = []
    for _, row in reps_data.head(10).iterrows():
        rep_id = row.get("rep_id")
        rep_visits = visits[visits['rep_id'] == rep_id] if not visits.empty else []
        visit_count = len(rep_visits)
        
        reps_list.append({
            "id": rep_id,
            "name": f"Rep {rep_id}",
            "territory": row.get("territory_name"),
            "visits_today": visit_count if visit_count > 0 else 5,
            "status": "Active"
        })
    return reps_list

@router.get("/territory")
async def get_manager_territory():
    return {
        "name": "North District",
        "risk_level": "High",
        "weather_warning": "Heavy rain expected",
        "affected_crops": ["Wheat", "Mustard"]
    }

@router.get("/campaigns")
async def get_manager_campaigns():
    campaigns = get_whatsapp_campaign()
    
    if campaigns.empty:
        return []
    
    camp_list = []
    # group by campaign id or just take top ones
    for idx, row in campaigns.head(5).iterrows():
        camp_list.append({
            "id": f"CAMP_{idx}",
            "name": str(row.get("message_template", "Campaign")).split()[0] + " Campaign",
            "sent": 5000,
            "read": 3500,
            "clicked": 1200,
            "conversion": 5.4
        })
    return camp_list
