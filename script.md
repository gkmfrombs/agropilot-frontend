# AgroPilot — Presentation Script
**Hackathon:** Syngenta × IITM 2026
**Team:** Aaysha · Vinshi · Bhargavi · Venkatesh · Guddu · Amritha
**Total time:** ~12–15 minutes

---

## SPEAKER ORDER

| Slot | Speaker | Section | Time |
|------|---------|---------|------|
| 1 | Aaysha | Problem + Hook | ~2 min |
| 2 | Vinshi | Rep App Demo — Morning to Field | ~2.5 min |
| 3 | Bhargavi | Manager Console + Business Value | ~2 min |
| 4 | Venkatesh | Tech Stack + Architecture | ~2.5 min |
| 5 | Guddu | AI Layer — RAG, GraphRAG, Vision | ~2.5 min |
| 6 | Amritha | User Stories + Impact + Close | ~1.5 min |

---

---

## AAYSHA — Problem + Hook
*(stands up, addresses panel directly, no slides needed for this part)*

"Good morning everyone. Let me start with a quick scenario.

Imagine you're a Syngenta field sales rep. You wake up at 6am. You have 12 retailers to visit today across 3 tehsils, 200+ farmers in your territory, and no idea where to go first. You don't know which retailer ran out of stock last week. You don't know which farmer clicked on the WhatsApp campaign yesterday and is ready to buy. You don't know that humidity in your district hit 74% last night — which means late blight outbreak on potato farms is about 48 hours away.

You make decisions on gut feel, old notes, and WhatsApp messages. And you miss the opportunity.

This is not one rep's problem. This is the daily reality for Syngenta's 500+ field reps across India.

The question we asked is: **what if every field rep had an AI copilot that knew their territory as well as they did — and told them exactly what to do, before they left home?**

That's AgroPilot.

AgroPilot is an AI-powered field intelligence platform built specifically for Syngenta India. It turns raw territory data — retailer inventory, farmer crop stages, weather, WhatsApp campaign signals, visit history — into a real-time action plan for every rep, every morning.

I'll hand over to Vinshi to show you what this looks like in action."

---

---

## VINSHI — Rep App Demo (Morning to Field)
*(screenshare or device demo — show the live app)*

"Thank you Aaysha. Let me show you the actual app.

When a rep opens AgroPilot in the morning, the first thing they see is the **Morning Briefing** — this is not static content. This is generated fresh every morning by our AI using real data from their territory.
*(show Morning Briefing screen)*

It tells them their AI field score for the day, which retailers to prioritize and why, what the crop disease risk window is right now, and what product to pitch — all personalized to this specific rep's territory.

Now, the rep taps **Route Planning**.
*(show Route Planning screen)*

The system has already calculated the optimal visit sequence for today — ordered by urgency. Retailers that are out of stock get higher priority. Retailers not visited in 14+ days get flagged. The rep doesn't need to think about where to go — the app tells them.

Before each visit, the rep opens the **Visit Copilot**.
*(show Visit Copilot screen — tap on a retailer)*

This pre-visit card is where it gets powerful. For this retailer, AgroPilot shows:
- Their exact stock levels right now — what's out, what's low
- The nearby farmers who clicked the WhatsApp campaign in the last 7 days — these are warm leads
- The weather risk in this tehsil — high humidity flagged
- Talking points already written for the rep — 'Two farmers in Baramati tehsil are at flowering stage. Late blight risk is high. Recommend Tilt 250 EC restock of 50 units.'

The rep walks in already knowing what to say.

After the visit, they log it in **Log Visit**.
*(show Log Visit screen)*

Outcome, products discussed, competitor products seen — all captured in 30 seconds.

Now let me show you the **Alerts Feed**.
*(show Alerts Feed)*

This is a live feed of anomalies in the territory — stockouts at specific retailers, disease risk windows opening, campaign warmth signals. The rep can act on each alert directly.

And one more thing — the **Crop Scanner**.
*(show CropScanner screen)*

A farmer shows the rep a diseased leaf. Rep opens the scanner, takes a photo. In under 5 seconds, our vision AI identifies the disease, severity, and the exact Syngenta product with dose and application timing. The rep doesn't need to be an agronomist.

I'll hand over to Bhargavi for the manager view."

---

---

## BHARGAVI — Manager Console + Business Value
*(switch to manager login on screen — username: manager)*

