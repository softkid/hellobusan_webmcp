# HELLOBUSAN — Human-Controlled Agentic City WebMCP Implementation Plan

HelloBusan is a flagship hackathon application demonstrating how AI Agents interact with city services (places, restaurants, events, routes, weather, reservations) using WebMCP tools while keeping humans strictly in control through an **Agent Permission Wallet** and **Human-in-the-Loop Approval**.

Modeled after `demos/analytics-dashboard` (React 19 + Vite + `use-webmcp-tool`), HelloBusan implements all requirements from `HELLOBUSAN_PRD.md`, `HELLOBUSAN_TODO.md`, and `concept.md` to maximize evaluation scores across all hackathon judging criteria.

---

## Key Features & Architecture

1. **WebMCP 10-Tool Registration System (`use-webmcp-tool`)**:
   - **READ**: `search_places`, `search_restaurants`, `search_events`, `get_place_details`, `calculate_route`, `estimate_cost`, `get_weather`, `get_itinerary`
   - **WRITE**: `update_itinerary`
   - **SENSITIVE**: `request_reservation` (triggers Human Approval dialog)

2. **Agent Permission Wallet (Human Control Layer)**:
   - Configurable permission policy per tool (`ALLOW`, `ASK`, `DENY`).
   - Daily budget spending limit (default ₩50,000, slider adjustable).
   - Real-time client & server-side policy enforcement during agent tool execution.

3. **Agent Black Box (Audit Trail)**:
   - Full timeline log of every tool call made by the Agent.
   - Shows timestamp, parameters, output JSON, permission policy checked, latency (ms), and rationale for choice.

4. **Human Approval Flow**:
   - Interactive dialog modal popping up when sensitive actions (`request_reservation` or budget exceeding limit) are triggered.
   - Displays reservation details (venue name, party size, time, cost) for one-click approval/rejection.

5. **WebMCP Benchmark / Battle Dashboard**:
   - Side-by-side evaluation comparison: **Human UI** vs **Agent + DOM Actuation** vs **Agent + WebMCP**.
   - Empirical metrics: tool calls, steps, latency, DOM errors, and task completion rate.

6. **Interactive Busan City Map & Timeline Workspace**:
   - Leaflet interactive map with dark theme tiles (`CartoDB Dark Matter`).
   - Busan district pins (Haeundae, Gwangalli, Seomyeon, Nampo, Centum, Osiria, etc.), rainy-day markers, and animated itinerary polylines.
   - 6-Hour Itinerary Timeline with cost breakdown, weather indicators, and category tags.

7. **Natural Language Goal & Agent Execution Engine**:
   - Handles natural language prompts (e.g., *"오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을 만들어줘"*).
   - Step-by-step agent planner executing real WebMCP tools, streaming activity logs, checking wallet policies, and requesting human approval.

---

## User Review Required

> [!IMPORTANT]
> - **Tech Stack**: Uses React 19, Vite, Vanilla CSS design tokens (Dark Glassmorphism), and `use-webmcp-tool` (^0.2.0), exactly matching `demos/analytics-dashboard`.
> - **Location**: All source code will be generated inside [demos/hellobusan](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan).

---

## Proposed Changes

### `demos/hellobusan`

#### [NEW] [package.json](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/package.json)
Configures dependencies (`react`, `react-dom`, `use-webmcp-tool`, `leaflet`, `lucide-react`, `vite`).

#### [NEW] [vite.config.js](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/vite.config.js)
Vite configuration with `@vitejs/plugin-react`.

#### [NEW] [index.html](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/index.html)
HTML shell with Google Fonts (Outfit / Inter) and Leaflet CSS CDN link.

#### [NEW] [src/index.css](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/index.css)
Cyberpunk/Dark Busan Design System, styling CSS variables, glassmorphic cards, glowing status indicators, and responsive grid layouts.

#### [NEW] [src/data/mockBusanData.js](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/data/mockBusanData.js)
Comprehensive dataset of Busan places (museums, aquariums, parks, indoor playgrounds), restaurants (gukbap, seafood, kids-friendly cafes), cultural events, weather reports, and transport routes with realistic coordinates and price attributes.

#### [NEW] [src/constants/webmcpConfig.js](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/constants/webmcpConfig.js)
Tool definitions, JSON schemas, default permissions matrix, and sample prompts for hackathon scenarios.

#### [NEW] [src/hooks/useHelloBusanMCP.js](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/hooks/useHelloBusanMCP.js)
React hook wrapping `useWebMCP` from `use-webmcp-tool` to expose all 10 HelloBusan tools to the browser's WebMCP environment.

#### [NEW] [src/services/agentEngine.js](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/services/agentEngine.js)
Agent execution engine that parses user goals, checks permission policies, invokes WebMCP tools sequentially, logs black box events, and handles approval breaks.

#### [NEW] [src/components/Header.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/Header.jsx)
App header with branding tagline ("You decide. Your agent acts. Busan responds."), WebMCP tool connection count, and demo reset control.

#### [NEW] [src/components/GoalInput.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/GoalInput.jsx)
Natural language prompt input box with preset hackathon scenarios (Rainy day family trip, couples night out, budget foodie tour).

#### [NEW] [src/components/AgentWallet.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/AgentWallet.jsx)
Permission Wallet card allowing users to configure tool policies (`ALLOW`, `ASK`, `DENY`) and set daily budget limits in real time.

#### [NEW] [src/components/BusanMap.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/BusanMap.jsx)
Interactive Leaflet map displaying Busan places, filtered search results, active itinerary pins, and route paths.

#### [NEW] [src/components/ItineraryView.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/ItineraryView.jsx)
Interactive timeline display of the planned 6-hour itinerary with weather warnings, cost summaries, duration counters, and venue details.

#### [NEW] [src/components/BlackBoxLog.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/BlackBoxLog.jsx)
Live audit log of Agent actions detailing tool calls, inputs, outputs, execution latency, permission policy checks, and agent reasoning.

#### [NEW] [src/components/ApprovalModal.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/ApprovalModal.jsx)
Pop-up modal requesting user approval when the Agent attempts a sensitive action (`request_reservation` or high budget consumption).

#### [NEW] [src/components/WebMCPBenchmark.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/WebMCPBenchmark.jsx)
Comparison benchmark panel showcasing empirical performance data across Human UI, DOM-based Agent, and WebMCP Agent.

#### [NEW] [src/components/AgentNetworkPanel.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/components/AgentNetworkPanel.jsx)
Visualizing Busan's 10 WebMCP tool ecosystem and real-time registered status.

#### [NEW] [src/App.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/App.jsx)
Main dashboard container integrating all panels, state management, and WebMCP hook invocation.

#### [NEW] [src/main.jsx](file:///d:/해커톤/webmcp-tools-main/webmcp-tools-main/demos/hellobusan/src/main.jsx)
React app entry point.

---

## Verification Plan

### Automated Build & Lint Check
- Run `npm install` inside `demos/hellobusan`.
- Execute `npm run build` to verify standard TypeScript/JSX compilation with zero errors.

### Manual Verification
- Test natural language goal execution ("오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을 만들어줘").
- Verify that WebMCP tools execute in sequence, stream logs to Black Box, update BusanMap and ItineraryView.
- Confirm `request_reservation` triggers ApprovalModal for user confirmation.
- Check Agent Wallet toggles (`ALLOW` -> `ASK` -> `DENY`) and budget sliders enforce real-time restrictions.
- Test WebMCP Benchmark tab to display live side-by-side execution metrics.
