# AgroPilot — Presentation Script
**Team:** Aaysha · Vinshi · Venkatesh · Guddu · Bhargavi · Amritha
**Time:** ~10 minutes

---

## AAYSHA — Opening + Problem (1.5 min)

"Good morning! Thank you to Syngenta and IITM for this hackathon. We are Team AgroPilot.

Syngenta has 500+ field reps across India. Every morning they wake up with no idea which retailer ran out of stock, which farmer is ready to buy, or which crop is about to get hit by disease. They make decisions on gut feel and miss sales worth lakhs.

We built AgroPilot — an AI copilot that knows the rep's entire territory and tells them exactly what to do, before they leave home. I'll hand to Vinshi who will walk you through the app."

---

## VINSHI — Tour + First 2 Screens (2 min)

"Thank you Aaysha. Let me open the app.

*(open app — onboarding tour starts automatically)*

When a new user opens AgroPilot for the first time, they get a guided tour — it walks through every screen so the rep knows exactly what they have. This is the onboarding experience.

*(tour ends — login as arjun)*

Now logged in as Arjun, a field rep in Pune.

**Screen 1 — Morning Briefing.**
*(show Morning Briefing)*
This is generated fresh every morning from Arjun's real territory data — priority retailers to visit, crop disease risk windows, top product to pitch today. Not generic — specific to his tehsil.

**Screen 2 — Route Planning.**
*(show Route Planning)*
The app calculates the best visit order for the day. Retailers with stockouts come first. Retailers not visited in 14+ days are flagged. Arjun doesn't decide where to go — AgroPilot does. I'll pass to Venkatesh."

---

## VENKATESH — Tech Stack + Chatbot + Crop Scanner + Reasoning Graph (3 min)

"Thanks Vinshi. Let me show you three features I'm most proud of — and quickly explain how the whole system is built.

**Tech:** FastAPI backend, React TypeScript frontend, Groq for AI inference — Llama-3.3-70b for chat, Llama-4-Scout for vision. 8 CSV datasets, 55,000+ rows loaded in memory. JWT auth, Server-Sent Events for streaming. Deployed on Render and Vercel.

**The AI Chatbot.**
*(open AIConsultant screen)*
This is not a generic chatbot. Ask it something like 'who should I visit today?' — it gives a structured field intel card: specific retailers, reasons, crop stage context — all from Arjun's real territory data. Ask about weather or disease risk — different format, relevant data.
The responses stream live token by token. The chat history is saved across sessions so the rep can always refer back.

**Crop Scanner.**
*(open CropScanner, scan or upload image)*
Farmer shows Arjun a diseased leaf. Arjun opens the scanner, takes a photo. In 5 seconds — disease name, severity, exact Syngenta product to recommend, dose per acre, and yield loss risk if untreated. Works for wheat, potato, tomato, mustard, 15+ crops.

**Reasoning Graph.**
*(open ReasoningGraph)*
This is my favourite screen. Every AI recommendation has a 'why' — this graph shows the 7 signals the AI used: crop stage, weather, inventory status, visit history, WhatsApp campaign signals, and more. Full explainability — not a black box. Over to Guddu."

---

## GUDDU — Manager Console (1.5 min)

"Thanks Venkatesh. Managers get their own view.

*(login as manager or switch to manager console)*

**Territory Heatmap** — at a glance, which territories have coverage gaps and stockout clusters.

**KPI Dashboard** — total visits, revenue, AI recommendation acceptance rate — how often reps follow the AI's advice.

**Rep Performance** — every rep ranked by field score. Not just visit count — quality of visits, stockout resolution, AI actions taken.

**Campaign Performance** — full funnel: WhatsApp impressions to landing page to lead form. Closes the loop between marketing and field sales.

From the real dataset — 3 stockouts reps hadn't acted on, 14% of retailers not visited in 14+ days. Manager sees all of it in one dashboard. Bhargavi will explain the AI layer."

---

## BHARGAVI — AI Layer (1.5 min)

"Thanks Guddu. Three layers of AI run on every chat query.

**Layer 1 — Vector RAG.** Every question triggers a semantic search over 2,600 agronomic documents using sentence-transformers, running locally. Top 6 relevant chunks — spray timings, disease windows, product doses — go into the LLM context before it answers. No hallucinations.

**Layer 2 — CSV GraphRAG.** We simulate graph database traversal using pandas multi-hop joins. One query finds: which retailers in this rep's territory are out of stock AND have nearby farmers who clicked a WhatsApp campaign? Three hops, scored by urgency, injected into the LLM context automatically.

**Layer 3 — Vision AI.** Crop scanner sends the image to Llama-4-Scout via Groq — returns disease, severity, confidence score, Syngenta product, dose, and yield loss risk. All three layers combine into one system prompt. The LLM sees the full territory picture on every single query. Amritha will close."

---

## AMRITHA — Impact + Close (1 min)

"Thank you Bhargavi.

Three real scenarios from the data: A rep finds a stockout the system flagged — restocked, 40 units sold. A farmer shows a diseased leaf — scanner gives the exact treatment, farmer saves ₹8 for every ₹1 spent. A manager spots a stockout cluster in Jalgaon on the heatmap and acts before the reps even visit.

What we built: 17 screens, 20+ API endpoints, live right now. Three AI layers on real data. Five Indian languages. Full manager console.

Log in — username **arjun**, password **agropilot2026** — try it yourself.

Thank you."

---

## Q&A CHEAT SHEET

| Question | Who |
|----------|-----|
| Different from a CRM? | Venkatesh — AI + real-time action, not just data entry |
| Offline support? | Venkatesh — sync center, local cache |
| Scanner accuracy? | Bhargavi — Llama-4-Scout, confidence % shown |
| Scale to 500 reps? | Venkatesh — stateless JWT, CSVs → Postgres in production |
| Revenue model? | Guddu — SaaS per-rep licensing |
| Is data real? | Guddu — yes, actual hackathon dataset, 55k rows |
