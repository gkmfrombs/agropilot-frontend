import pandas as pd
import os
from functools import lru_cache

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

@lru_cache(maxsize=None)
def get_dataframe(filename: str) -> pd.DataFrame:
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Warning: Data file not found {filepath}")
        return pd.DataFrame()
    
    return pd.read_csv(filepath)

def get_reps_territory():
    return get_dataframe("reps_territory.csv")

def get_retailer_inventory_weekly():
    return get_dataframe("retailer_inventory_weekly.csv")

def get_retailer_visit_log():
    return get_dataframe("retailer_visit_log.csv")

def get_retailers():
    return get_dataframe("retailers.csv")

def get_whatsapp_campaign():
    return get_dataframe("whatsapp_campaign.csv")

def get_retailer_pos():
    return get_dataframe("retailer_pos.csv")

def get_growers():
    return get_dataframe("growers.csv")
