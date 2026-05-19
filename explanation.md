# AgroPilot Backend — Team Reference Document

**Project**: AgroPilot — AI-Guided Field Force Intelligence
**Hackathon**: Syngenta × IITM Hackathon 2026
**Document version**: 20 May 2026
**Status**: Prototype — All features live, tested, and pushed to GitHub

---

## Table of Contents

1. [What This Backend Does](#1-what-this-backend-does)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [How to Run](#4-how-to-run)
5. [Authentication](#5-authentication)
6. [API Endpoints — Complete Reference](#6-api-endpoints--complete-reference)
7. [Data Layer](#7-data-layer)
8. [AI Layer — RAG + GraphRAG](#8-ai-layer--rag--graphrag)
9. [Services Reference](#9-services-reference)
10. [Feature Checklist](#10-feature-checklist)
11. [Known Limitations and Next Steps](#11-known-limitations-and-next-steps)

---

## 1. What This Backend Does

AgroPilot backend is a **FastAPI Python server** that powers two interfaces:

- **Field Rep mobile app** — gives AI-guided visit recommendations to reps in the field
- **Manager web console** — gives territory managers KPI dashboards and alert feeds

The backend does five things:

1. **Loads real CSV data** into memory at startup (8 datasets, ~55k+ rows total)
2. **Serves structured data** about reps, retailers, growers, inventory, and campaigns via REST endpoints
3. **Runs AI inference** using Groq (Llama-3.3-70b) for chat, briefings, and recommendations
4. **Runs vector RAG** using sentence-transformers to retrieve relevant agronomic knowledge for LLM context
5. **Runs CSV-based GraphRAG** — multi-hop graph traversal across the CSV datasets to answer complex relational questions (which retailers are OOS in a rep's territory AND have nearby farmers who clicked WhatsApp campaigns?)

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Web framework | FastAPI (Python 3.14) | Auto docs, async support, Pydantic validation |
| AI / LLM | Groq API — `llama-3.3-70b-versatile` | Fast inference, free tier, OpenAI-compatible |
| Vision AI | Groq — `meta-llama/llama-4-scout-17b-16e-instruct` | Multimodal crop image diagnosis |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` | Local, free, no API call needed |
| Vector store | NumPy in-memory cosine similarity | Zero infra, works offline, ~1000 docs |
| Graph traversal | Pandas multi-hop joins (CSV GraphRAG) | Simulates Neo4j without requiring DB setup |
| Graph DB (optional) | Neo4j AuraDB | Full production GraphRAG — add URI to `.env` to activate |
| Weather | Open-Meteo + OpenWeatherMap (fallback) | Real tehsil-level weather, 6h cache |
| Auth | JWT (`python-jose`) | Stateless, 60-minute tokens |
| Data | Pandas DataFrames loaded from CSV | All 8 hackathon datasets |
| CORS | FastAPI middleware | Allows frontend on any origin |

---

## 3. Project Structure

```
backend/
├── main.py                    # App entry point — registers all routers, starts RAG init
├── config.py                  # Settings from .env (Pydantic BaseSettings)
├── .env                       # Secrets — never commit this
│
├── routers/                   # One file per feature domain
│   ├── auth.py                # POST /auth/login → JWT
│   ├── briefing.py            # GET /api/briefing → LLM morning briefing
│   ├── chat.py                # POST /api/chat → streaming LLM chat (RAG + GraphRAG)
│   ├── alerts.py              # GET /api/alerts → stockouts, disease risk, opportunities
│   ├── farmers.py             # GET /api/farmers, /api/farmers/{id}
│   ├── retailers.py           # GET /api/retailers, /api/retailers/{id}
│   ├── copilot.py             # GET /api/copilot/{retailer_id} → pre-visit AI card
│   ├── graph.py               # GET /api/graph/{rep_id} → 7-node reasoning graph
│   ├── route_planning.py      # GET /api/route → optimized visit sequence
│   ├── visits.py              # POST /api/visits → log visit outcome
│   ├── scan.py                # POST /api/scan → vision AI crop diagnosis
│   ├── calculator.py          # POST /api/calculator/roi → yield loss ROI
│   ├── manager.py             # GET /api/manager/* → KPI, reps, territory, campaigns
│   └── sync.py                # GET /api/sync → offline sync status
│
├── services/                  # Business logic — no routing here
│   ├── claude.py              # Groq API wrapper (chat, stream, vision)
│   ├── context.py             # Products catalog + system prompts + territory context builder
│   ├── rag.py                 # Vector RAG — builds and queries in-memory embedding store
│   ├── csv_graphrag.py        # NEW — pandas multi-hop graph traversal (GraphRAG fallback)
│   ├── graphrag_queries.py    # GraphRAG query library — uses Neo4j when available, csv_graphrag when not
│   ├── neo4j_client.py        # Neo4j driver — lazy init, graceful fallback to None
│   └── weather.py             # Open-Meteo real weather, 6h cache, mock fallback
│
├── data/
│   ├── loader.py              # Loads all 8 CSVs, provides accessor functions
│   ├── external_loader.py     # Loads Crop Recommendation + India Agriculture CSVs
│   ├── graph_builder.py       # One-shot script to build Neo4j graph from CSVs
│   └── external/
│       ├── Crop_recommendation.csv
│       └── India_Agriculture_Crop_Production.csv
```

---

## 4. How to Run

### Prerequisites
Python 3.14 with venv already set up at `backend/venv/`.

### Start the server
```powershell
# Backend (repo backend — use this one)
cd "D:\sygenta files\agropilot-frontend\backend"
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd "D:\sygenta files\agropilot-frontend\web"
npm run dev -- --host
```

Open: `http://localhost:5173`

**What happens at startup:**
1. All 8 CSVs load into memory (~2 seconds)
2. Server begins accepting requests immediately
3. RAG index builds in a background thread (~30 seconds, sentence-transformers model loads)
4. Chat endpoints answer from CSV context only until RAG is ready, then switch to full semantic retrieval

### API docs (auto-generated)
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Environment variables (`.env`)

| Variable | Current value | Notes |
|---|---|---|
| `GROQ_API_KEY` | Set | Llama-3.3-70b + Llama-4-Scout |
| `JWT_SECRET` | Set (dev value) | Change to 64-char random string for production |
| `CHAT_MODEL` | `llama-3.3-70b-versatile` | Text generation |
| `VISION_MODEL` | `meta-llama/llama-4-scout-17b-16e-instruct` | Crop image diagnosis |
| `CSV_DIR` | `../data/` | Relative to repo backend, points to agropilot-frontend/data/ |
| `PORT` | `8000` | |
| `NEO4J_URI` | **Empty** | Add AuraDB URI to activate full Neo4j GraphRAG |
| `NEO4J_USER` | `neo4j` | |
| `NEO4J_PASS` | **Empty** | |
| `FRONTEND_URL` | `http://localhost:5173` | |

> Note: `OPENWEATHER_API_KEY` removed — Open-Meteo is primary weather source (free, no key required). Mock fallback activates automatically on any failure.

---

## 5. Authentication

The backend uses **JWT Bearer tokens**. All protected endpoints check for `Authorization: Bearer <token>` in the request header. The login endpoint itself requires no token.

### Demo credentials (hackathon only)

| Username | Password | Role | Mapped to |
|---|---|---|---|
| `arjun` | `agropilot2026` | `rep` | `REP_0001` (Arjun Mehta) |
| `manager` | `agropilot2026` | `manager` | No rep_id (territory manager) |

### Login request
```http
POST /auth/login
Content-Type: application/json

{"username": "arjun", "password": "agropilot2026"}
```

### Login response
```json
{
  "token": "eyJ...",
  "role": "rep",
  "rep_id": "REP_0001",
  "name": "Arjun Mehta"
}
```

Token expiry: 60 minutes. Token payload contains `sub` (username), `role`, and `rep_id`.

---

## 6. API Endpoints — Complete Reference

All endpoints return JSON. All `rep_id` parameters default to `REP_0001` if not provided.

### Health

| Method | Path | Description | Sample response |
|---|---|---|---|
| GET | `/` | Health check | `{"status":"ok","app":"AgroPilot","version":"1.0.0"}` |

---

### Auth

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/login` | `{username, password}` | `{token, role, rep_id, name}` |

---

### Briefing — Morning Command Center

| Method | Path | Query params | Returns |
|---|---|---|---|
| GET | `/api/briefing` | `rep_id` | AI-generated morning briefing |

The briefing is generated by Llama-3.3-70b using the rep's territory context (visit history, inventory, growers, campaigns). The response is a structured JSON object with keys like `ai_field_score`, `priority_visits`, `crop_windows`, `summary`.

**How it works internally:**
1. `build_rep_context(rep_id)` assembles territory data from CSV loader
2. This context (+ system prompt) is sent to Groq
3. LLM returns structured JSON briefing
4. Backend attempts to parse JSON, falls back to raw text on failure

---

### Chat — AI Chatbot (RAG + GraphRAG)

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/chat/stream` | `{messages, rep_id}` | Server-Sent Events stream |
| POST | `/api/chat` | `{messages, rep_id}` | `{response: string}` |

The `/stream` endpoint is what the frontend uses. It returns `text/event-stream` with `data: <chunk>\n\n` lines, ending with `data: [DONE]\n\n`.

**System prompt assembly (in `routers/chat.py`):**

```
SYSTEM_PROMPT_CHAT          ← base instructions (from services/context.py)
  + territory_context       ← rep's real CSV data summary
  + RAG chunks              ← top-6 semantically similar knowledge chunks
  + graph_context           ← GraphRAG multi-hop traversal result (if available)
```

This is the most important endpoint. The LLM sees real data from all three sources simultaneously.

---

### Alerts — Anomaly and Opportunity Feed

| Method | Path | Query params | Returns |
|---|---|---|---|
| GET | `/api/alerts` | `rep_id`, `severity` (optional) | `{total, alerts[]}` |
| GET | `/api/alerts/{alert_id}` | — | Single alert object |

**Alert types in the response:**

| type | What triggers it |
|---|---|
| `disease_risk` | Static: high humidity + rainfall → blight risk |
| `stockout` | Live: `sku_qty = 0` in inventory CSV (3 real ones appended) |
| `opportunity` | Static: aphid season, campaign warmth |
| `visit_overdue` | Static: retailers not visited in 14+ days |
| `weather` | Static: rain forecast → pre-emptive fungicide window |

Each alert has: `id`, `type`, `severity`, `title`, `description`, `product`, `action`, `created_at`.

---

### Farmers

| Method | Path | Query params | Returns |
|---|---|---|---|
| GET | `/api/farmers` | `rep_id`, `limit` (default 20) | `{farmers[], total}` |
| GET | `/api/farmers/{grower_id}` | — | Enriched farmer record |

Farmer object includes: `id`, `tehsil`, `district`, `state`, `age`, `gender`, `farm_size_acres`, `language`, `device_type`, `crop`, `current_stage`, `crop_calendar`, `product_interest`, `campaign_attended`.

---

### Retailers

| Method | Path | Query params | Returns |
|---|---|---|---|
| GET | `/api/retailers` | `rep_id`, `limit` (default 20) | `{retailers[], total}` |
| GET | `/api/retailers/{retailer_id}` | — | Retailer with inventory |

---

### Visit Copilot — Pre-Visit AI Card

| Method | Path | Query params | Returns |
|---|---|---|---|
| GET | `/api/copilot/{retailer_id}` | `rep_id` | Full pre-visit intelligence |

This is the most data-rich endpoint. It returns:

```json
{
  "retailer": { "retailer_id", "tehsil", "district", "state" },
  "last_visit": { "date", "days_ago", "product_recommended", "visit_type" },
  "ai_recommendation": { "product", "sku_id", "reason", "urgency", "dose", "price" },
  "stock_status": [{ "sku_id", "sku_name", "qty", "status" }],
  "nearby_growers": [{ "grower_id", "farm_size_acres", "crop", "current_stage" }],
  "whatsapp_signals": { "clicked_count", "total_sent", "click_rate_pct", "top_product_clicked" },
  "talking_points": ["string", ...],
  "weather": { "temp_c", "humidity_pct", "rainfall_7d_mm" },
  "weather_risk_flags": ["string"]
}
```

**Recommendation logic** (in order of priority):
1. If any SKU is out-of-stock → pitch reorder of that SKU
2. If dominant nearby crop is potato → Kavach 75 WP (late blight)
3. If wheat + humidity > 65% → Tilt 250 EC (blight)
4. If mustard → Score 250 EC (alternaria)
5. If chickpea → Actara 25 WG (pod borer)

---

### Reasoning Graph — AI Explainability

| Method | Path | Returns |
|---|---|---|
| GET | `/api/graph/{rep_id}` | 7-node reasoning graph JSON |

Returns a visualization-ready graph explaining the top product recommendation for the rep's territory. All data is pulled from real CSVs and live weather — nothing hardcoded.

**Response structure:**
```json
{
  "rep_id": "REP_0001",
  "recommendation": { "product", "product_sku", "confidence" },
  "signal_count": 7,
  "nodes": [
    {
      "id": "farmer",
      "label": "Grower 00001",
      "type": "Person",
      "angle": -90,
      "weight": 18,
      "icon_type": "user",
      "facts": [["Tehsil", "Baramati"], ["Last visit", "7 days ago"], ["Farm size", "2.5 acres"]],
      "source": "Farmer profile · CRM"
    },
    ... (6 more nodes: variety, rain, humid, history, stock, campaign)
  ],
  "steps": [
    { "n": 1, "text": "Identified wheat at flowering stage...", "src": "Farmer profile" },
    ... (5 steps total)
  ]
}
```

The frontend's `ReasoningGraph.tsx` renders this as an SVG canvas with animated pulses traveling along edges. The `angle` field positions each node on a circle around the center recommendation node.

---

### Route Planning

| Method | Path | Query params | Returns |
|---|---|---|---|
| GET | `/api/route` | `rep_id`, `date` | `{stops[], total_km, estimated_hours, date}` |

Returns up to 6 stops ordered by visit priority (days-since-last-visit → priority: high > 14 days, medium > 7 days, low ≤ 7 days).

---

### Visit Logging

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/visits` | See below | `{visit_id, status, message}` |
| GET | `/api/visits/{rep_id}` | — | `{visits[], total}` |

**POST body:**
```json
{
  "rep_id": "REP_0001",
  "retailer_id": "RTL_00001",
  "outcome": "sale_made",
  "products_discussed": ["Tilt 250 EC"],
  "competitor_products": [],
  "notes": "Owner agreed to stock 20 units",
  "visit_date": "2026-05-19T14:30:00"
}
```

Valid outcomes: `sale_made`, `order_placed`, `no_purchase`, `followup_required`.

Logged visits are appended to the in-memory visits DataFrame. They are visible to all subsequent read calls within the same server process.

---

### Crop Scanner — Vision AI

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/scan` | `multipart/form-data`: `image` (file), `crop_hint`, `rep_id` | `{scan_result, rep_id}` |
| POST | `/api/scan/demo` | `{"symptom": string, "crop": string}` | `{scan_result}` |

The `/scan` endpoint takes a real image upload and sends it to Llama-4-Scout (vision model) via Groq. The `/scan/demo` endpoint simulates a scan using text description — useful for frontend demos without a camera.

**Scan result structure:**
```json
{
  "scan_result": {
    "disease": "Powdery mildew",
    "severity": "Moderate",
    "confidence": 0.87,
    "recommended_product": "Tilt 250 EC",
    "dose": "200ml per acre",
    "application_timing": "Apply within 48h before rain",
    "yield_loss_risk": "15-25% without treatment"
  }
}
```

---

### Yield Loss / ROI Calculator

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/calculator/roi` | See below | Full ROI breakdown |

**Request:**
```json
{
  "crop": "wheat",
  "farm_size_acres": 2.5,
  "disease_severity": "moderate",
  "product_sku": "SY_TILT_250EC",
  "num_applications": 1
}
```

**Response:**
```json
{
  "crop": "wheat",
  "farm_size_acres": 2.5,
  "gross_value_inr": 102375,
  "yield_loss_without_treatment_inr": 25594,
  "treatment_cost_inr": 2125,
  "protection_gain_inr": 21755,
  "net_roi_inr": 19630,
  "roi_ratio": 10.2,
  "recommendation": "For every ₹1 spent on treatment, farmer saves ₹10.2",
  "breakeven_acres": 0.39
}
```

**Crop baseline data (MSP-anchored):**

| Crop | Yield (qtl/acre) | Price (₹/qtl) |
|---|---|---|
| Wheat | 18 | 2,275 |
| Mustard | 8 | 5,650 |
| Chickpea | 6 | 5,440 |
| Potato | 120 | 800 |
| Rice | 22 | 2,183 |

---

### Manager Console

| Method | Path | Returns |
|---|---|---|
| GET | `/api/manager/kpi` | Revenue, visits, AI accept rate, coverage % |
| GET | `/api/manager/reps` | Top 10 rep scorecards |
| GET | `/api/manager/territory` | Territory heatmap with coverage and alerts |
| GET | `/api/manager/campaigns` | Campaign funnel (impressions → leads) per campaign |

---

### Sync Center

| Method | Path | Returns |
|---|---|---|
| GET | `/api/sync` | Sync status, pending items, last sync timestamp |

---

## 7. Data Layer

### `data/loader.py` — The Data Hub

At startup (`main.py` lifespan), `loader.load_all()` reads all 8 CSVs into memory as pandas DataFrames. All routers call `loader.get(name)` to access them.

### Datasets loaded

| Dataset | Rows | Key columns | Used for |
|---|---|---|---|
| `reps_territory.csv` | 500 | `rep_id`, `territory_id`, `territory_name`, `state`, `district`, `tehsil_list` | Territory assignment, routing origin |
| `retailers.csv` | 4,000 | `retailer_id`, `territory_id`, `state`, `district`, `tehsil` | Geographic anchor for all retail data |
| `retailer_visit_log.csv` | 30,000 | `rep_id`, `visit_date`, `visit_tehsil`, `visit_type`, `product_recommended` | Visit gap scoring, last-pitch tracking |
| `retailer_inventory_weekly.csv` | 310,544 (→ 11,944 latest) | `retailer_id`, `sku_id`, `sku_name`, `sku_qty`, `week_end_date` | Stockout detection, inventory scoring |
| `retailer_pos.csv` | 235,042 (→ 10,000 loaded) | `retailer_id`, `sku_id`, `sku_name`, `sku_qty`, `sku_price`, `transaction_date` | Demand signals, sales velocity |
| `growers.csv` | 6,000 (→ 1,000 loaded) | `grower_id`, `tehsil`, `district`, `grower_crop_calendar` (JSON), `product_name`, `offline_campaign_attended` | Crop stage urgency, farmer demand intent |
| `digital_funnel_weekly.csv` | 104 | `campaign_id`, `campaign_crop`, `campaign_product`, `impressions`, `landing_page_visits`, `lead_form_submissions` | Campaign heat signal for reps |
| `whatsapp_message_log.csv` | 4,479 | `grower_id`, `clicked_status`, `opened_status`, `campaign_product`, `message_sent_date` | Warm farmer identification |

**Note on inventory**: The raw file has 310k rows. Loader takes only the **latest snapshot per retailer-SKU pair** (last `week_end_date`), reducing it to 11,944 rows for fast in-memory queries.

### Accessor functions in `loader.py`

```python
loader.get('reps')                              # → DataFrame
loader.get('retailers')                          # → DataFrame
loader.get_rep(rep_id)                          # → dict | None
loader.get_retailers_for_rep(rep_id, limit=20)  # → list[dict]
loader.get_growers_for_rep(rep_id, limit=15)    # → list[dict]
loader.get_visit_history_for_rep(rep_id, limit) # → list[dict]
loader.get_inventory_for_retailer(retailer_id)  # → list[dict]
loader.get_stockout_alerts()                    # → list[dict] (sku_qty == 0)
loader.get_funnel_summary()                     # → list[dict]
```

### `grower_crop_calendar` JSON structure

The `growers.csv` has a JSON column `grower_crop_calendar`. Example:
```json
{
  "crop": "wheat",
  "season": "Rabi_2025-26",
  "sowing": {"start": "2025-10-15", "end": "2025-11-01"},
  "stages": [
    {"stage": "germination", "date": "2025-10-22"},
    {"stage": "tillering", "date": "2025-11-20"},
    {"stage": "flowering", "date": "2026-02-10"}
  ]
}
```

The loader parses this JSON during load. Access `cal.get('crop')` and `cal.get('stages', [])[-1].get('stage')` for current stage.

---

## 8. AI Layer — RAG + GraphRAG

This is the core intelligence layer. There are three sources of context injected into every LLM call:

```
LLM System Prompt
    ├── Base system prompt (role, rules)
    ├── Territory context (built from CSV data for this rep)
    ├── Vector RAG chunks (top-6 semantically similar knowledge docs)
    └── Graph context (multi-hop traversal result)
```

### 8.1 Vector RAG (`services/rag.py`)

**What it does**: Semantic retrieval over a knowledge corpus. Given the user's question, it finds the most relevant knowledge chunks and injects them as context before the LLM answers.

**How it's built**: `init_rag()` runs at startup in a background thread. It builds documents from:

| Source | Doc count | Content |
|---|---|---|
| Products catalog | 6 | Name, category, crops, diseases, dose, timing, price |
| Disease seasonality | 18 | Crop-specific disease risk windows, spray timing |
| Crop requirements | 8 | NPK, pH, temp, irrigation critical windows |
| PlantVillage diseases | 14 | Disease descriptions and visual symptoms |
| Mandi prices + ROI | 8 | Crop prices, ROI formulas, break-even examples |
| External datasets | 122 | Crop recommendation + India agriculture production |
| Grower records | 300 | Grower × crop × stage summaries from CSV |
| Retailer stock | 300 | Retailer × SKU × quantity summaries |
| Visit history | 1,000 | Rep visit events and products recommended |
| WhatsApp signals | 300 | Grower engagement signals per campaign |
| POS transactions | 500 | Sales events, volume, and demand spikes |

Each document is embedded using `all-MiniLM-L6-v2` and stored as a numpy matrix. Cosine similarity query runs on every chat request.

**Query**:
```python
from services.rag import query_rag
chunks = query_rag("wheat blight spray timing", n=6)
# Returns: "[1] Wheat Septoria blight risk: high at flowering stage BBCH 60-70..."
```

### 8.2 CSV GraphRAG (`services/csv_graphrag.py`) — NEW

**What it does**: Simulates Neo4j Cypher multi-hop traversal using pandas joins. This is what makes the chat endpoint "graph-aware" without requiring a database.

**Graph model (simulated)**:
```
Rep → Territory → Retailer → Inventory (SKU/qty)
                          → Tehsil → Growers → WhatsApp messages
```

**Available functions**:

```python
get_priority_retailers_csv(rep_id, limit=10)
```
- Finds rep's territory_id
- Gets all retailers in that territory
- Counts OOS SKUs per retailer (sku_qty == 0)
- Counts warm farmers per retailer's tehsil (growers who clicked WhatsApp)
- Scores: `oos_count × 3 + warm_farmers × 2`
- Returns top-N sorted by score

```python
get_oos_clusters_csv(rep_id)
```
- Finds all rep's retailers
- Groups by tehsil + SKU
- Returns tehsils where 2+ retailers have zero stock of the same SKU

```python
get_warm_farmers_csv(tehsil, days=14)
```
- Gets growers in that tehsil
- Cross-joins with WhatsApp messages clicked within `days` days
- Returns list of interested growers with crop/stage/product

```python
get_graph_context_csv(rep_id)
```
- Calls the above two
- Formats result as a human-readable text block
- Injected into LLM system prompt

**Sample output injected into chat**:
```
=== GRAPH INTELLIGENCE (CSV multi-hop — 2 hops) ===

TOP PRIORITY RETAILERS (OOS + warm farmers):
  RTL_00002 (Patna_T001) — 1 OOS SKUs | 0 warm farmers | last visit: 2026-01-12 | score: 3
  RTL_00008 (Patna_T003) — 0 OOS SKUs | 0 warm farmers | last visit: 2025-12-04 | score: 1

STOCKOUT CLUSTERS (2+ retailers, same SKU, same tehsil):
  Cruiser 350 FS — 2 retailers OOS in Jalgaon_T038
```

### 8.3 Neo4j GraphRAG (`services/graphrag_queries.py`) — Optional

The same queries as CSV GraphRAG but executed as Cypher against Neo4j AuraDB. Automatically activated when `NEO4J_URI` is set in `.env`.

**To activate**:
1. Sign up at `https://console.neo4j.io` (free AuraDB)
2. Add URI and password to `.env`
3. Run the graph builder once: `.\venv\Scripts\python.exe -m data.graph_builder`
4. Restart the server — Neo4j GraphRAG will be used in preference to CSV

The query functions in `graphrag_queries.py` silently fall back to `csv_graphrag` equivalents when `neo4j_client.is_available()` returns False — no code change required.

---

## 9. Services Reference

### `services/claude.py` — Groq API Wrapper

```python
chat(system, messages, max_tokens=1024) → str
chat_stream(system, messages, max_tokens=2048) → Generator[str]
vision_chat(system, image_b64, prompt, media_type) → str
```

Uses `CHAT_MODEL` (Llama-3.3-70b) for text and `VISION_MODEL` (Llama-4-Scout) for vision. Temperature is fixed at 0.4 for text and 0.2 for vision (more deterministic diagnoses). Chat stream uses `max_tokens=2048` so structured responses (heading + 5 bullets + ROI) don't get truncated.

### `services/context.py` — Products Catalog + Prompts

Contains:
- `PRODUCTS_CATALOG` — dict of 6 Syngenta SKUs with full metadata (name, crops, diseases, dose, timing, price, margin)
- `SYSTEM_PROMPT_BRIEFING` — system prompt for morning briefing generation
- `SYSTEM_PROMPT_CHAT` — system prompt for the AI chatbot
- `SYSTEM_PROMPT_SCAN` — system prompt for crop image diagnosis
- `build_rep_context(rep_id)` — assembles territory summary from CSV data for a given rep

### `services/weather.py` — Real Weather

Uses Open-Meteo geocoding + weather API (no key required). Geocodes the rep's district by name, fetches:
- Current temp, humidity, rainfall (7d sum), wind speed
- 3-day forecast with rain probability
- Risk flags (e.g. "High humidity — elevated fungal risk")

Results cached in-memory for 6 hours. Falls back to mock data (`WEATHER_MOCK`) on any network failure.

### `services/neo4j_client.py` — Graph DB Client

Lazy initialization — driver is only created when first query runs. Returns `None` silently if `NEO4J_URI` is empty or connection fails. All graph query functions check `is_available()` first.

---

## 10. Feature Checklist

### Core Backend Features

| Feature | Status | Endpoint | Notes |
|---|---|---|---|
| JWT authentication | ✅ Done | `POST /auth/login` | 60-min tokens, 2 demo users |
| Morning briefing (LLM) | ✅ Done | `GET /api/briefing` | Real CSV context + Groq |
| AI chatbot (streaming) | ✅ Done | `POST /api/chat/stream` | SSE, RAG + GraphRAG context |
| Alerts feed | ✅ Done | `GET /api/alerts` | 5 static + 3 live stockouts |
| Farmer profiles | ✅ Done | `GET /api/farmers/{id}` | Crop calendar parsed |
| Retailer profiles | ✅ Done | `GET /api/retailers/{id}` | Inventory included |
| Visit copilot | ✅ Done | `GET /api/copilot/{id}` | AI pitch + stock + WA signals |
| Reasoning graph | ✅ Done | `GET /api/graph/{rep_id}` | 7 nodes, 5 steps, live data |
| Route planning | ✅ Done | `GET /api/route` | Priority-ordered stops |
| Visit logging | ✅ Done | `POST /api/visits` | In-memory, 4 outcomes |
| Crop scanner (real image) | ✅ Done | `POST /api/scan` | Vision AI via Groq |
| Crop scanner (demo) | ✅ Done | `POST /api/scan/demo` | Text-based demo mode |
| ROI / yield calculator | ✅ Done | `POST /api/calculator/roi` | MSP-anchored, 5 crops |
| Manager KPI dashboard | ✅ Done | `GET /api/manager/kpi` | Real visit counts |
| Rep performance tracker | ✅ Done | `GET /api/manager/reps` | 10 rep scorecards |
| Territory heatmap data | ✅ Done | `GET /api/manager/territory` | Coverage by territory |
| Campaign performance | ✅ Done | `GET /api/manager/campaigns` | 4-campaign funnel |
| Sync center | ✅ Done | `GET /api/sync` | Sync status |
| CORS enabled | ✅ Done | All endpoints | `allow_origins=["*"]` |

### AI / Intelligence Features

| Feature | Status | Implementation | Notes |
|---|---|---|---|
| Vector RAG | ✅ Done | `services/rag.py` | ~2600 docs, MiniLM-L6-v2, numpy cosine sim |
| CSV GraphRAG (no DB) | ✅ Done | `services/csv_graphrag.py` | Pandas multi-hop joins, 4 query functions |
| Neo4j GraphRAG | 🟡 Code ready | `services/graphrag_queries.py` | Add `NEO4J_URI` to activate |
| LLM chat streaming | ✅ Done | `routers/chat.py` | SSE via Groq |
| Vision AI (crop scan) | ✅ Done | `services/claude.py` | Llama-4-Scout via Groq |
| Weather integration | ✅ Done | `services/weather.py` | Open-Meteo, 6h cache |
| AI field briefing | ✅ Done | `routers/briefing.py` | Groq + territory context |
| AI copilot recommendation | ✅ Done | `routers/copilot.py` | Rule-based + RAG talking points |
| Reasoning graph builder | ✅ Done | `routers/graph.py` | All 7 nodes from real data |
| i18n multilingual | ✅ Done (frontend) | `src/i18n/` | en, hi, mr, ta, te |

### Data Features

| Feature | Status | Notes |
|---|---|---|
| All 8 CSVs loaded | ✅ Done | 55k+ total rows in memory |
| Inventory latest-only filter | ✅ Done | 310k → 11,944 rows |
| Stockout detection | ✅ Done | `sku_qty == 0` |
| Visit gap scoring | ✅ Done | Days since last tehsil visit |
| WhatsApp click signals | ✅ Done | Aggregated by tehsil |
| Crop calendar parsing | ✅ Done | JSON column → stages list |
| External crop data | ✅ Done | Crop Recommendation + India Agri CSVs |

### Frontend Screens (web/ folder)

**Rep App (12 screens):**

| Screen | File | API used | Notes |
|---|---|---|---|
| Login | `Login.tsx` | `POST /auth/login` | Username + password fields, role quick-fill |
| Morning Briefing | `MorningBriefing.tsx` | `GET /api/briefing` | |
| Route Planning | `RoutePlanning.tsx` | `GET /api/route` | |
| Visit Copilot | `VisitCopilot.tsx` | `GET /api/copilot/{id}` | |
| Log Visit | `LogVisit.tsx` | `POST /api/visits` | |
| Alerts Feed | `AlertsFeed.tsx` | `GET /api/alerts` | |
| Crop Scanner | `CropScanner.tsx` | `POST /api/scan` | Camera capture + gallery upload button; routes to chat with scan result |
| AI Consultant (chat) | `AIConsultant.tsx` | `POST /api/chat/stream` | Structured card format (heading + bullets + confidence + ROI); auto-sends crop scan question on navigation |
| Reasoning Graph | `ReasoningGraph.tsx` | `GET /api/graph/{rep_id}` | |
| Yield Calculator | `YieldCalculator.tsx` | `POST /api/calculator/roi` | |
| Farmer Profile | `FarmerProfile.tsx` | `GET /api/farmers/{id}` | |
| Retailer Profile | `RetailerProfile.tsx` | `GET /api/retailers/{id}` | |
| Sync Center | `SyncCenter.tsx` | `GET /api/sync` | |

**Manager Console (5 screens):**

| Screen | File | API used |
|---|---|---|
| Territory Heatmap | `manager/TerritoryHeatmap.tsx` | `GET /api/manager/territory` |
| KPI Dashboard | `manager/KPIDashboard.tsx` | `GET /api/manager/kpi` |
| Rep Performance | `manager/RepPerformance.tsx` | `GET /api/manager/reps` |
| Alert Management | `manager/AlertManagement.tsx` | `GET /api/alerts` |
| Campaign Performance | `manager/CampaignPerformance.tsx` | `GET /api/manager/campaigns` |

---

## 11. Known Limitations and Next Steps

### Current Limitations

| Item | Detail | Impact |
|---|---|---|
| Neo4j not connected | `NEO4J_URI` is empty → CSV GraphRAG fallback active | GraphRAG works, just slower (pandas joins vs graph traversal) |
| Visit log is in-memory only | Logged visits reset on server restart | Acceptable for hackathon demo |
| Auth is demo-only | Two hardcoded users, no registration, no password hashing | Replace with Supabase auth for production |
| Growers CSV is 1k sample | Full dataset has 6k growers | Warm farmer signals sparse on sample data |
| WhatsApp data is historical | Latest message is 2026-04-05, ~44 days before today | WA click scoring uses adaptive date anchor |
| Scan uploads not persisted | Image files not saved to disk | Add object storage (S3/Supabase) for production |
| No rate limiting | Anyone can hit Groq API via `/api/chat` | Add FastAPI rate-limit middleware before deploy |

### Enabling Full Neo4j GraphRAG (5 steps)

```
1. Go to https://console.neo4j.io → New Instance → AuraDB Free
2. Download the credentials .txt file
3. Add to backend/.env:
      NEO4J_URI=neo4j+s://abc123.databases.neo4j.io
      NEO4J_PASS=your-password-here
4. Run graph builder (one time):
      .\venv\Scripts\python.exe -m data.graph_builder
5. Restart the server — Neo4j GraphRAG activates automatically
```

### Frontend Bug Fixes Applied (20 May 2026)

| Fix | What changed |
|---|---|
| Login page | Added username + password input fields, show/hide toggle, Enter key submit, role quick-fill cards |
| CORS | Removed `allow_credentials=True` from CORSMiddleware — was breaking browser SSE/fetch with wildcard origin |
| Chat structured format | System prompt now includes a concrete full example; parser accepts any heading level + numbered lists; shows card if heading OR 2+ bullets found |
| Chat token limit | `max_tokens` for stream increased 1024 → 2048 to avoid truncation mid-structure |
| Chat headline bug | `AIMessageCard` was showing hardcoded demo string instead of actual LLM title — fixed |
| Crop scanner upload | Added gallery upload button alongside camera capture; separate file input without `capture` attr for iOS/Android gallery access |
| Scanner → Chat routing | "Ask AgroPilot" now passes scan result as React Router `state.prefill`; chat auto-sends the question on mount |
| Viewport / responsive | Layout locked to `100dvh` (no URL-bar jump); `overflow: hidden` on root; scroll happens inside `.rep-content` only; no more content overflowing viewport |

### Remaining Items Before Production

- [ ] Connect Neo4j AuraDB for true multi-hop graph queries
- [ ] Add `farm_id` to visit log so individual farmer visits are trackable
- [ ] Add competitor activity logging endpoint (`POST /api/visits/{id}/competitors`)
- [ ] Add offline sync queue status to the sync endpoint
- [ ] Replace `revenue_lakh` estimates in manager endpoints with real POS aggregation
- [ ] Add rate limiting on `/api/chat` to protect Groq API quota

---

*Document prepared by the AgroPilot team — Syngenta × IITM Hackathon 2026.*
*For questions: check the `/docs` endpoint for live Swagger docs, or read the router files directly — each is well-commented.*
