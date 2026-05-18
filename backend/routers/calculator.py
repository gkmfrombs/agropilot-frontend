from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/calculator", tags=["calculator"])

CROP_YIELD = {
    "wheat": {"yield_qtl_acre": 18, "price_per_qtl": 2275},
    "mustard": {"yield_qtl_acre": 8, "price_per_qtl": 5650},
    "chickpea": {"yield_qtl_acre": 6, "price_per_qtl": 5440},
    "potato": {"yield_qtl_acre": 120, "price_per_qtl": 800},
    "rice": {"yield_qtl_acre": 22, "price_per_qtl": 2183},
}

DISEASE_LOSS = {
    "mild": 0.10,
    "moderate": 0.25,
    "severe": 0.45,
}

PRODUCT_COST = {
    "SY_TILT_250EC": 850,
    "SY_SCO_250EC": 920,
    "SY_TOP_15WP": 680,
    "SY_ACT_25WG": 1200,
    "SY_KAV_75WP": 560,
    "SY_VER_18EC": 1450,
}


class ROIRequest(BaseModel):
    crop: str = "wheat"
    farm_size_acres: float = 2.0
    disease_severity: str = "moderate"  # mild | moderate | severe
    product_sku: str = "SY_TILT_250EC"
    num_applications: int = 1


@router.post("/roi")
def calculate_roi(req: ROIRequest):
    crop_data = CROP_YIELD.get(req.crop, CROP_YIELD["wheat"])
    loss_rate = DISEASE_LOSS.get(req.disease_severity, 0.25)
    product_cost_per_acre = PRODUCT_COST.get(req.product_sku, 850)

    total_yield_qtl = crop_data["yield_qtl_acre"] * req.farm_size_acres
    price_per_qtl = crop_data["price_per_qtl"]
    gross_value = total_yield_qtl * price_per_qtl

    yield_loss_qtl = total_yield_qtl * loss_rate
    yield_loss_value = yield_loss_qtl * price_per_qtl

    treatment_cost = product_cost_per_acre * req.farm_size_acres * req.num_applications
    protection_gain = yield_loss_value * 0.85  # 85% efficacy assumption
    net_roi = protection_gain - treatment_cost
    roi_ratio = round(protection_gain / treatment_cost, 1) if treatment_cost > 0 else 0

    return {
        "crop": req.crop,
        "farm_size_acres": req.farm_size_acres,
        "gross_value_inr": round(gross_value),
        "yield_loss_without_treatment_inr": round(yield_loss_value),
        "treatment_cost_inr": round(treatment_cost),
        "protection_gain_inr": round(protection_gain),
        "net_roi_inr": round(net_roi),
        "roi_ratio": roi_ratio,
        "recommendation": f"For every ₹1 spent on treatment, farmer saves ₹{roi_ratio}",
        "breakeven_acres": round(treatment_cost / (price_per_qtl * crop_data["yield_qtl_acre"] * loss_rate * 0.85), 2),
    }
