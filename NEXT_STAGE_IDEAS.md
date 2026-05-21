# AgroPilot — Next Stage Feature Ideas

Production-scale features to build after the hackathon prototype.

---

## AI & Intelligence

- **Predictive disease outbreak model** — ML model trained on historical weather + outbreak data. Flag disease risk 5–7 days before symptoms appear, not after. Input: weather forecast + crop stage + historical outbreak records. Output: risk score per tehsil per crop.
- **Full vector RAG on production** — semantic search across agronomic knowledge bases, Syngenta product manuals, disease encyclopedias. Currently disabled due to free-tier RAM (512MB). Needs 1GB+ instance. sentence-transformers all-MiniLM-L6-v2 is already wired up, just needs a real deployment.
- **Larger LLM context** — with proper RAG, pass full grower history, multi-season crop data, and competitor intelligence into context window.
- **Soil health intelligence** — integrate NPK sensor data or soil test reports. Cross-reference with Crop_recommendation.csv benchmarks to advise on soil amendment before sowing.
- **Yield prediction per grower** — use India Agriculture Crop Production dataset + current weather + crop stage to predict expected yield and calculate treatment ROI more precisely.

---

## Voice & Language

- **Voice interface in Hindi/Marathi** — rep speaks the query, gets spoken response in their language. Use Whisper for STT, Claude/Llama for response, a TTS model for output. No typing in the field.
- **Full multilingual AI responses** — currently UI is translated (English/Hindi/Marathi) but LLM responds only in English. Make the LLM respond in the rep's selected language.
- **Farmer-facing voice bot** — rep hands phone to farmer, farmer speaks in local language, AI responds with advice in same language.

---

## Connectivity & Offline

- **Offline-first mode** — cache territory data, grower profiles, product catalog, and last briefing locally. Queue visit logs, scan results, and chat queries when offline. Sync when connectivity returns. Critical for rural field conditions.
- **Progressive Web App (PWA)** — installable on Android home screen, works offline, background sync, push notifications without app store.
- **Lightweight model on-device** — small quantized model (GGUF/ONNX) for basic disease diagnosis and product lookup without internet.

---

## Integrations

- **WhatsApp bot** — reps get morning briefing, stockout alerts, and disease risk flags directly on WhatsApp. No need to open app. Farmers can ask questions via WhatsApp in their language.
- **GPS-based live route tracking** — actual turn-by-turn navigation integrated with visit plan. Auto-log visit when rep arrives at retailer GPS location.
- **Push notifications** — proactive alerts before disease spray windows open, stockout alerts, overdue visit reminders. Don't wait for rep to open app.
- **SAP/CRM integration** — sync visit logs, order data, and inventory updates back to Syngenta's internal systems automatically.
- **Distributor portal** — when stockout detected, auto-raise reorder request to distributor with one tap.

---

## Analytics & Manager Console

- **Cohort analysis** — track which reps' visits actually converted to sales. Close the loop between visit log and order data.
- **Territory heatmap with real GPS** — plot actual visit locations on a real map (Google Maps or MapMyIndia), not just a static visual.
- **Rep gamification** — leaderboard, streak tracking, territory coverage score. Motivate reps through friendly competition.
- **Campaign ROI tracker** — connect WhatsApp campaign clicks to actual sales. True funnel close rate per product per campaign.
- **Disease outbreak map** — aggregate scan results from all reps to build a real-time disease spread map across territories.

---

## Product & UX

- **Farmer profile with photo** — rep can take farmer photo, attach to profile. Makes recall easier across hundreds of growers.
- **Multi-crop support per grower** — currently one crop per grower in calendar. Real farms grow 2–3 crops per season.
- **Order placement in-app** — rep places product order directly through app, syncs to distributor. Closes the pitch → order loop.
- **Field photo gallery** — attach photos to visit logs. Disease photos stored against grower profile for longitudinal tracking.
- **Competitor tracking** — rep logs competitor product sightings at retailers. Builds intelligence map of competitor activity.

---

## Infrastructure

- **Proper RAG deployment** — 1GB+ RAM instance (Render paid / Railway / Hetzner). Enable sentence-transformers vector RAG in production.
- **Database backend** — replace CSV files with PostgreSQL + Supabase. Real-time updates, proper RLS, multi-rep data isolation.
- **Redis caching** — cache weather API responses, LLM responses for common queries, territory context per rep.
- **Background job queue** — Celery or similar for async briefing generation, RAG embedding updates, campaign sync.
- **Monitoring & observability** — Sentry for error tracking, Grafana for API latency, LLM token usage dashboards.
- **Multi-tenant architecture** — support multiple Syngenta zones/regions with isolated data per territory cluster.
