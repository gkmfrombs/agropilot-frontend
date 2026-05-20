"""
RAG engine for AgroPilot.
Uses sentence-transformers all-MiniLM-L6-v2 for local embeddings.
In-memory numpy cosine similarity store — zero infra, zero cost.

Corpus built from:
  - Syngenta product catalog (6 SKUs, detailed)
  - Crop disease seasonality knowledge
  - Mandi prices + ROI formulas
  - Grower profiles from growers.csv
  - Retailer inventory summaries from retailer_inventory_weekly.csv
  - Visit history patterns from retailer_visit_log.csv
  - External crop recommendation knowledge
  - PlantVillage disease descriptions
"""
from __future__ import annotations

import json
import numpy as np

from data import loader
from services.context import PRODUCTS_CATALOG

_model = None
_docs: list[str] = []
_embeddings: np.ndarray | None = None
_initialized = False


# ---------------------------------------------------------------------------
# Model loader (lazy — only imported when first query runs)
# ---------------------------------------------------------------------------

def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        print('[RAG] Loading sentence-transformers model (all-MiniLM-L6-v2)...')
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        print('[RAG] Model ready.')
    return _model


def _embed(texts: list[str]) -> np.ndarray:
    return _get_model().encode(texts, show_progress_bar=False, convert_to_numpy=True)


def _add_docs(docs: list[str]) -> None:
    global _docs, _embeddings
    if not docs:
        return
    _docs.extend(docs)
    new_vecs = _embed(docs)
    _embeddings = new_vecs if _embeddings is None else np.vstack([_embeddings, new_vecs])


# ---------------------------------------------------------------------------
# Document builders — each returns list[str] text chunks
# ---------------------------------------------------------------------------

def _product_docs() -> list[str]:
    docs = []
    for sku, p in PRODUCTS_CATALOG.items():
        treats = p.get('diseases', p.get('weeds', p.get('pests', [])))
        doc = (
            f"Syngenta product: {p['name']} (SKU: {sku}). "
            f"Category: {p['category']}. "
            f"Target crops: {', '.join(p['crops'])}. "
            f"Treats/controls: {', '.join(treats)}. "
            f"Dose: {p['dose']}. "
            f"Application timing: {p['timing']}. "
            f"Price: Rs {p['price_per_unit']} per unit. "
            f"Dealer margin: {p['margin']}."
        )
        docs.append(doc)
    return docs


