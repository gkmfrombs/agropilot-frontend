# AgroPilot — Presentation Script
**Team:** Aaysha · Vinshi · Bhargavi · Venkatesh · Guddu · Amritha
**Time:** ~10 minutes

---

## AAYSHA — Problem (1.5 min)

"Syngenta has 500+ field reps across India. Every morning they wake up with no idea which retailer ran out of stock, which farmer is ready to buy, or which crop is about to get hit by disease. They make decisions on gut feel and miss opportunities worth lakhs.

We asked — what if every rep had an AI that knew their entire territory and told them exactly what to do before they left home?

That's AgroPilot. I'll hand to Vinshi to show you the app."

---

## VINSHI — Rep App Demo (2.5 min)

"When the rep opens AgroPilot, they see a **Morning Briefing** — generated fresh from their real territory data. Priority visits, disease alerts, top product to pitch. Not generic — specific to their area.

*(show Morning Briefing → Route Planning)*

Route Planning shows the optimal visit order — retailers with stockouts and farmers with urgent crop needs come first.

*(show Visit Copilot)*

Before each visit, the **Visit Copilot** card shows live stock levels, nearby farmers who clicked the WhatsApp campaign, weather risk, and ready-made talking points.

*(show Crop Scanner)*

If a farmer shows a diseased crop, the rep scans it. In 5 seconds — disease name, severity, exact Syngenta product, dose, and ROI for the farmer. No agronomy degree needed.

Bhargavi will show the manager side."

---

## BHARGAVI — Manager Console (1.5 min)

"Managers get their own dashboard.

*(show Territory Heatmap → KPI Dashboard → Rep Performance)*

Territory heatmap shows coverage gaps and stockout clusters in real time. KPI dashboard tracks visits, revenue, and AI recommendation acceptance rate. Rep performance ranks every rep by a composite field score — not just visit count.

From the real dataset — 3 confirmed stockouts that reps hadn't acted on, 14% of retailers not visited in 14+ days. AgroPilot surfaces all of this before the manager has to ask. Over to Venkatesh for the tech."

---

## VENKATESH — Tech Stack (2 min)

"Backend is **FastAPI** with Python — async, auto-documented, Pydantic validated. AI inference runs on **Groq** — Llama-3.3-70b for chat, Llama-4-Scout for vision. Fast enough for real-time streaming.

Frontend is **React + TypeScript + Vite**. Chat uses Server-Sent Events — tokens stream live, no polling. Five Indian languages supported — Hindi, Marathi, Tamil, Telugu, English.

Data layer: 8 CSV datasets, 55,000+ rows loaded into memory at startup. No database required for the demo. Auth is JWT, 60-minute tokens, role-based — rep vs manager. Dockerized backend on Render, frontend on Vercel. Guddu will explain the AI layer."

---

## GUDDU — AI Intelligence (2 min)

"Three layers of AI — all active on every chat query.

**Layer 1 — Vector RAG.** Every question runs a semantic search over 2,600 agronomic knowledge documents using sentence-transformers, locally. Top 6 relevant chunks go into the LLM context. That's why answers cite real spray timings and disease windows — not hallucinations.

**Layer 2 — CSV GraphRAG.** We simulate graph database traversal using pandas multi-hop joins across all 8 datasets. One query finds: which retailers in this rep's territory are out of stock AND have nearby farmers who clicked a WhatsApp campaign? Three hops, scored, injected into the LLM context.

**Layer 3 — Vision AI.** Crop scanner sends the image to Llama-4-Scout via Groq. Returns structured JSON — disease, severity, confidence, Syngenta product, dose, yield loss risk. Handles 15+ crops.

All three layers combine into one system prompt. The LLM sees the full picture. Amritha will close."

---

## AMRITHA — Impact + Close (1 min)

"Real scenarios from the data:

A rep finds a retailer out of Kavach 75 WP — a stockout the system flagged. Restocked, 40 units sold. A farmer shows a diseased leaf, scanner says moderate early blight, rep gives the exact treatment — farmer saves ₹8 for every ₹1 spent. A manager spots a stockout cluster in Jalgaon on the heatmap and acts before the rep even visits.

What we built: 17 screens, 20+ API endpoints, live right now. Three AI layers on real data. Five languages. Full manager console.

Log in with username **arjun**, password **agropilot2026** and try it.

Thank you."

---

## Q&A CHEAT SHEET

| Question | Who answers |
|----------|-------------|
| How is this different from a CRM? | Venkatesh — AI + real-time, not just data entry |
| Offline support? | Venkatesh — sync center, local cache |
| Scanner accuracy? | Guddu — Llama-4-Scout, confidence % shown |
| Scale to 500 reps? | Venkatesh — stateless JWT, CSVs → Postgres in production |
| Revenue model? | Bhargavi — SaaS per-rep licensing to Syngenta |
| Is data real? | Bhargavi — yes, actual hackathon dataset, 55k rows |
