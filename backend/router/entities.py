from fastapi import APIRouter
from data_utils import get_growers, get_retailers

router = APIRouter(prefix="/api")

@router.get("/farmers")
async def get_all_farmers():
    growers = get_growers()
    if growers.empty:
        return []
    
    res = []
    for idx, row in growers.head(20).iterrows():
        res.append({
            "id": row.get("grower_id", f"GRW_{idx}"),
            "name": f"Farmer {idx}",
            "state": row.get("state"),
            "district": row.get("district"),
            "farm_size": row.get("grower_farm_size", 2.5),
            "crop": row.get("product_scan", "Wheat")
        })
    return res

@router.get("/farmers/{id}")
async def get_farmer_by_id(id: str):
    growers = get_growers()
    if growers.empty:
        return {"id": id, "name": "Farmer", "state": "Unknown"}
        
    farmer = growers[growers['grower_id'] == id]
    if not farmer.empty:
        row = farmer.iloc[0]
        return {
            "id": row.get("grower_id"),
            "name": f"Farmer {id.split('_')[-1] if '_' in id else id}",
            "state": row.get("state"),
            "district": row.get("district"),
            "farm_size": row.get("grower_farm_size", 2.5),
            "crop": row.get("product_scan", "Wheat"),
            "age": row.get("grower_age", 45),
            "language": row.get("language", "Hindi")
        }
    return {"id": id, "name": "Farmer", "state": "Unknown"}

@router.get("/retailers")
async def get_all_retailers():
    ret = get_retailers()
    if ret.empty:
        return []
        
    res = []
    for idx, row in ret.head(20).iterrows():
        res.append({
            "id": row.get("retailer_id", f"RTL_{idx}"),
            "name": f"Retailer {idx}",
            "state": row.get("state"),
            "district": row.get("district"),
            "tehsil": row.get("tehsil")
        })
    return res

@router.get("/retailers/{id}")
async def get_retailer_by_id(id: str):
    ret = get_retailers()
    if ret.empty:
        return {"id": id, "name": "Retailer", "state": "Unknown"}
        
    retailer = ret[ret['retailer_id'] == id]
    if not retailer.empty:
        row = retailer.iloc[0]
        return {
            "id": row.get("retailer_id"),
            "name": f"Retailer {id.split('_')[-1] if '_' in id else id}",
            "state": row.get("state"),
            "district": row.get("district"),
            "tehsil": row.get("tehsil")
        }
    return {"id": id, "name": "Retailer", "state": "Unknown"}