def _disease_seasonality_docs() -> list[str]:
    return [
        # Wheat
        "Wheat Septoria blight risk: high at flowering stage BBCH 60-70 when humidity above 70% and rainfall above 30mm per week. Recommend Tilt 250 EC at 200ml per acre. Apply before heading stage closes.",
        "Wheat yellow rust: risk January to March in Punjab and Uttar Pradesh when temperature 10-15 degrees C with dew formation. Apply Score 250 EC preventively at first sign of pustules.",
        "Wheat powdery mildew: February to March, cool humid conditions. Tilt 250 EC effective at early stage. Symptoms: white powdery coating on leaves.",
        "Wheat aphids: peak at grain fill stage February to March. Actara 25 WG at 80g per acre, systemic action within 24 hours. Check undersides of leaves near flag leaf.",
        "Wheat critical spray windows: tillering BBCH 25-30 for herbicide, booting BBCH 45 for preventive fungicide, flowering BBCH 60-65 for blight protection. Missing these windows causes 20-35% yield loss.",
        "Wheat wild oat control: Topik 15 WP at 160g per acre at 2-3 leaf stage of weeds. Do not apply after jointing stage. Most effective in early crop establishment.",
        # Potato
        "Potato late blight Phytophthora: high risk when temperature 15-20 degrees C and humidity above 80% with two or more consecutive rain days. Apply Kavach 75 WP at 400g per acre preventively every 7-10 days. Brown water-soaked lesions on leaves is early sign.",
        "Potato early blight Alternaria: post-monsoon season, warm days cool nights. Kavach 75 WP recommended. Dark brown concentric ring spots on older leaves.",
        "Potato aphid-transmitted viruses: Actara 25 WG controls aphid vectors. Apply at first aphid sighting to prevent virus spread.",
        # Mustard
        "Mustard alternaria blight: appears at flowering and siliqua stage in Rabi season. Score 250 EC at 250ml per acre or Actara 25 WG. Dark circular spots with yellow halo on leaves and pods.",
        "Mustard aphids Lipaphis erysimi: December to January, check weekly. Actara 25 WG effective systemic control. Economic threshold: 20-25 aphids per plant.",
        "Mustard Sclerotinia stem rot: white cottony mycelium at stem base. High humidity risk. Score 250 EC at disease onset.",
        # Chickpea
        "Chickpea botrytis grey mold: cool humid weather at podding stage in Rabi. Apply Kavach 75 WP. Ash-grey powdery mold on flowers and young pods.",
        "Chickpea helicoverpa pod borer: larval damage at podding reduces yield 30-70%. Actara 25 WG for knockdown control. Wriggler larvae inside pods are confirmation.",
        "Chickpea Fusarium wilt: soil-borne, no chemical control. Crop rotation with non-legume recommended. Report to territory manager as systemic territory risk.",
        # General
        "Fungicide resistance management: rotate Tilt 250 EC triazole with Score 250 EC difenoconazole to prevent resistance buildup in wheat fungal pathogens. Do not use same MoA more than twice consecutively.",
        "Pesticide mixing: Actara 25 WG can be tank-mixed with most fungicides. Do not mix Topik 15 WP with broadleaf herbicides. Always do jar test before full-tank mixing.",
        "Pre-rain application advice: apply fungicide 4-6 hours before expected rain for rainfast protection. Tilt 250 EC rainfast within 2 hours. Kavach 75 WP needs 3 hours.",
    ]


def _crop_recommendation_docs() -> list[str]:
    """NPK conditions and crop suitability knowledge (Crop Recommendation Dataset equivalent)."""
    return [
        "Wheat requires: Nitrogen 80-120 kg/ha, Phosphorus 40-60 kg/ha, Potassium 40 kg/ha. Optimal pH 6-7.5. Temperature 15-25 degrees C. Rainfall 600-1000mm. Rabi season Oct-Apr.",
        "Mustard requires: Nitrogen 60-80 kg/ha, Phosphorus 30-40 kg/ha, Potassium 30 kg/ha. pH 6-7. Temperature 10-25 degrees C. Well-drained loamy soil. Rabi season.",
        "Chickpea requires: Nitrogen 20 kg/ha starter, Phosphorus 60 kg/ha, Potassium 30 kg/ha. pH 6-7.5. Temperature 15-30 degrees C. Low humidity preferred. Rabi season.",
        "Potato requires: Nitrogen 120-150 kg/ha, Phosphorus 60-80 kg/ha, Potassium 120-150 kg/ha. pH 5.5-6.5. Temperature 15-25 degrees C. Sandy loam. Rabi/Kharif.",
        "Nutrient deficiency: yellowing older leaves means Nitrogen deficiency, recommend urea top-dress. Purple leaf undersides means Phosphorus deficiency. Leaf tip burn means Potassium deficiency.",
        "Soil health: pH below 6 reduces herbicide effectiveness. Tilt 250 EC efficacy drops 30% in acidic soil. Recommend lime application if pH below 6 in wheat fields.",
        "Crop rotation benefits: wheat-chickpea rotation fixes 40-60 kg N/ha reducing next wheat fertilizer cost. Reduces Fusarium carryover from continuous wheat monoculture.",
        "Irrigation timing for wheat: critical at crown root initiation 21-25 DAS, tillering 45 DAS, jointing 60-65 DAS, heading 80-85 DAS, grain fill 100-105 DAS. Missing jointing irrigation reduces yield 25%.",
    ]


