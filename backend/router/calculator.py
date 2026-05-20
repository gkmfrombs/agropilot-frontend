from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/calculator")

class ROIRequest(BaseModel):
    crop: str
    farm_size_acres: float
    disease_severity: str
    product_sku: str
    num_applications: int

class ROIResponse(BaseModel):
    yield_increase_pct: float
    added_revenue: float
    cost_of_application: float
    net_roi: float
    roi_percentage: float

# Dummy real-world product prices (per acre per application)
PRODUCT_PRICES = {
    "Tilt 250 EC": 450,
    "Amistar Top": 850,
    "Score 250EC": 600,
    "Nativo 75WG": 950
}

# MSP (Minimum Support Price) per quintal (100 kg) in INR roughly
MSP_PRICES = {
    "Wheat": 2275,
    "Paddy": 2183,
    "Cotton": 6620,
    "Soybean": 4600
}

# Average yield per acre in quintals
AVG_YIELD = {
    "Wheat": 15,
    "Paddy": 20,
    "Cotton": 8,
    "Soybean": 10
}

@router.post("/roi", response_model=ROIResponse)
async def calculate_roi(req: ROIRequest):
    # MSP-anchored real product prices
    crop = req.crop.title()
    msp = MSP_PRICES.get(crop, 2000)
    base_yield = AVG_YIELD.get(crop, 15) * req.farm_size_acres
    
    # Cost
    cost_per_app = PRODUCT_PRICES.get(req.product_sku, 500)
    total_cost = cost_per_app * req.num_applications * req.farm_size_acres
    
    # Impact of disease severity
    severity_impact = {"Low": 0.05, "Medium": 0.10, "High": 0.15}
    yield_increase = severity_impact.get(req.disease_severity.title(), 0.10)
    
    added_yield = base_yield * yield_increase
    added_revenue = added_yield * msp
    
    net_roi = added_revenue - total_cost
    roi_percentage = (net_roi / total_cost * 100) if total_cost > 0 else 0
    
    return ROIResponse(
        yield_increase_pct=yield_increase * 100,
        added_revenue=round(added_revenue, 2),
        cost_of_application=round(total_cost, 2),
        net_roi=round(net_roi, 2),
        roi_percentage=round(roi_percentage, 2)
    )
