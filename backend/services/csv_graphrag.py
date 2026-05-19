"""
CSV-based GraphRAG for AgroPilot.

Simulates multi-hop graph traversal using pandas DataFrames loaded from CSVs.
Used as a zero-infrastructure fallback when Neo4j is unavailable.

Graph topology simulated:
  Rep -[COVERS]-> Territory -[CONTAINS]-> Retailer -[LOCATED_IN]-> Tehsil
  Grower -[LOCATED_IN]-> Tehsil
  Grower -[RECEIVED]-> WhatsAppMsg -[ABOUT]-> SKU
  Retailer -[STOCKS]-> SKU
  Rep -[VISITED]-> Tehsil

Key design decisions:
  - IDs always compared as str() to avoid int/str mismatches
  - WhatsApp "warm" window uses a rolling offset from the latest message
    date in the dataset (not from today) because the sample data ends
    ~44 days before the current system date.
  - All DataFrame operations are copy-safe — no in-place mutations.
"""
from __future__ import annotations

import json
from datetime import date, timedelta
from typing import Optional

import pandas as pd


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _get_df(key: str) -> pd.DataFrame:
    """Lazy import of loader to avoid circular dependency at module load time."""
    from data import loader  # noqa: PLC0415
    return loader.get(key)


def _str_id(val) -> str:
    """Normalise any ID to string, stripping whitespace."""
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return ''
    return str(val).strip()


def _is_clicked(val) -> bool:
    """Handle bool, 'True'/'False' strings, and int 0/1."""
    if isinstance(val, bool):
        return val
    if isinstance(val, int):
        return val == 1
    if isinstance(val, str):
        return val.strip().lower() == 'true'
    # numpy bool_
    try:
        return bool(val)
    except Exception:
        return False


def _rep_territory(rep_id: str) -> Optional[str]:
    """Return territory_id for rep_id, or None if not found."""
    reps = _get_df('reps')
    if reps.empty:
        return None
    row = reps[reps['rep_id'] == rep_id]
    if row.empty:
        return None
    return _str_id(row.iloc[0]['territory_id'])


def _retailers_for_territory(territory_id: str) -> pd.DataFrame:
    """All retailers belonging to a territory_id."""
    retailers = _get_df('retailers')
    if retailers.empty:
        return pd.DataFrame()
    return retailers[retailers['territory_id'] == territory_id].copy()


def _wa_cutoff_date(days: int) -> pd.Timestamp:
    """
    Return a cutoff Timestamp such that we look back 'days' calendar days
    from the LATEST message in the WhatsApp dataset.

    This compensates for the sample data ending before the current system date.
    If the dataset is fresh (last message within 7 days of today), we fall back
    to anchoring from today.
    """
    wa = _get_df('whatsapp')
    if wa.empty:
        return pd.Timestamp(date.today() - timedelta(days=days))

    try:
        latest = pd.to_datetime(wa['message_sent_date']).max()
    except Exception:
        return pd.Timestamp(date.today() - timedelta(days=days))

    today = pd.Timestamp(date.today())
    # If dataset is stale (latest msg > 7 days ago), anchor from dataset max
    if (today - latest).days > 7:
        return latest - pd.Timedelta(days=days)

    return today - pd.Timedelta(days=days)


def _extract_crop_stage(crop_calendar) -> tuple[str, str]:
    """
    Parse grower_crop_calendar (already decoded as dict by loader.load_all).
    Returns (crop, latest_stage).
    """
    cal = crop_calendar
    if isinstance(cal, str):
        try:
            cal = json.loads(cal)
        except Exception:
            return 'unknown', 'unknown'
    if not isinstance(cal, dict):
        return 'unknown', 'unknown'

    crop = str(cal.get('crop', 'unknown'))
    stages = cal.get('stages', [])
    if stages and isinstance(stages, list):
        last = stages[-1]
        stage = str(last.get('stage', 'unknown')) if isinstance(last, dict) else 'unknown'
    else:
        stage = 'unknown'
    return crop, stage


