"""
Loads CSV data into memory on startup.
Uses actual Syngenta hackathon dataset.
"""
import os
import json
import pandas as pd
from pathlib import Path
from config import get_settings

settings = get_settings()

_cache: dict = {}


def get_csv_path(filename: str) -> str:
    return os.path.join(settings.csv_dir, filename)


def load_all():
    """Call once at startup."""
    print("Loading CSV data...")

    # Reps
    reps = pd.read_csv(get_csv_path("reps_territory.csv"))
    reps["tehsil_list"] = reps["tehsil_list"].apply(lambda x: json.loads(x) if pd.notna(x) else [])
    _cache["reps"] = reps

    # Retailers (first 500 for speed)
    retailers = pd.read_csv(get_csv_path("retailers.csv"))
    _cache["retailers"] = retailers

    # Growers (first 1000 for speed)
    growers = pd.read_csv(get_csv_path("growers.csv"), nrows=1000)
    growers["grower_crop_calendar"] = growers["grower_crop_calendar"].apply(
        lambda x: json.loads(x) if pd.notna(x) else {}
    )
    _cache["growers"] = growers

    # Inventory — only latest week per retailer/sku
    inv = pd.read_csv(get_csv_path("retailer_inventory_weekly.csv"))
    inv["week_end_date"] = pd.to_datetime(inv["week_end_date"])
    latest_inv = inv.sort_values("week_end_date").groupby(["retailer_id", "sku_id"]).last().reset_index()
    _cache["inventory"] = latest_inv

    # Visit log (latest 5000)
    visits = pd.read_csv(get_csv_path("retailer_visit_log.csv"))
    visits["visit_date"] = pd.to_datetime(visits["visit_date"])
    _cache["visits"] = visits

    # Digital funnel
    funnel = pd.read_csv(get_csv_path("digital_funnel_weekly.csv"))
    _cache["funnel"] = funnel

    print(f"  Reps: {len(reps)}, Retailers: {len(retailers)}, Growers: {len(growers)}")
    print(f"  Inventory rows (latest): {len(latest_inv)}, Visits: {len(visits)}")
    print("Data loaded.")


def get(key: str) -> pd.DataFrame:
    return _cache.get(key, pd.DataFrame())


def get_rep(rep_id: str) -> dict | None:
    df = _cache.get("reps", pd.DataFrame())
    rows = df[df["rep_id"] == rep_id]
    if rows.empty:
        return None
    r = rows.iloc[0].to_dict()
    return r


def get_retailers_for_rep(rep_id: str, limit: int = 20) -> list[dict]:
    reps_df = _cache.get("reps", pd.DataFrame())
    rep_rows = reps_df[reps_df["rep_id"] == rep_id]
    if rep_rows.empty:
        return []
    territory_id = rep_rows.iloc[0]["territory_id"]
    retailers = _cache.get("retailers", pd.DataFrame())
    result = retailers[retailers["territory_id"] == territory_id].head(limit)
    return result.to_dict(orient="records")


def get_growers_for_rep(rep_id: str, limit: int = 15) -> list[dict]:
    reps_df = _cache.get("reps", pd.DataFrame())
    rep_rows = reps_df[reps_df["rep_id"] == rep_id]
    if rep_rows.empty:
        return []
    tehsil_list = rep_rows.iloc[0]["tehsil_list"]  # already parsed as list at startup
    growers = _cache.get("growers", pd.DataFrame())
    result = growers[growers["tehsil"].isin(tehsil_list)].head(limit)
    if result.empty:
        district = rep_rows.iloc[0]["district"]
        result = growers[growers["district"] == district].head(limit)
    return result.to_dict(orient="records")


def get_inventory_for_retailer(retailer_id: str) -> list[dict]:
    inv = _cache.get("inventory", pd.DataFrame())
    result = inv[inv["retailer_id"] == retailer_id]
    return result.to_dict(orient="records")


def get_visit_history_for_rep(rep_id: str, limit: int = 30) -> list[dict]:
    visits = _cache.get("visits", pd.DataFrame())
    result = visits[visits["rep_id"] == rep_id].sort_values("visit_date", ascending=False).head(limit)
    return result.to_dict(orient="records")


def get_stockout_alerts() -> list[dict]:
    """Return retailers with any stockout (sku_qty == 0) in latest inventory."""
    inv = _cache.get("inventory", pd.DataFrame())
    stockouts = inv[inv["sku_qty"] == 0]
    alerts = []
    for _, row in stockouts.head(20).iterrows():
        alerts.append({
            "retailer_id": row["retailer_id"],
            "sku_id": row["sku_id"],
            "sku_name": row["sku_name"],
            "type": "stockout",
            "severity": "high",
        })
    return alerts


def get_funnel_summary() -> list[dict]:
    funnel = _cache.get("funnel", pd.DataFrame())
    if funnel.empty:
        return []
    latest = funnel.sort_values("week_start_date").groupby("campaign_id").last().reset_index()
    return latest.to_dict(orient="records")
