"""
Data-first structured responses for common field rep queries.
No LLM — builds from real CSV data and live weather API.
Always returns ## heading + - bullet format so the frontend card
renders correctly every time.
"""
from data import loader
from services.weather import get_weather


def detect_intent(msg: str) -> str:
    """Classify user message into a structured intent or 'llm' for freeform."""
    m = msg.lower()
    if any(w in m for w in [
        'visit', 'who to meet', 'who should i', 'whom to', 'meet today',
        'visit today', 'priority', 'who do i meet', 'which grower',
        'which retailer', 'plan my day', 'plan for today', 'who to visit',
        'my route', 'todays plan', "today's plan",
    ]):
        return 'visits'
    if any(w in m for w in [
        'weather', 'rain', 'humidity', 'temperature', 'forecast',
        'condition today', 'climate', 'spray window', 'rain today',
    ]):
        return 'weather'
    if any(w in m for w in [
        'stock', 'inventory', 'stockout', 'out of stock', 'shortage',
        'supply', 'check stock', 'how much stock', 'low stock',
    ]):
        return 'inventory'
    if any(w in m for w in [
        'pitch', 'what to sell', 'what to recommend', 'top product',
        'best product', 'which product', 'what product', 'recommend product',
    ]):
        return 'pitch'
    return 'llm'


def _pick_product(crop: str, humidity: float) -> tuple[str, int]:
    """Return best product + price for crop + weather combo."""
    c = crop.lower()
    if 'potato' in c:
        return 'Kavach 75 WP', 560
    if 'wheat' in c and humidity > 70:
        return 'Tilt 250 EC', 850
    if 'mustard' in c:
        return 'Score 250 EC', 920
    if 'chickpea' in c or 'chick pea' in c:
        return 'Actara 25 WG', 1200
    if 'tomato' in c or 'onion' in c:
        return 'Kavach 75 WP', 560
    return 'Tilt 250 EC', 850


def build_visits_response(rep_id: str) -> str:
    rep = loader.get_rep(rep_id)
    growers = loader.get_growers_for_rep(rep_id, limit=4)
    retailers = loader.get_retailers_for_rep(rep_id, limit=5)

    district = (rep.get('district', '') if rep else '') or 'Pune'
    weather = get_weather(district)
    current = weather.get('current', {})
    humidity = current.get('humidity_pct', 0)
    rainfall = current.get('rainfall_7d_mm', 0)

    bullets: list[str] = []

    # Grower visits — crop stage + smart product pitch
    for g in growers[:2]:
        cal = g.get('grower_crop_calendar', {})
        crop = cal.get('crop', 'crop').capitalize()
        stages = cal.get('stages', [])
        stage = stages[-1]['stage'].capitalize() if stages else 'growing'
        tehsil = g.get('tehsil', '—')
        product, price = _pick_product(crop, humidity)
        bullets.append(
            f"Meet {g['grower_id']} in {tehsil} — {crop} at {stage} stage, "
            f"pitch {product} (₹{price}/unit)"
        )

    # Retailer visits — stockout or low stock alert
    for r in retailers[:3]:
        inv = loader.get_inventory_for_retailer(r['retailer_id'])
        stockouts = [i['sku_name'] for i in inv if i['sku_qty'] == 0]
        low = [(i['sku_name'], i['sku_qty']) for i in inv if 0 < i['sku_qty'] <= 5]
        tehsil = r.get('tehsil', '—')
        rid = r['retailer_id']
        if stockouts:
            bullets.append(
                f"Visit {rid} in {tehsil} — stockout: {stockouts[0]}, farmers waiting"
            )
        elif low:
            name, qty = low[0]
            bullets.append(
                f"Visit {rid} in {tehsil} — only {qty} units of {name} left, restock now"
            )

    # Weather risk context
    risk = 'HIGH' if humidity > 70 and rainfall > 30 else 'MODERATE' if humidity > 55 else 'LOW'
    bullets.append(
        f"Disease risk {risk} — {humidity}% humidity, {rainfall}mm rain this week"
    )

    return "## Visit These Growers Today\n" + "\n".join(f"- {b}" for b in bullets[:6])