# ---------------------------------------------------------------------------
# Hop 1 — Rep → Territory → Retailers (with OOS, warm-farmer, visit scores)
# ---------------------------------------------------------------------------

def get_priority_retailers_csv(rep_id: str, limit: int = 10) -> list[dict]:
    """
    Multi-hop traversal:
      Rep → territory_id → Retailers → inventory (OOS count)
                                     → tehsil → Growers → WhatsApp (warm count)
      Rep → Visits (days since last tehsil visit)

    Scoring:
      priority_score = oos_count * 3 + warm_farmers * 2 + (1 if not visited in 7 days else 0)

    Returns top-N retailers sorted by priority_score DESC.
    """
    territory_id = _rep_territory(rep_id)
    if not territory_id:
        return []

    # Hop 1: Rep → Territory → Retailers
    rep_retailers = _retailers_for_territory(territory_id)
    if rep_retailers.empty:
        return []

    rep_rids = set(rep_retailers['retailer_id'].astype(str))

    # Hop 2a: Retailers → Inventory (OOS count per retailer)
    inv = _get_df('inventory')
    oos_per_retailer: dict[str, int] = {}
    if not inv.empty:
        oos = inv[inv['sku_qty'] == 0].copy()
        oos['retailer_id'] = oos['retailer_id'].astype(str)
        oos_subset = oos[oos['retailer_id'].isin(rep_rids)]
        oos_counts = oos_subset.groupby('retailer_id').size()
        oos_per_retailer = oos_counts.to_dict()

    # Hop 2b: Retailers → Tehsil → Growers → WhatsApp (warm farmers per tehsil)
    growers = _get_df('growers')
    wa = _get_df('whatsapp')
    warm_per_tehsil: dict[str, int] = {}

    if not growers.empty and not wa.empty:
        cutoff = _wa_cutoff_date(days=14)

        # Parse WA dates once
        wa_parsed = wa.copy()
        wa_parsed['sent_ts'] = pd.to_datetime(wa_parsed['message_sent_date'], errors='coerce')
        recent_clicked = wa_parsed[
            wa_parsed['sent_ts'] >= cutoff
        ]
        # Filter to clicked messages
        clicked_mask = recent_clicked['clicked_status'].apply(_is_clicked)
        clicked_wa = recent_clicked[clicked_mask]

        if not clicked_wa.empty:
            clicked_gids = set(clicked_wa['grower_id'].astype(str))
            # Growers who clicked WA recently
            warm_growers = growers[growers['grower_id'].astype(str).isin(clicked_gids)]
            # Group warm growers by tehsil
            if not warm_growers.empty:
                wg_tehsil = warm_growers.groupby('tehsil').size()
                warm_per_tehsil = wg_tehsil.to_dict()

    # Hop 3: Rep → Visits (last visit date per tehsil)
    visits = _get_df('visits')
    last_visit_per_tehsil: dict[str, pd.Timestamp] = {}
    if not visits.empty:
        rep_visits = visits[visits['rep_id'] == rep_id].copy()
        if not rep_visits.empty:
            rep_visits['visit_date'] = pd.to_datetime(rep_visits['visit_date'], errors='coerce')
            latest = rep_visits.groupby('visit_tehsil')['visit_date'].max()
            last_visit_per_tehsil = latest.to_dict()

    seven_days_ago = pd.Timestamp(date.today() - timedelta(days=7))

    # Score each retailer
    results: list[dict] = []
    for _, row in rep_retailers.iterrows():
        retailer_id = _str_id(row['retailer_id'])
        tehsil = _str_id(row.get('tehsil', ''))
        district = _str_id(row.get('district', ''))
        state = _str_id(row.get('state', ''))

        oos_count = int(oos_per_retailer.get(retailer_id, 0))
        warm_farmers = int(warm_per_tehsil.get(tehsil, 0))

        last_visit = last_visit_per_tehsil.get(tehsil)
        not_recently_visited = 1 if (last_visit is None or last_visit < seven_days_ago) else 0
        last_visit_str = str(last_visit.date()) if isinstance(last_visit, pd.Timestamp) else 'never'

        priority_score = oos_count * 3 + warm_farmers * 2 + not_recently_visited

        results.append({
            'retailer_id': retailer_id,
            'tehsil': tehsil,
            'district': district,
            'state': state,
            'territory_id': territory_id,
            'oos_count': oos_count,
            'warm_farmers': warm_farmers,
            'last_tehsil_visit': last_visit_str,
            'recently_visited': not not_recently_visited,
            'priority_score': priority_score,
        })

    results.sort(key=lambda x: x['priority_score'], reverse=True)
    return results[:limit]


