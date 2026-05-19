from fastapi import APIRouter
from data import loader

router = APIRouter(prefix='/api/manager', tags=['manager'])


def _build_territory_revenue() -> dict:
    """
    Compute territory_id → revenue (lakh) map from real POS data.

    Joins pos transactions to retailers on retailer_id to resolve each
    transaction's territory, then sums sku_qty * sku_price per territory.
    Returns an empty dict if either dataset is unavailable.
    """
    pos_df = loader.get('pos')
    retailers_df = loader.get('retailers')

    if (
        pos_df is None or pos_df.empty
        or retailers_df is None or retailers_df.empty
    ):
        return {}

    pos_with_territory = pos_df.merge(
        retailers_df[['retailer_id', 'territory_id']],
        on='retailer_id',
        how='left',
    )

    territory_revenue: dict = (
        (pos_with_territory['sku_qty'] * pos_with_territory['sku_price'])
        .groupby(pos_with_territory['territory_id'])
        .sum()
        .div(100000)
        .round(1)
        .to_dict()
    )
    return territory_revenue


@router.get('/kpi')
def get_kpi():
    visits = loader.get('visits')
    reps = loader.get('reps')
    total_visits = len(visits) if not visits.empty else 0
    total_reps = len(reps) if not reps.empty else 0

    # Real revenue from POS transactions
    pos = loader.get('pos')
    if pos is not None and not pos.empty:
        total_revenue = (pos['sku_qty'] * pos['sku_price']).sum()
        revenue_mtd_lakh = round(total_revenue / 100000, 1)
    else:
        revenue_mtd_lakh = 84.3  # fallback when POS data unavailable

    return {
        'total_visits_mtd': total_visits,
        'total_reps': total_reps,
        'avg_visits_per_rep': round(total_visits / total_reps, 1) if total_reps else 0,
        'revenue_mtd_lakh': revenue_mtd_lakh,
        'revenue_target_lakh': 120.0,
        'ai_accept_rate_pct': 76,
        'coverage_pct': 64,
        'top_product': 'Tilt 250 EC',
        'top_product_units': 1842,
        'alerts_active': 5,
        'alerts_resolved_today': 2,
    }


@router.get('/reps')
def get_rep_performance():
    reps = loader.get('reps')
    visits = loader.get('visits')

    # Build territory → revenue map once, reuse across all reps
    territory_revenue = _build_territory_revenue()

    result = []
    for _, rep in reps.head(10).iterrows():
        rep_visits = visits[visits['rep_id'] == rep['rep_id']] if not visits.empty else []
        visit_count = len(rep_visits)
        products = (
            list(rep_visits['product_recommended'].value_counts().head(2).index)
            if visit_count > 0
            else []
        )

        rep_territory = rep.get('territory_id', '')
        # Use real POS revenue for this territory; fall back to visit-based estimate
        revenue = territory_revenue.get(rep_territory, round(visit_count * 0.08, 1))

        result.append({
            'rep_id': rep['rep_id'],
            'territory': rep.get('territory_name', ''),
            'state': rep.get('state', ''),
            'district': rep.get('district', ''),
            'visits_total': visit_count,
            'top_products': products,
            'revenue_lakh': revenue,
            'coverage_pct': min(95, 40 + visit_count // 2),
            'ai_accept_rate_pct': 70 + (visit_count % 20),
        })
    return {'reps': result}


@router.get('/territory')
def get_territory_heatmap():
    reps = loader.get('reps')
    visits = loader.get('visits')
    if reps.empty:
        return {'territories': []}

    # Build territory → revenue map once, reuse across all territories
    territory_revenue = _build_territory_revenue()

    territories = []
    for _, rep in reps.head(20).iterrows():
        rep_visits = visits[visits['rep_id'] == rep['rep_id']] if not visits.empty else []
        visit_count = len(rep_visits)

        territory_id = rep.get('territory_id', '')
        revenue = territory_revenue.get(territory_id, round(visit_count * 0.08, 1))

        territories.append({
            'territory_id': territory_id,
            'territory_name': rep.get('territory_name', ''),
            'state': rep.get('state', ''),
            'district': rep.get('district', ''),
            'rep_id': rep['rep_id'],
            'visit_count': visit_count,
            'risk_level': 'high' if visit_count < 10 else ('medium' if visit_count < 30 else 'low'),
            'revenue_lakh': revenue,
        })
    return {'territories': territories}


@router.get('/campaigns')
def get_campaigns():
    funnel = loader.get_funnel_summary()
    return {'campaigns': funnel}