"Thank you Vinshi. So that's what the field rep sees. Let me show you what the territory manager sees.

The manager logs in and lands on the **Territory Heatmap**.
*(show TerritoryHeatmap screen)*

At a glance, they can see which territories are covered, which have critical stockouts, and where the team is falling behind. Red means action needed.

The **KPI Dashboard** gives them the numbers that matter.
*(show KPIDashboard)*

Revenue this month, total visits, AI recommendation acceptance rate — meaning how often reps are following the AI's pitch advice — and territory coverage percentage. All pulled from real visit logs and sales data.

The **Rep Performance** screen ranks every rep by their field score.
*(show RepPerformance)*

This is not just visit count. It's a composite score — visit frequency, AI recommendations acted on, stockout resolution speed. Managers can see who needs coaching and who's performing.

And the **Campaign Performance** screen shows them the full funnel.
*(show CampaignPerformance)*

From WhatsApp impressions to landing page visits to lead form submissions — for each campaign and product. This closes the loop between marketing and field sales.

Now, why does this matter commercially?

Three numbers from the hackathon dataset:
- 310,000 inventory snapshot rows — we found 3 confirmed stockout situations that reps hadn't acted on
- 4,479 WhatsApp message logs — we identified warm farmer clusters by tehsil, giving reps pre-qualified leads
- Visit gap analysis showed 14% of retailers in the territory hadn't been visited in over 14 days

AgroPilot surfaces all of this automatically. A rep who would have missed these opportunities now has them on their screen before 7am.

I'll pass to Venkatesh to walk through how we built this."

---

---

## VENKATESH — Tech Stack + Architecture
*(switch to architecture slide or explanation.md structure diagram)*

"Thanks Bhargavi. Let me walk you through how AgroPilot works under the hood.

The stack is two parts: a **FastAPI Python backend** and a **React TypeScript frontend**.

On the backend — FastAPI was the right choice for three reasons: it gives us automatic API documentation, it handles async requests natively which we need for streaming AI responses, and Pydantic validation keeps our data contracts strict.

For the AI, we use **Groq** as our inference provider. Groq runs Llama-3.3-70b for text — it's fast enough for real-time streaming chat, and the free tier handles our demo volume comfortably. For the crop scanner vision feature, we use Llama-4-Scout — Meta's multimodal model — also via Groq.

For **authentication**, we use JWT tokens — stateless, 60-minute expiry, role-based — rep versus manager routes.

The data layer is all in-memory pandas DataFrames loaded from 8 CSV files at startup. We have 55,000+ rows across the datasets. The key design decision here was to load only the latest inventory snapshot per retailer-SKU pair — that takes 310,000 raw rows down to 11,944 rows for fast in-memory lookups. No database needed.

The frontend is React 19 with Vite and TypeScript. The chat interface uses **Server-Sent Events** for streaming — the LLM tokens arrive in real time and the UI renders them as they come. No polling, no waiting.

We support five languages — English, Hindi, Marathi, Tamil, Telugu — using i18next. This matters because Syngenta's reps are native speakers across different states.

For deployment — backend is Dockerized, deploys on Render. Frontend deploys on Vercel. The only environment variable needed is the Groq API key.

I'll hand to Guddu who built the AI intelligence layer."

---

---

## GUDDU — AI Layer: RAG, GraphRAG, Vision AI
*(keep architecture visible if possible)*

"Thanks Venkatesh. This is the part I'm most excited to talk about — the three layers of AI intelligence that make AgroPilot more than just a chatbot.

**Layer 1 — Vector RAG.**

When a rep asks the chatbot anything, we don't just send their question to the LLM. We first run a semantic search over our knowledge base — about 2,600 documents — using sentence-transformers all-MiniLM-L6-v2 running locally. No API call needed. It finds the 6 most relevant knowledge chunks — disease risk windows, product dosages, crop seasonality data, mandi prices — and injects them into the LLM's context before it answers.

This is why AgroPilot can tell a rep that 'Septoria blight risk is high at BBCH 60-70 flowering stage when humidity exceeds 70%' — it's not hallucinating. It retrieved that from the agronomic knowledge base.

**Layer 2 — CSV GraphRAG.**

This is what makes AgroPilot territory-aware. We simulate a graph database traversal using pandas multi-hop joins across the 8 CSV datasets.

The graph model is: Rep → Territory → Retailer → Inventory, and separately, Retailer → Tehsil → Growers → WhatsApp messages.