# ---------------------------------------------------------------------------
# Hop 2 — OOS stockout clusters across territory
# ---------------------------------------------------------------------------

def get_oos_clusters_csv(rep_id: str) -> list[dict]:
    """
    Finds tehsils where 2+ retailers belonging to this rep's territory are
    out-of-stock on the same SKU — a critical supply-chain signal.

    Multi-hop: Rep → Territory → Retailers → Inventory (OOS) → Tehsil grouping

    Returns: [{product, tehsil, oos_retailers}] sorted by oos_retailers DESC.
    """
    territory_id = _rep_territory(rep_id)
    if not territory_id:
        return []

    rep_retailers = _retailers_for_territory(territory_id)
    if rep_retailers.empty:
        return []

    rep_rids = set(rep_retailers['retailer_id'].astype(str))

    inv = _get_df('inventory')
    if inv.empty:
        return []

    # Filter to OOS items for this rep's retailers
    oos = inv[inv['sku_qty'] == 0].copy()
    oos['retailer_id'] = oos['retailer_id'].astype(str)
    oos_subset = oos[oos['retailer_id'].isin(rep_rids)]

    if oos_subset.empty:
        return []

    # Join with retailer tehsil info
    retailer_tehsil = rep_retailers[['retailer_id', 'tehsil']].copy()
    retailer_tehsil['retailer_id'] = retailer_tehsil['retailer_id'].astype(str)

    oos_with_tehsil = oos_subset.merge(retailer_tehsil, on='retailer_id', how='left')

    # Group by (sku_name, tehsil) — count distinct retailers
    cluster_counts = (
        oos_with_tehsil
        .groupby(['sku_name', 'tehsil'])['retailer_id']
        .nunique()
        .reset_index()
    )
    cluster_counts.columns = ['product', 'tehsil', 'oos_retailers']

    # Only clusters where 2+ retailers are OOS on the same SKU in same tehsil
    clusters = cluster_counts[cluster_counts['oos_retailers'] >= 2].copy()
    clusters = clusters.sort_values('oos_retailers', ascending=False)

    return clusters.head(10).to_dict(orient='records')


# ---------------------------------------------------------------------------
# Hop 3 — Warm farmers in a tehsil
# ---------------------------------------------------------------------------

def get_warm_farmers_csv(tehsil: str, days: int = 14) -> list[dict]:
    """
    Finds growers in the given tehsil who received and CLICKED a WhatsApp
    campaign message within the last `days` calendar days (anchored to the
    latest message date in the dataset to handle stale sample data).

    Multi-hop: Tehsil → Growers → WhatsApp messages (clicked) → product interest

    Returns: [{grower_id, crop, stage, interested_product, farm_size}]
    """
    growers = _get_df('growers')
    wa = _get_df('whatsapp')

    if growers.empty or wa.empty:
        return []

    # Hop 1: Tehsil → Growers
    tehsil_growers = growers[growers['tehsil'] == tehsil].copy()
    if tehsil_growers.empty:
        return []

    tehsil_gids = set(tehsil_growers['grower_id'].astype(str))

    # Hop 2: Growers → WhatsApp (clicked, recent)
    cutoff = _wa_cutoff_date(days=days)
    wa_parsed = wa.copy()
    wa_parsed['sent_ts'] = pd.to_datetime(wa_parsed['message_sent_date'], errors='coerce')

    recent_clicked = wa_parsed[
        (wa_parsed['sent_ts'] >= cutoff)
        & wa_parsed['clicked_status'].apply(_is_clicked)
        & wa_parsed['grower_id'].astype(str).isin(tehsil_gids)
    ]

    if recent_clicked.empty:
        return []

    # One row per grower (take last clicked message per grower)
    per_grower = recent_clicked.sort_values('sent_ts').groupby('grower_id').last().reset_index()

    results: list[dict] = []
    for _, row in per_grower.iterrows():
        gid = _str_id(row['grower_id'])
        grower_row = tehsil_growers[tehsil_growers['grower_id'].astype(str) == gid]
        if grower_row.empty:
            continue

        g = grower_row.iloc[0]
        crop, stage = _extract_crop_stage(g.get('grower_crop_calendar', {}))
        farm_size = round(float(g.get('grower_farm_size', 0) or 0), 1)

        results.append({
            'grower_id': gid,
            'crop': crop,
            'stage': stage,
            'interested_product': _str_id(row.get('campaign_product', '')),
            'farm_size_acres': farm_size,
            'last_clicked': str(row['sent_ts'].date()) if pd.notna(row['sent_ts']) else 'unknown',
        })

    return results[:30]