def build_weather_response(rep_id: str) -> str:
    rep = loader.get_rep(rep_id)
    district = (rep.get('district', '') if rep else '') or 'Pune'
    weather = get_weather(district)
    current = weather.get('current', {})

    temp = current.get('temp_c', '—')
    humidity = current.get('humidity_pct', 0)
    rainfall = current.get('rainfall_7d_mm', 0)
    risk_flags = current.get('risk_flags', []) or []

    risk = 'HIGH' if humidity > 70 and rainfall > 30 else 'MODERATE' if humidity > 55 else 'LOW'
    threshold_status = 'EXCEEDS' if rainfall >= 40 else 'below'

    bullets: list[str] = [
        f"Temperature {temp}°C, Humidity {humidity}% — fungal disease risk is {risk}",
        f"{rainfall}mm rainfall last 7 days — {threshold_status} 40mm blight threshold",
    ]

    for flag in risk_flags[:2]:
        bullets.append(str(flag))

    if humidity > 70:
        bullets.append(
            "Wheat at flowering stage — apply Tilt 250 EC now, spray before 9am"
        )
    if rainfall > 30:
        bullets.append(
            "Potato fields at Late Blight risk — preventive Kavach 75 WP spray recommended"
        )

    bullets.append(
        f"Best visit window: early morning in {district}, avoid afternoon heat"
    )

    return "## Today's Field Conditions\n" + "\n".join(f"- {b}" for b in bullets[:6])


def build_inventory_response(rep_id: str) -> str:
    retailers = loader.get_retailers_for_rep(rep_id, limit=8)

    bullets: list[str] = []
    for r in retailers[:6]:
        inv = loader.get_inventory_for_retailer(r['retailer_id'])
        stockouts = [i['sku_name'] for i in inv if i['sku_qty'] == 0]
        low = [(i['sku_name'], i['sku_qty']) for i in inv if 0 < i['sku_qty'] <= 5]
        tehsil = r.get('tehsil', '—')
        rid = r['retailer_id']

        if stockouts:
            bullets.append(
                f"{rid} in {tehsil} — STOCKOUT: {', '.join(stockouts[:2])}"
            )
        elif low:
            items = ', '.join(f"{n} ({q} left)" for n, q in low[:2])
            bullets.append(f"{rid} in {tehsil} — LOW STOCK: {items}")

    if not bullets:
        bullets.append("All retailers have adequate stock levels this week")

    return "## Stock Status — Territory\n" + "\n".join(f"- {b}" for b in bullets[:6])


def build_pitch_response(rep_id: str) -> str:
    rep = loader.get_rep(rep_id)
    growers = loader.get_growers_for_rep(rep_id, limit=5)
    district = (rep.get('district', '') if rep else '') or 'Pune'
    weather = get_weather(district)
    humidity = weather.get('current', {}).get('humidity_pct', 0)

    bullets: list[str] = []
    for g in growers[:5]:
        cal = g.get('grower_crop_calendar', {})
        crop = cal.get('crop', 'crop').capitalize()
        stages = cal.get('stages', [])
        stage = stages[-1]['stage'].capitalize() if stages else 'growing'
        tehsil = g.get('tehsil', '—')
        product, price = _pick_product(crop, humidity)
        bullets.append(
            f"{g['grower_id']} in {tehsil} — {crop} at {stage}, "
            f"pitch {product} (₹{price}/unit)"
        )

    return "## Top Pitches for Today\n" + "\n".join(f"- {b}" for b in bullets[:6])


def build_structured_response(intent: str, rep_id: str) -> str:
    if intent == 'visits':
        return build_visits_response(rep_id)
    if intent == 'weather':
        return build_weather_response(rep_id)
    if intent == 'inventory':
        return build_inventory_response(rep_id)
    if intent == 'pitch':
        return build_pitch_response(rep_id)
    return ''
