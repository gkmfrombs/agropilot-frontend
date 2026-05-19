"""
GET /api/copilot/{retailer_id}

Pre-visit intelligence screen. Returns:
- Retailer info + last visit summary
- AI product recommendation (grounded in stock, crop stage, weather)
- Live stock status for key SKUs
- Nearby growers with crop stage
- Agronomic talking points (RAG-powered when available)
- WhatsApp click signals from nearby growers
"""
from datetime import datetime
from fastapi import APIRouter, Query, HTTPException
from services.context import PRODUCTS_CATALOG
from services.weather import get_weather
from data import loader

try:
    from services.rag import query_rag
    _rag_available = True
except ImportError:
    _rag_available = False

router = APIRouter(prefix='/api/copilot', tags=['copilot'])

_URGENCY_PRODUCTS = ['SY_TILT_250EC', 'SY_SCO_250EC', 'SY_TOP_15WP', 'SY_ACT_25WG', 'SY_KAV_75WP']


def _last_visit(tehsil: str, rep_id: str) -> dict:
    """Visit log is tehsil-level — match by visit_tehsil."""
    visits = loader.get('visits')
    if visits is None or visits.empty:
        return {}
    mask = (visits['visit_tehsil'] == tehsil)
    if rep_id:
        mask = mask & (visits['rep_id'] == rep_id)
    rows = visits[mask].sort_values('visit_date', ascending=False)
    if rows.empty:
        # Fallback: any visit by this rep
        rows = visits[visits['rep_id'] == rep_id].sort_values('visit_date', ascending=False)
    if rows.empty:
        return {}
    row = rows.iloc[0]
    visit_date = row.get('visit_date')
    date_str = str(visit_date)[:10] if visit_date is not None else 'unknown'
    days_ago = 999
    try:
        if hasattr(visit_date, 'date'):
            days_ago = (datetime.now().date() - visit_date.date()).days
        else:
            days_ago = (datetime.now().date() - datetime.fromisoformat(str(visit_date)).date()).days
    except Exception:
        pass
    return {
        'date': date_str,
        'days_ago': days_ago,
        'product_recommended': str(row.get('product_recommended', '') or ''),
        'visit_type': str(row.get('visit_type', '') or ''),
    }


def _stock_status(retailer_id: str) -> list[dict]:
    inv = loader.get_inventory_for_retailer(retailer_id)
    result = []
    for item in inv:
        qty = item.get('sku_qty', 0)
        status = 'out_of_stock' if qty == 0 else ('low' if qty <= 5 else 'healthy')
        result.append({
            'sku_id': item.get('sku_id'),
            'sku_name': item.get('sku_name'),
            'qty': qty,
            'status': status,
        })
    return result


def _nearby_growers(tehsil: str, limit: int = 8) -> list[dict]:
    growers = loader.get('growers')
    if growers is None or growers.empty:
        return []
    rows = growers[growers['tehsil'] == tehsil].head(limit)
    result = []
    for _, g in rows.iterrows():
        cal = g.get('grower_crop_calendar', {})
        if isinstance(cal, str):
            import json
            try:
                cal = json.loads(cal)
            except Exception:
                cal = {}
        crop = cal.get('crop', 'unknown')
        stages = cal.get('stages', [])
        stage = stages[-1].get('stage', 'unknown') if stages else 'unknown'
        result.append({
            'grower_id': g['grower_id'],
            'farm_size_acres': round(float(g.get('grower_farm_size', 0) or 0), 1),
            'crop': crop,
            'current_stage': stage,
        })
    return result


