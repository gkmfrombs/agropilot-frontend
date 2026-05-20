# AgroPilot — Presentation Script
**Hackathon:** Syngenta × IITM 2026
**Team:** Aaysha · Vinshi · Venkatesh · Bhargavi · Amritha · Guddu
**Time:** ~10 minutes

---

## AAYSHA — Intro + Problem + Hook

"Good morning everyone. Thank you Syngenta and IIT Madras for this incredible opportunity.

Let me start with a question.

How does a Syngenta field rep decide who to visit today?

Not with data. With gut feel. Old WhatsApp notes. Memory.

They don't know that a retailer 12km away ran out of stock three days ago. They don't know that seven farmers in that tehsil clicked on a WhatsApp campaign yesterday — ready to buy. They don't know that humidity crossed 74% last night and a late blight outbreak is 48 hours away.

Every missed signal is a missed sale. Every missed sale is a farmer who doesn't get the right treatment in time.

This is not one rep's problem. This is the daily reality for hundreds of Syngenta field reps across India.

We asked one question — what if every rep had an AI that knew their entire territory and told them exactly what to do before they left home?

We built that. We call it AgroPilot.

I'll hand over to Vinshi who will walk you through the app."

---

## VINSHI — Home Screen + Route Planning + Visit Log

"Thank you Aaysha.

*(open app — show onboarding tour)*

When a rep opens AgroPilot for the first time, they get a guided tour of every screen. This is the onboarding experience — it walks them through the whole platform in under a minute.

*(login as arjun — show Morning Briefing)*

Now we're logged in as Arjun, a field rep in Pune. The first thing he sees every morning is his **Morning Briefing** — generated fresh from his real territory data.

This is not a generic dashboard. It tells Arjun specifically — which retailers to visit today and why, what the crop disease risk window looks like right now, and what product to pitch. All based on his actual territory. Not some template.

*(tap Route Planning)*

**Route Planning.** Arjun doesn't need to decide where to go. AgroPilot calculates the best visit order for the day — retailers with stockouts come first, retailers not visited in two weeks are flagged, urgent crop risk signals push certain stops to the top.

One tap. His day is planned.

*(tap Log Visit)*

After each visit, Arjun logs it in **Log Visit** — outcome, products discussed, any competitor products he spotted — done in 30 seconds. This data feeds back into the system so future recommendations get sharper.

I'll pass to Venkatesh."

---

## VENKATESH — Chatbot + Reasoning Graph + Crop Scanner

"Thanks Vinshi. I want to show you the three features that I think make AgroPilot genuinely different.

*(open AI Consultant / Chat screen)*

**The AI Chatbot.**

This is not ChatGPT with an agriculture skin. Ask it something like — 'who should I visit today?' — and watch what happens.

*(send the message — wait for response)*

It gives a structured field intel card. Specific retailers ranked by urgency. Reasons grounded in real data — stockout status, last visit date, nearby farmer demand signals. Ask about the weather — different format, weather-specific answer. Ask about crop disease — different format again with product recommendation and ROI calculation.

The chat streams live, token by token. It remembers conversation history across sessions. And it pulls from three data sources simultaneously — I'll explain that in a moment.

*(open Reasoning Graph)*

**Reasoning Graph.**

Every AI recommendation has a 'why.' This graph shows the seven signals the AI used to arrive at its top recommendation — crop stage, current weather, inventory status, visit history, WhatsApp campaign clicks, POS demand data, and disease risk window.

This is full explainability. When a rep shows this to a farmer or a manager asks why — the answer is right here. Not a black box.

*(open Crop Scanner)*

**Crop Scanner.**

A farmer pulls Arjun aside and shows him a diseased leaf. Arjun opens the scanner, takes a photo.

*(scan or upload image)*

In under five seconds — disease identified, severity assessed, exact Syngenta product recommended, dose per acre, application timing, and yield loss risk if left untreated. Works for wheat, potato, tomato, mustard, chilli, fifteen-plus crops.

The farmer doesn't need to trust gut feel. The rep doesn't need to be an agronomist. The answer is on the screen.

I'll pass to Bhargavi."

---

## BHARGAVI — Remaining Field Rep Screens

"Thank you Venkatesh.

Beyond the core flow, AgroPilot has a full suite of field intelligence tools.

*(open Alerts Feed)*

**Alerts Feed** — a live feed of what's happening across the territory right now. Stockout clusters, disease risk windows opening, campaign warmth signals, competitor activity spotted by other reps. Each alert is ranked by severity and linked to an action.