def _plant_disease_docs() -> list[str]:
    """PlantVillage-equivalent disease descriptions for crop scanner enrichment."""
    return [
        "Apple black rot: circular brown lesions with purple halo on leaves. Fungal disease Botryosphaeria obtusa. Not applicable to Syngenta Rabi portfolio.",
        "Corn northern leaf blight: long elliptical gray-green lesions on maize leaves. Exserohilum turcicum. Relevant in Kharif season.",
        "Grape leaf blight: angular brown spots on grape leaves. Inform growers to contact local Syngenta representative for specialized product.",
        "Tomato early blight Alternaria: concentric dark rings on lower leaves. Score 250 EC or Kavach 75 WP effective. Apply at first sign.",
        "Tomato late blight Phytophthora: water-soaked dark green lesions turning brown. Kavach 75 WP at 400g per acre preventive. Same pathogen as potato late blight.",
        "Tomato bacterial spot: small water-soaked lesions with yellow halo. Copper-based bactericide recommended, not Syngenta fungicide portfolio.",
        "Pepper bacterial spot: raised corky spots on fruit. Bacterial disease, copper bactericide. Report unusual symptoms to area agronomist.",
        "Strawberry leaf scorch: purple to brown irregular blotches. Not in Syngenta Rabi target crops. Refer to specialty crop team.",
        "Wheat leaf rust Puccinia triticina: small orange-red urediniospore pustules on upper leaf surface. Score 250 EC at 250ml per acre highly effective. Apply immediately at first pustule.",
        "Wheat stem rust Puccinia graminis: elongated reddish-brown pustules on stems and leaves. More severe than leaf rust. Apply Tilt 250 EC plus Score 250 EC combination for severe outbreak.",
        "Wheat loose smut Ustilago tritici: black smutted ears replacing grain. Seed-borne. Recommend fungicide seed treatment before next sowing season.",
        "Potato mosaic virus: mottled yellow-green pattern on leaves. Viral, no curative treatment. Control aphid vectors with Actara 25 WG to prevent spread.",
        "Chickpea ascochyta blight: tan to brown lesions with dark border on leaves and pods. No registered Syngenta product. Report to territory manager for advisory.",
        "Mustard white rust Albugo candida: white powdery blisters on leaf undersides. Score 250 EC recommended at early infection stage.",
    ]


def _mandi_price_docs() -> list[str]:
    return [
        "Wheat mandi price India 2025-26: Rs 2,100-2,300 per quintal. MSP Rs 2,275. Major markets: Hapur UP, Muzaffarnagar UP, Karnal Haryana, Ludhiana Punjab. Post-harvest June price dips to Rs 1,900.",
        "Potato mandi price India 2025-26: Rs 800-1,200 per quintal seasonal variation. Agra highest volume market. Cold storage rate Rs 200-250 per quintal adds to effective price. Oct-Nov flush lowers price.",
        "Mustard mandi price India 2025-26: Rs 5,400-5,800 per quintal. MSP Rs 5,650. Rajasthan dominant producer. Bharatpur Alwar major markets. Mar-Apr harvest season.",
        "Chickpea gram mandi price India 2025-26: Rs 5,200-5,600 per quintal. MSP Rs 5,440. Madhya Pradesh highest production. Indore Nagpur Jalgaon major markets. Mar-Apr harvest.",
        "ROI formula for farmer pitch: yield protection rupees = disease severity percent times crop price per quintal times farm size quintals. Treatment cost = product rate times price. ROI = yield protection divided by treatment cost. Any ROI above 3x is compelling pitch.",
        "Example ROI wheat fungicide Tilt 250 EC: 3.2 acre farm, wheat 12 quintals per acre, price Rs 2,200 per quintal, 15% blight loss prevented = Rs 12,672 saved. Tilt 250 EC cost Rs 170 per acre times 3.2 = Rs 544. ROI = 23x.",
        "Example ROI potato Kavach 75 WP: 2 acre farm, potato 100 quintals per acre, late blight risk 30% loss, Rs 1,000 per quintal = Rs 60,000 at risk. Kavach cost Rs 224 per acre times 2 = Rs 448. ROI = 134x.",
        "AGMARKNET data shows demand spikes for fungicides in Feb-Mar wheat heading season. Retailers in Punjab Haryana deplete Tilt 250 EC stocks 3-4 weeks before peak. Pre-season stocking pitch window: Dec-Jan.",
    ]