# ---------------------------------------------------------------------------
# Composite — Graph context string for LLM system prompt injection
# ---------------------------------------------------------------------------

def get_graph_context_csv(rep_id: str) -> str:
    """
    Runs multi-hop graph traversal across all CSVs and formats the results
    as a rich text block for injection into the LLM system prompt.

    Equivalent to the Neo4j get_graph_context_for_chat() but zero-infra.

    Returns empty string if no data is found for the rep.
    """
    priority = get_priority_retailers_csv(rep_id, limit=5)
    clusters = get_oos_clusters_csv(rep_id)

    if not priority and not clusters:
        return ''

    lines = ['=== GRAPH INTELLIGENCE (CSV multi-hop traversal) ===']

    if priority:
        # Summarise the territory
        total_oos = sum(r['oos_count'] for r in priority)
        total_warm = sum(r['warm_farmers'] for r in priority)
        rep_state = priority[0].get('state', '')
        rep_district = priority[0].get('district', '')
        lines.append(
            f'\nTerritory summary ({rep_state}, {rep_district}): '
            f'{len(priority)} retailers shown | {total_oos} OOS SKUs | '
            f'{total_warm} warm farmers nearby'
        )

        lines.append('\nTOP PRIORITY RETAILERS (OOS + warm farmers):')
        for r in priority:
            lv = r.get('last_tehsil_visit') or 'never'
            recently = 'visited recently' if r.get('recently_visited') else 'NOT visited in 7+ days'
            lines.append(
                f"  {r['retailer_id']} @ {r['tehsil']} ({r['district']}) — "
                f"{r['oos_count']} OOS SKUs | "
                f"{r['warm_farmers']} warm farmers | "
                f"last visit: {lv} ({recently}) | "
                f"score: {r['priority_score']}"
            )

    if clusters:
        lines.append('\nSTOCKOUT CLUSTERS (2+ retailers OOS on same SKU, same tehsil):')
        for c in clusters:
            lines.append(
                f"  {c['product']} — {c['oos_retailers']} retailers OOS in {c['tehsil']}"
            )
        lines.append(
            '  ACTION: Urgent restock conversation needed — '
            'demand exists but shelf is empty.'
        )

    # Warm farmer detail for high-scoring tehsils
    if priority:
        top_tehsil = priority[0].get('tehsil', '')
        if top_tehsil and priority[0].get('warm_farmers', 0) > 0:
            warm = get_warm_farmers_csv(top_tehsil, days=14)
            if warm:
                lines.append(f'\nWARM FARMERS in {top_tehsil} (clicked WhatsApp recently):')
                for f in warm[:5]:
                    lines.append(
                        f"  {f['grower_id']}: {f['crop']} ({f['stage']}) | "
                        f"{f['farm_size_acres']} acres | "
                        f"interested in {f['interested_product']} | "
                        f"clicked: {f['last_clicked']}"
                    )

    return '\n'.join(lines)
