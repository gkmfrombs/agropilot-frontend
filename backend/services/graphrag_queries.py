"""
GraphRAG Cypher query library for AgroPilot.

All queries use multi-hop graph traversal to answer questions that
would require 5+ table JOINs in SQL.

Graph schema (visit log is TEHSIL-level, not retailer-level):
  Rep -[:COVERS]-> Territory -[:CONTAINS]-> Retailer -[:LOCATED_IN]-> Tehsil
  Farmer -[:LOCATED_IN]-> Tehsil
  Farmer -[:RECEIVED]-> WhatsAppMsg -[:ABOUT]-> SKU
  Retailer -[:STOCKS {sku_qty}]-> SKU
  Rep -[:VISITED {date, type, product}]-> Tehsil
"""
from __future__ import annotations
from datetime import date, timedelta
from services.neo4j_client import run_query, is_available


def _is_up() -> bool:
    return is_available()


# ---------------------------------------------------------------------------
# Query 1 — Priority retailer list for a rep
# 4-hop: Rep → Territory → Retailer → stock + tehsil → warm farmers
# ---------------------------------------------------------------------------

def get_priority_retailers(rep_id: str, limit: int = 10) -> list[dict]:
    """
    Score each retailer by:
      - OOS product count (×3)
      - Nearby farmers who clicked WhatsApp in last 14 days (×2)
      - Days since rep last visited the tehsil (×1, inverted)
    Returns top-N retailers sorted by priority_score DESC.
    """
    if not _is_up():
        from services import csv_graphrag  # lazy — avoids circular import at load time
        return csv_graphrag.get_priority_retailers_csv(rep_id, limit)
    cutoff = str(date.today() - timedelta(days=14))
    return run_query("""
        MATCH (rep:Rep {rep_id: $rep_id})-[:COVERS]->(terr:Territory)
              -[:CONTAINS]->(retail:Retailer)
        OPTIONAL MATCH (retail)-[st:STOCKS]->(oos_sku:SKU)
            WHERE st.sku_qty = 0
        WITH rep, retail, count(oos_sku) AS oos_count
        OPTIONAL MATCH (retail)-[:LOCATED_IN]->(th:Tehsil)
                       <-[:LOCATED_IN]-(f:Farmer)
                       -[:RECEIVED]->(m:WhatsAppMsg)
            WHERE m.clicked = true AND m.sent_date >= $cutoff
        WITH rep, retail, oos_count, count(DISTINCT f) AS warm_farmers, th
        OPTIONAL MATCH (rep)-[v:VISITED]->(th)
        WITH retail, oos_count, warm_farmers, th,
             max(v.visit_date) AS last_tehsil_visit
        RETURN retail.retailer_id   AS retailer_id,
               retail.tehsil        AS tehsil,
               oos_count,
               warm_farmers,
               last_tehsil_visit,
               (oos_count * 3 + warm_farmers * 2) AS priority_score
        ORDER BY priority_score DESC
        LIMIT $limit
    """, {"rep_id": rep_id, "cutoff": cutoff, "limit": limit})


# ---------------------------------------------------------------------------
# Query 2 — Pre-visit context card for a retailer
# ---------------------------------------------------------------------------

def get_retailer_context(retailer_id: str) -> dict:
    """
    Returns stock status, nearby farmers (crop/stage), WA engagement warmth.
    Used by the copilot endpoint and chat retrieval.
    """
    if not _is_up():
        return {}

    stock = run_query("""
        MATCH (r:Retailer {retailer_id: $rid})-[st:STOCKS]->(sku:SKU)
        RETURN sku.name AS sku_name, sku.sku_id AS sku_id, st.sku_qty AS qty
        ORDER BY st.sku_qty ASC
        LIMIT 10
    """, {"rid": retailer_id})

    farmers = run_query("""
        MATCH (r:Retailer {retailer_id: $rid})-[:LOCATED_IN]->(th:Tehsil)
              <-[:LOCATED_IN]-(f:Farmer)
        RETURN f.grower_id AS grower_id, f.main_crop AS crop,
               f.current_stage AS stage, f.farm_size AS farm_size
        LIMIT 20
    """, {"rid": retailer_id})

    warmth = run_query("""
        MATCH (r:Retailer {retailer_id: $rid})-[:LOCATED_IN]->(th:Tehsil)
              <-[:LOCATED_IN]-(f:Farmer)
              -[:RECEIVED]->(m:WhatsAppMsg)
        WHERE m.clicked = true
        RETURN count(DISTINCT f) AS clicked_farmers,
               collect(DISTINCT m.product)[..3] AS top_products
    """, {"rid": retailer_id})

    return {
        "stock": stock,
        "nearby_farmers": farmers,
        "wa_warmth": warmth[0] if warmth else {},
    }


