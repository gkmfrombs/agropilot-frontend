"""
Real weather data via Open-Meteo (free, no API key required).
Geocodes district names via Open-Meteo's geocoding API, then fetches
current conditions + 3-day forecast. Results cached 6 hours in memory.
Falls back to WEATHER_MOCK on any failure.
"""
import time
import httpx

# --- In-memory cache: { district_key -> (timestamp, data) } ---
_cache: dict[str, tuple[float, dict]] = {}
_geo_cache: dict[str, tuple[float, float] | None] = {}
CACHE_TTL_SECONDS = 6 * 60 * 60  # 6 hours

WEATHER_MOCK = {
    'current': {
        'temp_c': 24,
        'humidity_pct': 82,
        'rainfall_7d_mm': 48,
        'condition': 'Partly cloudy with high humidity',
        'wind_kmh': 12,
    },
    'forecast': [
        {'day': 'Tomorrow', 'rain_prob': 65, 'temp_c': 23},
        {'day': 'Day+2', 'rain_prob': 40, 'temp_c': 25},
        {'day': 'Day+3', 'rain_prob': 20, 'temp_c': 27},
    ],
    'risk_flags': [
        'High humidity (82%) — elevated fungal disease risk for wheat',
        '48mm rainfall in past 7 days — blight-favorable conditions',
    ],
}


def _geocode(district: str) -> tuple[float, float] | None:
    key = district.lower().strip()
    if key in _geo_cache:
        return _geo_cache[key]
    try:
        with httpx.Client(timeout=8.0) as client:
            r = client.get(
                'https://geocoding-api.open-meteo.com/v1/search',
                params={'name': district, 'count': 1, 'language': 'en', 'format': 'json'},
            )
            r.raise_for_status()
            results = r.json().get('results')
            if not results:
                _geo_cache[key] = None
                return None
            lat = results[0]['latitude']
            lon = results[0]['longitude']
            _geo_cache[key] = (lat, lon)
            return lat, lon
    except Exception:
        _geo_cache[key] = None
        return None


def _build_risk_flags(current: dict, forecast: list[dict]) -> list[str]:
    flags: list[str] = []
    humidity = current.get('humidity_pct', 0)
    rainfall = current.get('rainfall_7d_mm', 0)
    temp = current.get('temp_c', 20)

    if humidity >= 80:
        flags.append(f"High humidity ({humidity}%) — elevated fungal disease risk for wheat and potato")
    elif humidity >= 65:
        flags.append(f"Moderate humidity ({humidity}%) — monitor for early blight symptoms")

    if rainfall >= 40:
        flags.append(f"{rainfall:.0f}mm rainfall in past 7 days — blight-favorable conditions")
    elif rainfall >= 20:
        flags.append(f"{rainfall:.0f}mm rainfall this week — soil moisture adequate, watch for fungal onset")

    if temp >= 35:
        flags.append(f"High temperature ({temp}°C) — heat stress risk; advise irrigation")
    elif temp <= 10:
        flags.append(f"Low temperature ({temp}°C) — frost risk for seedlings")

    near_rain = [f for f in forecast[:2] if f.get('rain_prob', 0) >= 60]
    if near_rain:
        flags.append(f"Rain likely in next {len(near_rain)} day(s) — recommend pre-emptive fungicide application")

    if not flags:
        flags.append("Weather conditions normal — no immediate crop risk flags")

    return flags


def _fetch_from_api(district: str) -> dict:
    coords = _geocode(district)
    if coords is None:
        raise ValueError(f"Could not geocode district: {district!r}")

    lat, lon = coords

    with httpx.Client(timeout=10.0) as client:
        r = client.get(
            'https://api.open-meteo.com/v1/forecast',
            params={
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation',
                'daily': 'precipitation_sum,precipitation_probability_max,temperature_2m_max',
                'timezone': 'Asia/Kolkata',
                'past_days': 7,
                'forecast_days': 4,
            },
        )
        r.raise_for_status()
        data = r.json()

    cur = data.get('current', {})
    temp_c = round(cur.get('temperature_2m', 24), 1)
    humidity_pct = int(cur.get('relative_humidity_2m', 70))
    wind_kmh = round(cur.get('wind_speed_10m', 10), 1)

    # Sum past 7 days of daily precipitation for the rainfall_7d_mm value
    daily = data.get('daily', {})
    precip_list: list[float] = daily.get('precipitation_sum', [])
    # past_days=7 gives us index 0..6 as past days, index 7 = today, 8/9/10 = forecast
    rainfall_7d_mm = round(sum(p or 0 for p in precip_list[:7]), 1)

    condition = 'Clear' if humidity_pct < 50 else ('Partly cloudy' if humidity_pct < 75 else 'Overcast / humid')

    current = {
        'temp_c': temp_c,
        'humidity_pct': humidity_pct,
        'rainfall_7d_mm': rainfall_7d_mm,
        'condition': condition,
        'wind_kmh': wind_kmh,
    }

    # Forecast: indices 8/9/10 (days +1/+2/+3 from today)
    day_labels = ['Tomorrow', 'Day+2', 'Day+3']
    precip_prob_list: list[int] = daily.get('precipitation_probability_max', [])
    temp_max_list: list[float] = daily.get('temperature_2m_max', [])
    forecast: list[dict] = []
    for i in range(3):
        idx = 8 + i  # offset after 7 past days + today
        rain_prob = int(precip_prob_list[idx]) if idx < len(precip_prob_list) else 0
        temp_max = round(temp_max_list[idx], 1) if idx < len(temp_max_list) else temp_c
        forecast.append({'day': day_labels[i], 'rain_prob': rain_prob, 'temp_c': temp_max})

    risk_flags = _build_risk_flags(current, forecast)

    return {'current': current, 'forecast': forecast, 'risk_flags': risk_flags}


def get_weather(district: str) -> dict:
    """
    Returns weather dict with keys: current, forecast, risk_flags.
    Caches 6 hours. Falls back to WEATHER_MOCK on any failure.
    """
    key = district.lower().strip()

    if key in _cache:
        ts, cached = _cache[key]
        if (time.time() - ts) < CACHE_TTL_SECONDS:
            return cached

    try:
        result = _fetch_from_api(district)
        _cache[key] = (time.time(), result)
        return result
    except Exception as exc:
        print(f"[weather] Open-Meteo failed for '{district}': {exc} — using mock data")
        return WEATHER_MOCK
