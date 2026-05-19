"""
AgroPilot Knowledge Graph Builder
Ingests all 8 Syngenta CSVs into Neo4j AuraDB.

Run once to populate the graph:
    cd backend
    python -m data.graph_builder

Key schema adaptations from raw CSVs:
- Visit log has NO retailer_id — visits are tehsil-level:
  Rep -[:VISITED {date, type, product}]-> Tehsil
- WhatsApp: grower_id + campaign_product for RECEIVED + ABOUT edges
- Growers: offline_campaign_attended + campaign_attendance_date for ATTENDED
- Funnel columns: social_post_impression, lead_form_submission (no trailing s)
"""
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
from pathlib import Path
from config import get_settings
from services.neo4j_client import run_query, is_available

settings = get_settings()


def csv(filename: str) -> str:
    return os.path.join(settings.csv_dir, filename)


def _batch_run(cypher: str, rows: list[dict]) -> None:
    """Write rows in batches of 500 using UNWIND for performance."""
    batch_size = 500
    for i in range(0, len(rows), batch_size):
        run_query(f"UNWIND $rows AS row {cypher}", {"rows": rows[i:i + batch_size]})


def create_indexes():
    print("Creating indexes...")
    indexes = [
        "CREATE INDEX rep_id IF NOT EXISTS FOR (n:Rep) ON (n.rep_id)",
        "CREATE INDEX territory_id IF NOT EXISTS FOR (n:Territory) ON (n.territory_id)",
        "CREATE INDEX retailer_id IF NOT EXISTS FOR (n:Retailer) ON (n.retailer_id)",
        "CREATE INDEX sku_id IF NOT EXISTS FOR (n:SKU) ON (n.sku_id)",
        "CREATE INDEX grower_id IF NOT EXISTS FOR (n:Farmer) ON (n.grower_id)",
        "CREATE INDEX tehsil_name IF NOT EXISTS FOR (n:Tehsil) ON (n.name)",
        "CREATE INDEX campaign_id IF NOT EXISTS FOR (n:Campaign) ON (n.campaign_id)",
        "CREATE INDEX msg_id IF NOT EXISTS FOR (n:WhatsAppMsg) ON (n.msg_id)",
    ]
    for idx in indexes:
        run_query(idx)
    print("Indexes created.")


def load_reps_territories():
    print("Loading Reps + Territories...")
    df = pd.read_csv(csv("reps_territory.csv"))
    rows = df.to_dict("records")
    _batch_run("""
        MERGE (rep:Rep {rep_id: row.rep_id})
        SET rep.state = row.state, rep.district = row.district
        MERGE (terr:Territory {territory_id: row.territory_id})
        SET terr.territory_name = row.territory_name,
            terr.state = row.state,
            terr.district = row.district
        MERGE (rep)-[:COVERS]->(terr)
    """, rows)
    print(f"  Loaded {len(rows)} reps/territories.")


def load_retailers():
    print("Loading Retailers...")
    df = pd.read_csv(csv("retailers.csv"))
    rows = df.to_dict("records")
    _batch_run("""
        MERGE (r:Retailer {retailer_id: row.retailer_id})
        SET r.state = row.state, r.district = row.district, r.tehsil = row.tehsil
        MERGE (terr:Territory {territory_id: row.territory_id})
        MERGE (terr)-[:CONTAINS]->(r)
        MERGE (th:Tehsil {name: row.tehsil, district: row.district})
        SET th.state = row.state
        MERGE (r)-[:LOCATED_IN]->(th)
    """, rows)
    print(f"  Loaded {len(rows)} retailers.")


def load_inventory():
    print("Loading Inventory (latest week per retailer/SKU)...")
    df = pd.read_csv(csv("retailer_inventory_weekly.csv"))
    df["week_end_date"] = pd.to_datetime(df["week_end_date"])
    latest = (
        df.sort_values("week_end_date")
        .groupby(["retailer_id", "sku_id"])
        .last()
        .reset_index()
    )
    latest["week_end_date"] = latest["week_end_date"].dt.strftime("%Y-%m-%d")
    rows = latest.to_dict("records")
    _batch_run("""
        MERGE (sku:SKU {sku_id: row.sku_id})
        SET sku.name = row.sku_name
        WITH sku, row
        MATCH (r:Retailer {retailer_id: row.retailer_id})
        MERGE (r)-[st:STOCKS]->(sku)
        SET st.sku_qty = toInteger(row.sku_qty),
            st.week_end_date = row.week_end_date
    """, rows)
    print(f"  Loaded {len(rows)} inventory records.")


def load_pos():
    print("Loading POS transactions (latest 10k)...")
    df = pd.read_csv(csv("retailer_pos.csv"), nrows=10000)
    df["transaction_date"] = pd.to_datetime(df["transaction_date"]).dt.strftime("%Y-%m-%d")
    rows = df.to_dict("records")
    _batch_run("""
        MERGE (sku:SKU {sku_id: row.sku_id})
        SET sku.name = row.sku_name
        WITH sku, row
        MATCH (r:Retailer {retailer_id: row.retailer_id})
        MERGE (r)-[s:SOLD {transaction_id: row.transaction_id}]->(sku)
        SET s.qty = toInteger(row.sku_qty),
            s.price = toFloat(row.sku_price),
            s.date = row.transaction_date
    """, rows)
    print(f"  Loaded {len(rows)} POS records.")