def _whatsapp_signals(tehsil: str) -> dict:
    """Aggregate WhatsApp click signals for growers in this tehsil."""
    wa = loader.get('whatsapp')
    growers = loader.get('growers')
    if wa is None or wa.empty or growers is None or growers.empty:
        return {'clicked_count': 0, 'total_sent': 0, 'top_product': None}
    tehsil_grower_ids = set(growers[growers['tehsil'] == tehsil]['grower_id'].tolist())
    tehsil_wa = wa[wa['grower_id'].isin(tehsil_grower_ids)]
    if tehsil_wa.empty:
        return {'clicked_count': 0, 'total_sent': len(tehsil_wa), 'top_product': None}
    clicked = tehsil_wa[tehsil_wa['clicked_status'] == True]
    top_product = None
    if not clicked.empty and 'campaign_product' in clicked.columns:
        top_product = clicked['campaign_product'].value_counts().index[0]
    return {
        'clicked_count': len(clicked),
        'total_sent': len(tehsil_wa),
        'click_rate_pct': round(len(clicked) / len(tehsil_wa) * 100, 1) if len(tehsil_wa) > 0 else 0,
        'top_product_clicked': top_product,
    }


def _pick_recommendation(stock_items: list[dict], growers: list[dict], weather: dict) -> dict:
    """
    Pick the top product to pitch based on:
    1. Stockouts (urgent restock pitch)
    2. Crop stage of nearby growers
    3. Weather risk flags
    """
    humidity = weather.get('current', {}).get('humidity_pct', 0)
    rainfall = weather.get('current', {}).get('rainfall_7d_mm', 0)
    risk_flags = weather.get('risk_flags', [])

    # Stockout priority
    stockouts = [s for s in stock_items if s['status'] == 'out_of_stock']
    if stockouts:
        sku_id = None
        for s in stockouts:
            if s['sku_id'] in _URGENCY_PRODUCTS:
                sku_id = s['sku_id']
                break
        if sku_id and sku_id in PRODUCTS_CATALOG:
            p = PRODUCTS_CATALOG[sku_id]
            return {
                'product': p['name'],
                'sku_id': sku_id,
                'reason': f"STOCKOUT ALERT: {p['name']} is out of stock here. Reorder immediately — demand is active.",
                'urgency': 'high',
                'dose': p['dose'],
                'price': p['price_per_unit'],
            }

    # Crop stage + weather driven
    crop_counts: dict[str, int] = {}
    for g in growers:
        c = g.get('crop', '').lower()
        if c:
            crop_counts[c] = crop_counts.get(c, 0) + 1
    dominant_crop = max(crop_counts, key=crop_counts.get) if crop_counts else 'wheat'

    if 'potato' in dominant_crop:
        sku_id = 'SY_KAV_75WP'
        reason = f"Nearby growers grow potato. Late blight risk with {humidity}% humidity. Kavach 75 WP preventive spray recommended."
    elif 'wheat' in dominant_crop and humidity > 65:
        sku_id = 'SY_TILT_250EC'
        reason = f"Wheat growers nearby at heading stage. {humidity}% humidity + {rainfall}mm rainfall = blight risk. Tilt 250 EC needed urgently."
    elif 'mustard' in dominant_crop:
        sku_id = 'SY_SCO_250EC'
        reason = f"Mustard growers in tehsil at siliqua stage. Alternaria blight risk. Score 250 EC recommended."
    elif 'chickpea' in dominant_crop:
        sku_id = 'SY_ACT_25WG'
        reason = "Chickpea growers at podding stage — pod borer risk. Actara 25 WG recommended."
    else:
        sku_id = 'SY_TILT_250EC'
        reason = "General fungicide push — Tilt 250 EC suits current crop stage and weather conditions."

    if sku_id in PRODUCTS_CATALOG:
        p = PRODUCTS_CATALOG[sku_id]
        return {
            'product': p['name'],
            'sku_id': sku_id,
            'reason': reason,
            'urgency': 'medium' if humidity > 65 else 'low',
            'dose': p['dose'],
            'price': p['price_per_unit'],
        }

    return {'product': 'Tilt 250 EC', 'sku_id': 'SY_TILT_250EC', 'reason': 'Default recommendation', 'urgency': 'low'}


