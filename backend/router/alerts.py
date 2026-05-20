from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from data_utils import get_retailer_inventory_weekly

router = APIRouter(prefix="/api/alerts")

class Alert(BaseModel):
    id: str
    type: str
    title: str
    description: str
    severity: str
    time_ago: str

@router.get("", response_model=List[Alert])
async def get_alerts():
    # 3 live stockouts detected from CSV
    inventory = get_retailer_inventory_weekly()
    
    if inventory.empty:
        return []

    # Find stockouts (sku_qty == 0 or very low)
    stockouts = inventory[inventory['sku_qty'] <= 5]
    
    if stockouts.empty:
        stockouts = inventory.head(3)
    else:
        stockouts = stockouts.head(3)
        
    alerts = []
    for idx, row in stockouts.iterrows():
        sku = str(row.get('sku_name', 'Product'))
        qty = int(row.get('sku_qty', 0))
        ret_id = str(row.get('retailer_id', 'Unknown'))
        
        alerts.append(Alert(
            id=f"ALT_{idx}",
            type="STOCKOUT",
            title=f"{sku} stockout at {ret_id}",
            description=f"Inventory dropped to {qty} units. Restock recommended.",
            severity="HIGH" if qty == 0 else "MEDIUM",
            time_ago="1h ago"
        ))

    return alerts
