# HelloBusan — Human‑Controlled Agentic City

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**You decide. Your agent acts. Busan responds.**

HelloBusan is a WebMCP hackathon submission: a web app where an AI agent
plans a real Busan itinerary — weather, places, events, restaurants, routing,
budget — by calling **structured tools the page itself registers**
(`document.modelContext.registerTool()`), instead of guessing at buttons and
scraping the DOM. The one real‑world‑facing action (a restaurant
reservation) always pauses for a human to tap **Approve**, and two
tools (`process_payment`, `update_profile`) are hard‑locked to **DENY** so
judges can verify the lock actually holds.

This repo is the actual, working implementation of the product spec in
[`docs/HELLOBUSAN_PRD.md`](docs/HELLOBUSAN_PRD.md) and
[`docs/HELLOBUSAN_TODO.md`](docs/HELLOBUSAN_TODO.md).

---

## Quick start

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. That's it — no API keys, no backend to
stand up. City data is served from static JSON, the natural‑language goal
parser is a small rule‑based parser (see [`src/lib/nlu.js`](src/lib/nlu.js)),
and weather is a deterministic simulator (see
[`src/lib/weather.js`](src/lib/weather.js)) — all so a judge can clone this
and see it work in under a minute.

To try the actual WebMCP tool registration, use a WebMCP‑capable browser
(Chrome Canary with the WebMCP flag/origin trial, or any browser/agent host
that implements `document.modelContext`) — see
[**Testing the real WebMCP tools**](#testing-the-real-webmcp-tools) below.
Without WebMCP support, the page still works: the built‑in agent calls the
exact same functions directly (see [How it's built](#how-its-built)).

```bash
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Deploy `dist/` to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any
static host. There is no server component to configure.

---

## Why this is a good fit for WebMCP

Existing AI travel planners are strong at *summarizing information* into one
screen. What they don't show is a website handing an agent a **structured,
typed, callable contract** for the actions the site actually supports. That's
WebMCP's whole point, and it's easy to lose in a demo that's really just "a
chatbot with a nice UI."

HelloBusan is built so that claim is testable, not just asserted:

- **The tools are the product.** `search_places`, `search_restaurants`,
  `calculate_route`, `update_itinerary`, `request_reservation`, etc. aren't a
  decorative list — they're the *only* way the itinerary shown on screen
  changes. There's no hidden "real" planner behind the scenes that the tools
  merely narrate.
- **The same tools are called by two different agents.** The built‑in agent
  (triggered by the goal bar) and any external WebMCP‑capable agent both go
  through the identical `engine.callTool(name, input)` function — same
  permission checks, same logging, same approval flow. Nothing is faked for
  the in‑app demo path.
- **A live, real‑time comparison, not a marketing slide.** The WebMCP
  Evaluation panel actually runs a scripted DOM‑only agent against a plain
  legacy form, actually runs the WebMCP agent, and lets a judge actually
  click through the task themselves — then reports whatever numbers came out
  (see [Honest benchmarking](#honest-benchmarking-not-fabricated-numbers)).
- **A real DENY, not a hidden button.** `process_payment` and
  `update_profile` are registered WebMCP tools that any agent can attempt to
  call — and every attempt fails, on purpose, because the policy check runs
  in the same code path as every other tool, not just in the UI.

## How this creates a better user experience

- **Less babysitting.** A DOM-scraping agent has to search, click into a
  result, wait, parse the HTML, and repeat — for every place, every
  restaurant, every filter. HelloBusan's agent gets a typed answer back from
  one call and moves on. The WebMCP Evaluation panel measures this directly:
  in a typical run the WebMCP agent finishes the same task in about a third
  of the clicks the DOM version needs.
- **Confidence instead of anxiety.** Because sensitive actions are gated by a
  visible, editable policy (the Agent Wallet) and a real approval step, a
  person can let the agent range further — "search, compare, optimize,
  rewrite my whole itinerary" — without worrying it will also book or spend
  something on its own.
- **Explainability by default.** The Agent Black Box shows the input,
  output, permission, latency and impact of every single tool call. "Why did
  it suggest this?" has an actual answer, not a hand‑wave.

## What becomes possible for people + agents together

Today, doing "something in a city" with an AI means the AI *describes*
options and the person does all the *clicking* across several separate
sites. WebMCP lets a single agent session **act inside real, independent web
apps** it doesn't control the backend of — search across services, compare,
build a plan — while the person keeps a hard veto over anything that spends
money or touches their data. That combination (agent reach + human veto) is
the part that's new: not "AI plans your trip," but *"a city's independent
web services become jointly operable by a person and their agent, with the
person's permission boundary enforced by the services themselves, not by
trusting the agent to behave."* Extended city‑wide (Phase 2/3 in the PRD:
onboarding small businesses with an "Agent Passport" that generates their own
WebMCP tools), this is a pattern for how a whole city's independent web
services could become jointly operable by people and their agents — not
funneled through one company's booking platform.

---

## How it's built

```
Goal bar / Agent Assistant chat
        │  (natural-language text)
        ▼
 src/lib/nlu.js            — rule-based constraint extraction (budget, hours,
                              child, rain, dietary, district)
        │
        ▼
 src/hooks/useAgentEngine.js
   ├─ impl.{tool}()         — the actual logic for each of the 12 tools
   ├─ callTool(name, input) — permission gate → (allow | ask-and-await-approval
   │                          | deny) → run impl → log to Black Box + Activity
   └─ runAgent(goalText)    — calls callTool(...) in the PRD §15 sequence
        │
        ▼
 src/lib/planner.js        — greedy selection + real travel-time-aware
                              trimming (src/lib/geo.js) against budget & hours
        │
        ▼
 React state (itinerary, wallet, activity, black box, pending approval)
        │
        ▼
 UI panels (Plan/Map, Wallet, Network, Activity, Black Box, Evaluation, Assistant)
```

`src/components/WebMCPToolBinding.jsx` renders once per tool and calls the
[`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool) React hook,
which calls `document.modelContext.registerTool()` under the hood — see
[`src/lib/toolSchemas.js`](src/lib/toolSchemas.js) for every tool's exact
`name` / `description` / `inputSchema` / `annotations`. Its `execute` is
wired straight to `engine.callTool`, the same function the built‑in agent
uses. Concretely, in `App.jsx`:

```jsx
{engine.toolDefinitions.map((t) => (
  <WebMCPToolBinding
    key={t.name}
    name={t.name}
    description={TOOL_SCHEMAS[t.name].description}
    inputSchema={TOOL_SCHEMAS[t.name].inputSchema}
    annotations={TOOL_SCHEMAS[t.name].annotations}
    execute={engine.callTool}
    onState={engine.markToolRegistration}
  />
))}
```

which, inside `WebMCPToolBinding`, boils down to exactly the shape the
hackathon brief asks for:

```js
document.modelContext.registerTool({
  name: "search_restaurants",
  description: "Search Busan restaurants by per-person budget, dietary needs, …",
  inputSchema: { /* JSON Schema, see src/lib/toolSchemas.js */ },
  execute: async (input) => engine.callTool("search_restaurants", input),
});
```

### The 12 registered tools

| Tool | Type | Default policy |
| --- | --- | --- |
| `get_weather` | READ | allow |
| `search_places` | READ | allow |
| `search_events` | READ | allow |
| `search_restaurants` | READ | allow |
| `get_place_details` | READ | allow |
| `estimate_cost` | READ | allow |
| `calculate_route` | READ | allow |
| `get_itinerary` | READ | allow |
| `update_itinerary` | WRITE | allow |
| `request_reservation` | SENSITIVE | **ask** (pauses for human approval) |
| `process_payment` | FINANCIAL | **deny, always** (not implemented by design) |
| `update_profile` | PERSONAL | **deny, always** (not implemented by design) |

Every row in the on‑screen **Agent Wallet** maps to one or more of these
tools (`src/lib/constants.js#PERMISSION_ROWS`) and can be toggled between
`allow → ask → deny` live; `process_payment`/`update_profile` are
intentionally not toggleable — they're locked in
[`src/lib/permissions.js`](src/lib/permissions.js) regardless of what the
wallet UI says, because "never trust a single client‑side toggle for
financial/personal‑data actions" (PRD §17).

### Testing the real WebMCP tools

1. Deploy the app (or run `npm run dev`) behind HTTPS or on `localhost`.
2. Open it in a browser/agent host that implements `document.modelContext`
   (for example Chrome Canary with WebMCP enabled, or a ChatGPT‑app browser
   tab with WebMCP support).
3. The **WebMCP Network** panel's dot next to each tool turns green once
   `useWebMCP` successfully registers it — that's a live status, not a
   static label.
4. Ask your agent something like *"Search Busan restaurants near Haeundae
   under ₩20,000 per person"* — it should call `search_restaurants`
   directly, and the result should show up in this page's Agent Black Box in
   real time, because it's the same app state.
5. Try asking it to book something — it should hit the Approve/Reject modal
   here, not silently complete.

If your browser doesn't yet support WebMCP, the **Safe Mode** badge in the
header and the WebMCP Network panel both say so plainly, and the built‑in
agent (goal bar / chat) still drives the whole app end‑to‑end through the
identical tool functions.

### Honest benchmarking, not fabricated numbers

The PRD is explicit that the Human/DOM/WebMCP comparison must use **only
real, measured numbers** (§14) — so the **WebMCP Evaluation** panel doesn't
ship with any. Instead:

- **Mode B (Agent + DOM)** mounts a plain, schema‑less legacy form
  ([`src/components/LegacyFilterUI.jsx`](src/components/LegacyFilterUI.jsx))
  off‑screen and drives it with real `HTMLElement.click()` calls against its
  actual rendered DOM nodes, polling for each next element the way a
  DOM‑scraping agent would have to. Every click is counted by the same
  `onInteract` handler a human would trigger.
- **Mode C (Agent + WebMCP)** runs the real `engine.runAgent()` and counts
  the actual tool calls made and the actual wall‑clock time elapsed up to
  the itinerary being ready (deliberately *excluding* the open‑ended human
  approval wait for the reservation, since that wait is a human‑paced
  control gate, not agent latency — see the comment in
  `useAgentEngine.js#runAgent`).
- **Mode A (human)** is not simulated at all — click **"Try it yourself"**
  and complete the same task in the same legacy form; your own clicks and
  elapsed time are what gets reported.

Any mode you haven't run yet shows `—`, never a placeholder number.

---

## What's simulated vs. what's real (read this before judging)

Being upfront about this matters more to us than looking flashy:

- **Real:** WebMCP tool registration and execution, the permission gate
  (allow/ask/deny), the human‑approval pause and resume, the Agent Black
  Box log, the itinerary planner and route‑time math, the benchmark numbers
  in the Evaluation panel.
- **Simulated, clearly labelled in the UI:** `get_weather` (a deterministic,
  date‑seeded simulator — see `src/lib/weather.js` — instead of a live
  weather API, so the demo needs zero API keys), the natural‑language parser
  (rule‑based, not a hosted LLM, so the whole thing works offline / without
  credentials), and the "restaurant reservation" itself (marked confirmed in
  this app's state; no real booking provider or payment is contacted, by
  design — see PRD §18 Non‑goals).
- **Seed data:** ~25 attractions, 15 restaurants and 8 events, based on real
  Busan places but hand‑curated for this demo (`public/data/*.json`), not a
  live feed. `HELLOBUSAN_TODO.md`'s "100+ each" is the intended production
  scale, not what ships here.

Production, per the PRD, would move weather/city‑data/reservation behind
Cloudflare Workers + D1 + Durable Objects (`docs/HELLOBUSAN_PRD.md` §6–§8) —
this repo intentionally keeps everything client‑side so it's trivially
runnable and auditable for the hackathon.

---

## Project structure

```
public/data/            seed JSON: places, restaurants, events
src/lib/
  constants.js           tool list, permission-row → tool mapping
  toolSchemas.js         WebMCP name/description/inputSchema/annotations
  nlu.js                 goal text → {budget, durationHours, hasChild, rainy, …}
  planner.js             constraint-based itinerary builder + real trimming
  geo.js                 lat/lng → SVG projection, travel-time estimate
  weather.js             deterministic weather simulator
  permissions.js         wallet policy storage + resolution (incl. hard locks)
  data.js                seed-data loading & filtering
  util.js                small helpers (ids, currency, timestamps)
src/hooks/
  useAgentEngine.js      central state + tool implementations + agent runner
src/components/
  WebMCPToolBinding.jsx  registers one tool via use-webmcp-tool
  Header.jsx, AgentWallet.jsx, PlanPanel.jsx, BusanMap.jsx,
  WebMCPNetwork.jsx, AgentActivity.jsx, AgentBlackBox.jsx,
  EvaluationPanel.jsx, LegacyFilterUI.jsx, AgentAssistant.jsx,
  ApprovalModal.jsx
docs/
  HELLOBUSAN_PRD.md, HELLOBUSAN_TODO.md   the original product spec this
                                            repo implements
```

## Roadmap (from the PRD, not yet built here)

- Cloudflare Workers + D1 + Durable Objects backend (multi‑user sessions,
  server‑enforced permissions independent of the client)
- Real weather/maps/reservation provider integrations
- 100+ seeded places/restaurants/events per district
- "Agent Passport" onboarding for local businesses to generate their own
  WebMCP tools (Phase 3), then multi‑city expansion (Phase 4:
  HelloSeoul → HelloKorea)

## License

MIT — see [LICENSE](LICENSE). Third‑party notices for the Apache‑2.0
`use-webmcp-tool` dependency are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