*(open Visit Copilot)*

**Visit Copilot** — before Arjun walks into a retailer, he opens this card. It shows the retailer's live stock levels, the farmers nearby who clicked the WhatsApp campaign this week — warm leads already identified — weather risk in that tehsil, and ready-made talking points. He walks in prepared.

*(open Farmer Profile + Retailer Profile)*

**Farmer and Retailer Profiles** — full profiles with crop calendar, visit history, product interest, and campaign engagement. Everything Arjun needs to have a meaningful conversation, not a cold sales pitch.

*(open Yield Calculator)*

**Yield Loss Calculator** — Arjun can show a farmer exactly what untreated disease costs them. Enter crop, farm size, severity — the calculator returns treatment cost, yield protection value, and ROI ratio. 'For every one rupee you spend, you protect eight rupees of yield.' That closes the sale.

I'll hand to Amritha for the manager view."

---

## AMRITHA — Manager Console

"Thanks Bhargavi.

Managers get a completely separate console.

*(login as manager or switch view)*

**Territory Heatmap** — at a glance, which territories have coverage gaps, which have critical stockout clusters, where the team is falling behind. Red means action needed today.

*(show KPI Dashboard)*

**KPI Dashboard** — visits this month, revenue, and the metric I find most interesting — AI recommendation acceptance rate. How often are reps actually following what AgroPilot suggests? That number tells a manager whether the AI is earning trust on the ground.

*(show Rep Performance)*

**Rep Performance** — every rep ranked by a composite field score. Not just visit count — quality of visits, stockouts resolved, AI recommendations acted on. Managers can see in thirty seconds who needs coaching.

*(show Campaign Performance)*

**Campaign Performance** — full funnel from WhatsApp impressions to landing page visits to lead form submissions. For every product, every campaign. This closes the loop between what marketing sends and what the field actually converts.

From the real dataset — we found three confirmed stockouts that had not been acted on, and fourteen percent of retailers had not been visited in over two weeks. AgroPilot surfaces all of this automatically. The manager doesn't need to ask. Over to Guddu."

---

## GUDDU — Tech + AI Layer + Closing

"Thank you Amritha.

Let me quickly explain what's powering all of this — and then close.

**The tech stack:** FastAPI Python backend, React TypeScript frontend, Groq for AI inference — Llama 3.3 70B for chat, Llama 4 Scout for vision. Eight CSV datasets, fifty-five thousand rows loaded in memory at startup. JWT authentication, Server-Sent Events for real-time streaming. Deployed on Render and Vercel right now — live, not a mockup.

**Three layers of AI on every chat query:**

One — Vector RAG. Every question triggers a semantic search over 2,600 agronomic documents using sentence-transformers running locally. Top six relevant chunks — spray timings, disease windows, mandi prices — go into the LLM context before it answers.

Two — CSV GraphRAG. We simulate graph database traversal using pandas multi-hop joins. One query can find: which retailers in this rep's territory are out of stock AND have nearby farmers who clicked a WhatsApp campaign in the last two weeks. Three data hops, scored and ranked, injected into the LLM context automatically.

Three — Vision AI. The crop scanner sends the image to Llama 4 Scout via Groq. Structured diagnosis output, five seconds.

**To close —**

AgroPilot is live right now. Seventeen screens. Twenty-plus API endpoints. Five Indian languages. Real data. Real AI.

Login at the URL on screen — username arjun, password agropilot2026.

We didn't build a demo. We built a product.

Thank you."

---

## Q&A CHEAT SHEET

| Question | Who | Answer |
|----------|-----|--------|
| Different from a CRM? | Venkatesh | CRM stores data. AgroPilot acts on it — real-time AI recommendations before the visit happens |
| Offline support? | Venkatesh | Sync center caches data locally, visit logs queue and sync when back online |
| Scanner accuracy? | Venkatesh | Llama 4 Scout via Groq, confidence score shown to rep, validated on 15+ crops |
| Scale to 500+ reps? | Guddu | Stateless JWT, CSV → Postgres in production, Groq handles inference load |
| Revenue model? | Bhargavi | SaaS per-rep monthly licensing to Syngenta, premium tier unlocks Neo4j graph DB |
| Is data real? | Amritha | Yes — actual hackathon dataset, 55k+ rows across 8 files, nothing fabricated |
| Why Groq not OpenAI? | Guddu | Free tier, fast inference, Llama 4 Scout for vision — no cost for the hackathon |