def _grower_docs() -> list[str]:
    growers_df = loader.get('growers')
    if growers_df is None or growers_df.empty:
        return []
    docs = []
    for _, g in growers_df.head(300).iterrows():
        cal = g.get('grower_crop_calendar', {})
        if isinstance(cal, str):
            try:
                cal = json.loads(cal)
            except Exception:
                cal = {}
        crop = cal.get('crop', 'unknown')
        stages = cal.get('stages', [])
        stage = stages[-1].get('stage', 'unknown') if stages else 'unknown'
        farm = round(float(g.get('grower_farm_size', 0) or 0), 1)
        tehsil = str(g.get('tehsil', ''))
        district = str(g.get('district', ''))
        scanned = str(g.get('product_name', '') or '')
        campaign = str(g.get('offline_campaign_attended', '') or '')
        doc = (
            f"Grower {g['grower_id']} located in {tehsil} tehsil, {district} district. "
            f"Grows {crop} on {farm} acres. Current crop stage: {stage}. "
            f"Product scanned or shown interest: {scanned if scanned else 'none'}. "
            f"Attended offline campaign: {campaign if campaign else 'no'}."
        )
        docs.append(doc)
    return docs


def _retailer_docs() -> list[str]:
    retailers_df = loader.get('retailers')
    inventory_df = loader.get('inventory')
    if retailers_df is None or retailers_df.empty:
        return []
    docs = []
    for _, r in retailers_df.head(300).iterrows():
        rid = str(r['retailer_id'])
        tehsil = str(r.get('tehsil', ''))
        district = str(r.get('district', ''))
        inv_rows: list[dict] = []
        if inventory_df is not None and not inventory_df.empty:
            mask = inventory_df['retailer_id'] == rid
            inv_rows = inventory_df[mask].to_dict(orient='records')
        stockouts = [i['sku_name'] for i in inv_rows if i.get('sku_qty', 0) == 0]
        low = [f"{i['sku_name']} {i.get('sku_qty', 0)} units" for i in inv_rows if 0 < i.get('sku_qty', 0) <= 5]
        healthy = [f"{i['sku_name']} {i.get('sku_qty', 0)} units" for i in inv_rows if i.get('sku_qty', 0) > 5]
        doc = (
            f"Retailer {rid} in {tehsil} tehsil, {district} district. "
            f"Stockouts: {', '.join(stockouts) if stockouts else 'none'}. "
            f"Low stock: {', '.join(low) if low else 'none'}. "
            f"Healthy stock: {', '.join(healthy[:3]) if healthy else 'none'}."
        )
        docs.append(doc)
    return docs


def _visit_docs() -> list[str]:
    """
    Columns: rep_id, visit_date, territory_id, visit_tehsil, visit_type, product_recommended
    """
    visits_df = loader.get('visits')
    if visits_df is None or visits_df.empty:
        return []
    docs = []
    for _, v in visits_df.head(1000).iterrows():
        rep = str(v.get('rep_id', ''))
        tehsil = str(v.get('visit_tehsil', ''))
        product = str(v.get('product_recommended', '') or '')
        visit_type = str(v.get('visit_type', '') or '')
        date = str(v.get('visit_date', ''))[:10]
        doc = (
            f"Field visit: rep {rep} visited {tehsil} tehsil on {date} ({visit_type}). "
            f"Product recommended: {product if product else 'none'}."
        )
        docs.append(doc)
    return docs