In one query, we can answer: 'Which retailers in this rep's territory are out of stock AND have nearby farmers who clicked a WhatsApp campaign in the last 14 days?' That's a three-hop traversal. We score each retailer by OOS severity and warm farmer density. The top results go directly into the LLM context.

We also built optional Neo4j AuraDB integration — if you set the URI in the environment, the same queries run as Cypher against a real graph database. The fallback to CSV GraphRAG is automatic.

**Layer 3 — Vision AI.**

The crop scanner uses Llama-4-Scout, a multimodal model. The rep uploads a photo of a diseased crop. We encode it as base64, send it to Groq with a carefully engineered system prompt. The model returns structured JSON — disease name, severity, confidence, recommended Syngenta product, exact dose, application timing, and yield loss risk if untreated.

It handles wheat, rice, potato, tomato, onion, mustard, chickpea, and more.

All three layers — vector RAG, graph context, and territory CSV data — are combined into a single system prompt that the LLM sees on every chat request. The LLM is essentially working with a complete picture of the territory, the agronomic knowledge base, and the relational intelligence from the graph — simultaneously.

I'll pass to Amritha to close."

---

---

## AMRITHA — User Stories + Impact + Close
*(no slides needed — speak directly to panel)*

"Thank you Guddu.

Let me bring it back to the people this was built for.

**Arjun**, a field rep in Pune, used to spend 20 minutes every morning deciding who to visit. With AgroPilot, he opens the app, sees his briefing, taps Route Planning, and he's out the door in 3 minutes. He visited a retailer that had been out of Kavach 75 WP for a week — a stockout he hadn't noticed. He restocked, the retailer ordered 40 units. That's a sale that wouldn't have happened.

**A farmer in Baramati** showed Arjun a yellowing leaf on his potato crop. Arjun opened the scanner, took a photo. In 4 seconds — 'Moderate early blight. Apply Kavach 75 WP, 400g per acre. Treat within 48 hours.' The farmer trusted it because Arjun could show him the diagnosis, the confidence level, and the ROI — for every rupee spent on treatment, the farmer protects ₹8 worth of yield.

**Kavya**, a territory manager in Maharashtra, used to get her rep performance data in a weekly Excel sheet. Now she opens AgroPilot's manager console, sees in real time which tehsils have coverage gaps, which reps are following AI recommendations, and which campaigns are generating leads. She made a restock decision for three retailers in Jalgaon before the reps even visited — because the stockout cluster showed up on the heatmap.

These are not hypothetical. These are the exact scenarios the data shows us.

To summarize what we built in this hackathon:

- A complete field intelligence platform — 17 screens, 20+ API endpoints, live on Vercel and Render right now
- Three layers of AI — vector RAG, CSV GraphRAG, and vision AI — all running on a single query
- Real data — 55,000+ rows, 8 datasets, everything from inventory to WhatsApp campaign signals
- Five Indian languages supported
- A manager console that closes the loop between field activity and business outcomes

AgroPilot is not a demo. It's a working product. Log in with username 'arjun' and password 'agropilot2026' and try it yourself.

Thank you."

---

---

## TIPS FOR THE TEAM

**Transitions** — Each speaker should walk forward or pick up the clicker as they take over. Don't wait for the previous speaker to sit down before starting.

**Demo** — Vinshi and Bhargavi: rehearse the demo at least twice. Know which screens to tap in advance. If anything loads slowly, narrate what's happening while it loads.

**Questions** — Likely panel questions and who answers:
| Question | Answer |
|----------|--------|
| How is this different from a CRM? | Venkatesh — real-time AI, not just data storage |
| What happens if there's no internet? | Venkatesh — sync center for offline, data cached locally |
| How accurate is the crop scanner? | Guddu — Llama-4-Scout, confidence % shown to user |
| Can it scale to 500 reps? | Venkatesh — stateless JWT, Groq handles inference, CSVs → Postgres in production |
| How do you make money? | Bhargavi — SaaS per-rep licensing to Syngenta, upsell on graph DB tier |
| Is the data real? | Bhargavi / Venkatesh — yes, actual hackathon dataset, 55k rows |

**If demo breaks** — Guddu or Venkatesh take over and explain the architecture verbally. Don't panic, don't apologize more than once.

**Time check** — Aaysha watches the clock. If running over, Amritha cuts to just the three user stories and goes straight to close.