# ---------------------------------------------------------------------------
# Query 3 — OOS stockout clusters across territory
# ---------------------------------------------------------------------------

def get_oos_clusters(rep_id: str) -> list[dict]:
    """
    Finds tehsils where multiple retailers are out of stock on the same SKU.
    High-priority intervention areas.
    """
    if not _is_up():
        from services import csv_graphrag  # lazy — avoids circular import at load time
        return csv_graphrag.get_oos_clusters_csv(rep_id)
    return run_query("""
        MATCH (rep:Rep {rep_id: $rep_id})-[:COVERS]->(terr:Territory)
              -[:CONTAINS]->(r:Retailer)
              -[st:STOCKS]->(sku:SKU)
        WHERE st.sku_qty = 0
        WITH sku.name AS product, r.tehsil AS tehsil, count(r) AS oos_retailers
        WHERE oos_retailers >= 2
        RETURN product, tehsil, oos_retailers
        ORDER BY oos_retailers DESC
        LIMIT 10
    """, {"rep_id": rep_id})


# ---------------------------------------------------------------------------
# Query 4 — Warm farmers in a tehsil (clicked WhatsApp recently)
# ---------------------------------------------------------------------------

def get_warm_farmers(tehsil: str, days: int = 14) -> list[dict]:
    """Farmers in tehsil who clicked a WhatsApp campaign recently."""
    if not _is_up():
        from services import csv_graphrag  # lazy — avoids circular import at load time
        return csv_graphrag.get_warm_farmers_csv(tehsil, days)
    cutoff = str(date.today() - timedelta(days=days))
    return run_query("""
        MATCH (f:Farmer)-[:LOCATED_IN]->(th:Tehsil {name: $tehsil})
        MATCH (f)-[:RECEIVED]->(m:WhatsAppMsg)
        WHERE m.clicked = true AND m.sent_date >= $cutoff
        RETURN f.grower_id AS grower_id, f.main_crop AS crop,
               f.current_stage AS stage, m.product AS interested_product
        LIMIT 30
    """, {"tehsil": tehsil, "cutoff": cutoff})


# ---------------------------------------------------------------------------
# Query 5 — Graph context string for chat/LLM (the money query)
# Returns a formatted text block injected into the LLM system prompt.
# ---------------------------------------------------------------------------

def get_graph_context_for_chat(rep_id: str) -> str:
    """
    Multi-hop graph traversal → formatted text block for LLM context.
    Falls back to CSV-based GraphRAG when Neo4j is unavailable.
    """
    if not _is_up():
        from services import csv_graphrag  # lazy — avoids circular import at load time
        return csv_graphrag.get_graph_context_csv(rep_id)

    priority = get_priority_retailers(rep_id, limit=5)
    clusters = get_oos_clusters(rep_id)

    if not priority and not clusters:
        return ""

    lines = ["=== GRAPH INTELLIGENCE (Neo4j — live multi-hop traversal) ==="]

    if priority:
        lines.append("\nTOP PRIORITY RETAILERS (OOS + warm farmers):")
        for r in priority:
            lv = r.get("last_tehsil_visit") or "never"
            lines.append(
                f"  {r['retailer_id']} ({r['tehsil']}) — "
                f"{r['oos_count']} OOS SKUs | "
                f"{r['warm_farmers']} warm farmers | "
                f"last visit: {lv} | score: {r['priority_score']}"
            )

    if clusters:
        lines.append("\nSTOCKOUT CLUSTERS (multiple retailers, same SKU):")
        for c in clusters:
            lines.append(
                f"  {c['product']} — {c['oos_retailers']} retailers OOS in {c['tehsil']}"
            )

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Query 6 — Rep territory summary for briefing
# ---------------------------------------------------------------------------

def get_territory_graph_summary(rep_id: str) -> dict:
    """High-level counts for the rep's territory from the graph."""
    if not _is_up():
        return {}
    result = run_query("""
        MATCH (rep:Rep {rep_id: $rep_id})-[:COVERS]->(terr:Territory)
              -[:CONTAINS]->(r:Retailer)
        WITH rep, terr, count(r) AS total_retailers
        OPTIONAL MATCH (terr)-[:CONTAINS]->(r2:Retailer)
                       -[:LOCATED_IN]->(th:Tehsil)
                       <-[:LOCATED_IN]-(f:Farmer)
        WITH terr, total_retailers, count(DISTINCT f) AS reachable_farmers
        OPTIONAL MATCH (terr)-[:CONTAINS]->(r3:Retailer)
                       -[st:STOCKS]->(sku:SKU)
        WHERE st.sku_qty = 0
        RETURN terr.territory_name   AS territory,
               total_retailers,
               reachable_farmers,
               count(DISTINCT sku) AS oos_skus
    """, {"rep_id": rep_id})
    return result[0] if result else {}