def _talking_points(recommendation: dict, growers: list[dict], weather: dict, wa_signals: dict) -> list[str]:
    """Build 4-5 agronomic talking points for the visit."""
    points = []
    product = recommendation.get('product', '')
    crop = growers[0].get('crop', 'crop') if growers else 'crop'
    humidity = weather.get('current', {}).get('humidity_pct', 0)
    rainfall = weather.get('current', {}).get('rainfall_7d_mm', 0)
    risk_flags = weather.get('risk_flags', [])

    # Point 1 — weather/disease risk
    if risk_flags:
        points.append(f"Weather signal: {risk_flags[0]}")
    else:
        points.append(f"Current humidity {humidity}% with {rainfall}mm rain this week — conditions favor fungal disease onset.")

    # Point 2 — product ROI
    price = recommendation.get('price', 850)
    dose = recommendation.get('dose', '')
    points.append(
        f"ROI pitch: {product} protects yield worth 5-10x the treatment cost at current mandi prices. "
        f"Dose: {dose}."
    )

    # Point 3 — farmer demand signal
    if wa_signals.get('clicked_count', 0) > 0:
        points.append(
            f"{wa_signals['clicked_count']} farmers in this tehsil clicked Syngenta WhatsApp campaigns recently — "
            f"demand is warm. Top interest: {wa_signals.get('top_product_clicked', product)}."
        )
    else:
        points.append(f"Syngenta digital campaign active in this tehsil — reinforce brand message during visit.")

    # Point 4 — crop stage urgency
    stages = list(set(g.get('current_stage', '') for g in growers if g.get('current_stage')))
    if stages:
        points.append(f"Nearby growers at {', '.join(stages[:2])} stage — this is the critical spray window. Miss it and yield loss is irreversible.")
    else:
        points.append("Rabi season peak — decision window for crop protection products is now, not next month.")

    # Point 5 — RAG-powered agronomic tip
    if _rag_available:
        try:
            from services.rag import _disease_seasonality_docs
            rag_tip = query_rag(f"{crop} spray timing disease risk application window {product}", n=3)
            # Only use chunks that are agronomic knowledge, not raw CSV data rows
            for line in rag_tip.split('\n'):
                clean = line.strip().lstrip('[123456789] ')
                if any(kw in clean.lower() for kw in ['risk', 'stage', 'apply', 'spray', 'window', 'dose', 'bbch', 'timing']):
                    points.append(f"Agro tip: {clean}")
                    break
        except Exception:
            pass

    return points[:5]


@router.get('/{retailer_id}')
def get_copilot(
    retailer_id: str,
    rep_id: str = Query(default='REP_0001'),
):
    # --- Load retailer ---
    retailers_df = loader.get('retailers')
    if retailers_df is None or retailers_df.empty:
        raise HTTPException(status_code=503, detail='Data not loaded')
    rows = retailers_df[retailers_df['retailer_id'] == retailer_id]
    if rows.empty:
        raise HTTPException(status_code=404, detail=f'Retailer {retailer_id!r} not found')
    retailer = rows.iloc[0].to_dict()
    tehsil = str(retailer.get('tehsil', ''))
    district = str(retailer.get('district', ''))

    # --- Load supporting data ---
    last_visit = _last_visit(tehsil, rep_id)
    stock = _stock_status(retailer_id)
    growers = _nearby_growers(tehsil)
    weather = get_weather(district or 'Pune')
    wa_signals = _whatsapp_signals(tehsil)
    recommendation = _pick_recommendation(stock, growers, weather)
    talking_points = _talking_points(recommendation, growers, weather, wa_signals)

    return {
        'retailer': {
            'retailer_id': retailer_id,
            'tehsil': tehsil,
            'district': district,
            'state': str(retailer.get('state', '')),
        },
        'last_visit': last_visit,
        'ai_recommendation': recommendation,
        'stock_status': stock,
        'nearby_growers': growers,
        'whatsapp_signals': wa_signals,
        'talking_points': talking_points,
        'weather': weather.get('current', {}),
        'weather_risk_flags': weather.get('risk_flags', []),
    }