def load_visits():
    """
    Visit log is TEHSIL-LEVEL — no retailer_id exists.
    Schema: Rep -[:VISITED {date, type, product}]-> Tehsil
    """
    print("Loading Visit Log (tehsil-level)...")
    df = pd.read_csv(csv("retailer_visit_log.csv"))
    df["visit_date"] = pd.to_datetime(df["visit_date"]).dt.strftime("%Y-%m-%d")
    rows = df[["rep_id", "visit_date", "visit_tehsil", "visit_type", "product_recommended"]].to_dict("records")
    _batch_run("""
        MATCH (rep:Rep {rep_id: row.rep_id})
        MERGE (th:Tehsil {name: row.visit_tehsil})
        CREATE (rep)-[:VISITED {
            visit_date: row.visit_date,
            visit_type: row.visit_type,
            product_recommended: row.product_recommended
        }]->(th)
    """, rows)
    print(f"  Loaded {len(rows)} visit records.")


def load_growers():
    print("Loading Growers...")
    df = pd.read_csv(csv("growers.csv"), nrows=2000)
    df["grower_crop_calendar"] = df["grower_crop_calendar"].apply(
        lambda x: json.loads(x) if pd.notna(x) else {}
    )
    df["main_crop"] = df["grower_crop_calendar"].apply(lambda c: c.get("crop", ""))
    df["current_stage"] = df["grower_crop_calendar"].apply(
        lambda c: (c.get("stages") or [{}])[-1].get("stage", "")
    )
    rows = df[[
        "grower_id", "state", "district", "tehsil", "language", "device_type",
        "grower_age", "gender", "grower_farm_size", "main_crop", "current_stage",
        "product_scan", "product_scan_datetime", "offline_campaign_attended", "campaign_attendance_date"
    ]].fillna("").to_dict("records")
    _batch_run("""
        MERGE (f:Farmer {grower_id: row.grower_id})
        SET f.state = row.state, f.district = row.district, f.tehsil = row.tehsil,
            f.language = row.language, f.device_type = row.device_type,
            f.age = toInteger(row.grower_age), f.gender = row.gender,
            f.farm_size = toFloat(row.grower_farm_size),
            f.main_crop = row.main_crop, f.current_stage = row.current_stage
        WITH f, row
        MERGE (th:Tehsil {name: row.tehsil, district: row.district})
        MERGE (f)-[:LOCATED_IN]->(th)
        WITH f, row
        FOREACH (_ IN CASE WHEN row.product_scan <> '' THEN [1] ELSE [] END |
            MERGE (sku:SKU {sku_id: row.product_scan})
            MERGE (f)-[:SCANNED {datetime: row.product_scan_datetime}]->(sku)
        )
        WITH f, row
        FOREACH (_ IN CASE WHEN row.offline_campaign_attended <> '' THEN [1] ELSE [] END |
            MERGE (c:Campaign {campaign_id: row.offline_campaign_attended})
            MERGE (f)-[:ATTENDED {date: row.campaign_attendance_date}]->(c)
        )
    """, rows)
    print(f"  Loaded {len(rows)} growers.")


def load_whatsapp():
    print("Loading WhatsApp Campaign log...")
    df = pd.read_csv(csv("whatsapp_campaign.csv"))
    df["message_sent_date"] = pd.to_datetime(df["message_sent_date"]).dt.strftime("%Y-%m-%d")
    rows = df.to_dict("records")
    _batch_run("""
        MERGE (m:WhatsAppMsg {msg_id: toString(row.id)})
        SET m.delivered = row.delivered_status,
            m.opened = row.opened_status,
            m.clicked = row.clicked_status,
            m.sent_date = row.message_sent_date,
            m.crop = row.campaign_crop,
            m.product = row.campaign_product
        WITH m, row
        MATCH (f:Farmer {grower_id: row.grower_id})
        MERGE (f)-[:RECEIVED]->(m)
        WITH m, row
        MERGE (sku:SKU {sku_id: row.campaign_product})
        SET sku.name = row.campaign_product
        MERGE (m)-[:ABOUT]->(sku)
    """, rows)
    print(f"  Loaded {len(rows)} WhatsApp messages.")


def load_funnel():
    print("Loading Digital Funnel data...")
    df = pd.read_csv(csv("digital_funnel_weekly.csv"))
    df["week_start_date"] = pd.to_datetime(df["week_start_date"]).dt.strftime("%Y-%m-%d")
    rows = df.to_dict("records")
    _batch_run("""
        MERGE (c:Campaign {campaign_id: row.campaign_id})
        SET c.campaign_crop = row.campaign_crop,
            c.campaign_product = row.campaign_product,
            c.week = row.week_start_date,
            c.impressions = toInteger(row.social_post_impression),
            c.lp_visits = toInteger(row.landing_page_visits),
            c.leads = toInteger(row.lead_form_submission)
        WITH c, row
        MERGE (sku:SKU {sku_id: row.campaign_product})
        SET sku.name = row.campaign_product
        MERGE (c)-[:PROMOTES]->(sku)
    """, rows)
    print(f"  Loaded {len(rows)} funnel records.")


def build_graph():
    if not is_available():
        print("Neo4j not configured — set NEO4J_URI in .env and retry.")
        return
    print("Building AgroPilot Knowledge Graph in Neo4j...")
    create_indexes()
    load_reps_territories()
    load_retailers()
    load_inventory()
    load_pos()
    load_visits()
    load_growers()
    load_whatsapp()
    load_funnel()
    print("Graph built successfully!")


if __name__ == "__main__":
    build_graph()