def _whatsapp_docs() -> list[str]:
    """
    Columns: id, campaign_product, campaign_crop, grower_id,
             message_sent_date, delivered_status, opened_status, clicked_status
    """
    wa_df = loader.get('whatsapp')
    if wa_df is None or wa_df.empty:
        return []
    docs = []
    for _, row in wa_df.head(300).iterrows():
        grower_id = str(row.get('grower_id', ''))
        product = str(row.get('campaign_product', ''))
        crop = str(row.get('campaign_crop', ''))
        clicked = str(row.get('clicked_status', 'False'))
        opened = str(row.get('opened_status', 'False'))
        sent_date = str(row.get('message_sent_date', ''))[:10]
        intent = 'HIGH demand intent' if clicked == 'True' else ('moderate interest' if opened == 'True' else 'no engagement')
        doc = (
            f"WhatsApp campaign: grower {grower_id} received message about {product} for {crop} crop on {sent_date}. "
            f"Clicked: {clicked}, Opened: {opened}. Signal: {intent}. "
            f"Rep should prioritise follow-up visit if clicked is True."
        )
        docs.append(doc)
    return docs


def _pos_docs() -> list[str]:
    """
    Columns: retailer_id, transaction_id, sku_id, sku_name,
             sku_qty, sku_price, transaction_date
    """
    pos_df = loader.get('pos')
    if pos_df is None or pos_df.empty:
        return []
    docs = []
    for _, row in pos_df.head(500).iterrows():
        retailer = str(row.get('retailer_id', ''))
        sku = str(row.get('sku_name', '') or row.get('sku_id', ''))
        qty = row.get('sku_qty', 0)
        date = str(row.get('transaction_date', ''))[:10]
        price = row.get('sku_price', 0)
        doc = (
            f"POS sale: retailer {retailer} sold {qty} units of {sku} at Rs {price} each on {date}. "
            f"High volume sale signals local demand — retailer may need restock soon."
        )
        docs.append(doc)
    return docs


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def init_rag() -> None:
    """Build the full RAG corpus. Call after loader.load_all() at startup."""
    global _initialized
    if _initialized:
        return
    print('[RAG] Building knowledge base from Syngenta data + agricultural knowledge...')

    # External datasets (Crop Recommendation + India Agri Production)
    try:
        from data.external_loader import load_all_external_docs
        external_docs = load_all_external_docs()
    except Exception as e:
        print(f'[RAG] External datasets skipped: {e}')
        external_docs = []

    all_docs = (
        _product_docs()
        + _disease_seasonality_docs()
        + _crop_recommendation_docs()
        + _plant_disease_docs()
        + _mandi_price_docs()
        + external_docs
        + _grower_docs()
        + _retailer_docs()
        + _visit_docs()
        + _whatsapp_docs()
        + _pos_docs()
    )
    _add_docs(all_docs)
    _initialized = True
    print(f'[RAG] Indexed {len(_docs)} documents across all collections.')


def query_rag(query: str, n: int = 6) -> str:
    """
    Retrieve top-n semantically relevant chunks for query.
    Lazy-initializes RAG on first call to keep startup memory low.
    """
    if not _initialized or _embeddings is None or not _docs:
        init_rag()
    if not _initialized or _embeddings is None or not _docs:
        return ''
    q_vec = _embed([query])
    # Cosine similarity via normalized dot product
    db_norms = np.linalg.norm(_embeddings, axis=1, keepdims=True) + 1e-9
    q_norm = np.linalg.norm(q_vec) + 1e-9
    sims = (_embeddings / db_norms) @ (q_vec / q_norm).T
    top_idx = np.argsort(sims.squeeze())[-n:][::-1]
    chunks = [_docs[i] for i in top_idx]
    return '\n'.join(f'[{i + 1}] {c}' for i, c in enumerate(chunks))
