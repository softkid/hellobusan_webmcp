# HELLOBUSAN --- Agentic Busan / WebMCP PRD

Version: 1.0 · 2026-09-01

## 0. Executive Decision

HelloBusan의 WebMCP 해커톤 제품은 "AI가 부산을 사용한다"가 아니라
**"사람이 원하는 도시 경험을 AI가 부산의 웹서비스를 통해 준비·조정하고,
사람은 권한과 최종 결정을 유지한다"**로 정의한다.

핵심 데모는 여행 추천 자체가 아니다.

> **Human Intent → Agent Planning → WebMCP Tool Orchestration → Human
> Approval → Real-world Outcome**

부산은 제품의 목적지가 아니라 **Agentic Web을 실제 도시 서비스에
적용하는 테스트베드**다.

WebMCP는 브라우저 안에서 사이트가 Agent에게 구조화된 Tool을 제공하는
방식이며, 현재 공식 문서도 사용자 목표, 초기 상태, 시스템 제약, 사용자
확인을 고려한 Tool 설계를 강조한다.

------------------------------------------------------------------------

# 1. Product Definition

## Product

**HELLOBUSAN --- Human-Controlled Agentic City**

### Tagline

**You decide. Your agent acts. Busan responds.**

### One sentence

사람의 자연어 목표를 부산의 장소·문화·교통·예약 서비스에 연결하고,
WebMCP Tool을 통해 Agent가 계획을 실행하되 사용자가 권한과 민감한 행동을
통제하는 도시형 Agent Interface.

### 해커톤에서 증명할 것

1.  WebMCP가 기존 DOM/클릭 기반 Agent보다 구조화된 행동을 제공한다.
2.  여러 부산 서비스가 하나의 Agent 목표를 위해 조합될 수 있다.
3.  사용자가 Agent의 권한 범위를 직접 통제할 수 있다.
4.  민감한 행동은 자동 실행하지 않고 사용자 승인으로 전환된다.
5.  이 패턴이 여행을 넘어 도시 서비스 전체로 확장될 수 있다.

------------------------------------------------------------------------

# 2. Problem

현재 사용자는 부산에서 하나의 목표를 달성하기 위해 여러 서비스를 직접
찾아다녀야 한다.

예: - 장소 검색 - 행사 검색 - 식당 검색 - 교통 확인 - 가격 비교 - 일정
조정 - 예약

기존 AI 여행 플래너는 이 정보를 한 화면에 모으는 데 강하지만, WebMCP의
차별점인 **웹사이트가 Agent에게 명시적인 행동 인터페이스를 제공하는
것**을 충분히 보여주지 못할 수 있다.

따라서 HelloBusan은 여행 UI 자체보다 **Agent가 도시 서비스를 어떻게
사용하고, 인간이 그것을 어떻게 통제하는지**를 제품 핵심으로 둔다.

------------------------------------------------------------------------

# 3. Target Users

## Primary

### 해커톤 심사위원 / 기술 사용자

WebMCP의 필요성과 실제 동작을 한 번에 이해해야 한다.

## Secondary

### 부산 방문자

"오늘 부산에서 무엇을 할까?"를 자연어로 요청하고 결과를 검토한다.

## Future

-   외국인 관광객
-   부산 시민
-   소상공인
-   문화시설
-   관광사업자
-   공공서비스 제공기관

------------------------------------------------------------------------

# 4. Core Experience

## User input

> "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을
> 만들어줘."

## Agent workflow

``` text
USER INTENT
    ↓
Intent / Constraint extraction
    ↓
Permission check
    ↓
WebMCP tool discovery
    ↓
Search / Compare / Route / Cost
    ↓
Itinerary generation
    ↓
Human review
    ↓
Reservation approval
    ↓
Result
```

## Critical principle

### Agent may:

-   search
-   compare
-   calculate
-   draft
-   optimize
-   modify itinerary

### Agent must ask:

-   reservation
-   purchase
-   payment
-   irreversible change

### Agent must never have in MVP:

-   unrestricted payment
-   unrestricted personal-data mutation
-   invisible background actions

------------------------------------------------------------------------

# 5. Why WebMCP?

WebMCP의 핵심은 Agent가 버튼이나 DOM을 추측하는 대신 사이트가 **도구
이름, 설명, JSON Schema, 실행 방법**을 명시한다는 것이다.

HelloBusan은 이를 도시 서비스에 적용한다.

### Before

``` text
Agent
 ↓
DOM inspection
 ↓
find button
 ↓
click
 ↓
wait
 ↓
parse result
 ↓
repeat
```

### After

``` text
Agent
 ↓
search_restaurants({
  area,
  budget,
  dietary
})
 ↓
structured result
```

### Product proof

MVP에는 동일한 시나리오를 - Human UI - Agent + DOM - Agent + WebMCP

세 방식으로 비교하는 Evaluation Panel을 둔다.

실측값만 표시한다.

------------------------------------------------------------------------

# 6. System Architecture

``` text
┌───────────────────────────────────────────────────────────┐
│                     HELLOBUSAN WEB APP                    │
│ React / Vite / TypeScript                                 │
├───────────────────────────────────────────────────────────┤
│ Human UI                                                   │
│ Goal · Map · Timeline · Permission Wallet · Approval      │
├───────────────────────────────────────────────────────────┤
│ WebMCP Layer                                               │
│ search_* · get_* · calculate_* · build_* · reserve_*      │
└───────────────────────┬───────────────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────────────────────────┐
│                 CLOUDFLARE WORKERS                        │
│ API / Auth / Business Logic / WebMCP-backed endpoints     │
├───────────────┬─────────────────────┬─────────────────────┤
│ D1            │ Durable Objects     │ AI                  │
│ city data     │ session / approvals │ intent / planning   │
│ users         │ realtime state      │ classification      │
│ tools         │ agent activity      │                     │
└───────┬───────┴──────────┬──────────┴─────────────────────┘
        │                  │
        ▼                  ▼
  External APIs       Real-time UI
  maps / weather      WebSocket/SSE*
  mock services       activity log
```

\*실시간 통신은 Durable Objects를 사용할 수 있다. Cloudflare는 DO를 상태
저장, 실시간 상호작용, 조정에 적합한 primitive로 제공한다.

------------------------------------------------------------------------

# 7. Cloudflare Stack

## Frontend

**Cloudflare Workers Static Assets + React/Vite**

가능하면 Pages와 별도 구성으로 복잡성을 줄이고, 하나의 Worker에서 정적
자산과 API를 함께 제공한다.

## Backend

**Cloudflare Workers**

역할: - `/api/*` - authentication - permission enforcement - itinerary
API - tool execution - external API proxy - audit logging

## Database

**Cloudflare D1**

테이블: - users - profiles - places - restaurants - experiences -
events - itineraries - itinerary_items - permissions -
tool_definitions - tool_calls - approvals - evaluations

D1은 Workers에서 사용하는 serverless SQL database로 설계한다.

## Stateful session

**Durable Objects**

MVP에서는 `TripSession` 하나를 중심으로: - 현재 itinerary - Agent
activity - approval state - connected client - temporary permission
state

를 관리한다.

## Optional

-   R2: 이미지/지도 스냅샷/리포트
-   Workers AI: intent classification, summarization, ranking
-   Analytics Engine: tool latency / success / error metrics
-   Queues: 장기 실행 작업이 필요해질 때 추가

------------------------------------------------------------------------

# 8. Data Model

## users

``` sql
id TEXT PRIMARY KEY
email TEXT
name TEXT
created_at INTEGER
```

## places

``` sql
id TEXT PRIMARY KEY
name TEXT
category TEXT
district TEXT
lat REAL
lng REAL
price_min INTEGER
price_max INTEGER
tags_json TEXT
languages_json TEXT
open_hours_json TEXT
```

## itineraries

``` sql
id TEXT PRIMARY KEY
user_id TEXT
goal TEXT
budget INTEGER
duration_minutes INTEGER
status TEXT
created_at INTEGER
updated_at INTEGER
```

## permissions

``` sql
user_id TEXT
tool_name TEXT
policy TEXT -- allow | ask | deny
daily_limit INTEGER
created_at INTEGER
updated_at INTEGER
PRIMARY KEY(user_id, tool_name)
```

## approvals

``` sql
id TEXT PRIMARY KEY
user_id TEXT
tool_name TEXT
payload_json TEXT
status TEXT -- pending | approved | rejected | expired
created_at INTEGER
resolved_at INTEGER
```

## tool_calls

``` sql
id TEXT PRIMARY KEY
session_id TEXT
tool_name TEXT
input_json TEXT
output_json TEXT
permission TEXT
status TEXT
latency_ms INTEGER
created_at INTEGER
```

------------------------------------------------------------------------

# 9. WebMCP Tool Contract

MVP Tool Set: 10 tools

### READ

1.  `search_places`
2.  `search_restaurants`
3.  `search_events`
4.  `get_place_details`
5.  `calculate_route`
6.  `estimate_cost`
7.  `get_weather`
8.  `get_itinerary`

### WRITE

9.  `update_itinerary`

### SENSITIVE

10. `request_reservation`

`request_reservation`은 직접 결제가 아니라 **예약 승인 요청**까지를 MVP
범위로 한다.

------------------------------------------------------------------------

# 10. Tool Permission Matrix

  Tool                  Type        Default
  --------------------- ----------- -------------------
  search_places         READ        ALLOW
  search_restaurants    READ        ALLOW
  search_events         READ        ALLOW
  get_place_details     READ        ALLOW
  calculate_route       READ        ALLOW
  estimate_cost         READ        ALLOW
  get_weather           READ        ALLOW
  get_itinerary         READ        ALLOW
  update_itinerary      WRITE       ALLOW
  request_reservation   SENSITIVE   ASK
  payment               FINANCIAL   DENY / not in MVP
  profile mutation      PERSONAL    DENY / not in MVP

------------------------------------------------------------------------

# 11. Permission Wallet UX

``` text
AGENT WALLET

You stay in control.

Search              ALLOW
Compare             ALLOW
Route               ALLOW
Schedule            ALLOW
Reservation         ASK
Payment             DENY
Profile             DENY

Daily spending limit
₩50,000
```

권한은 서버에서도 반드시 검증한다.

UI에서만 잠그는 것은 보안 경계로 인정하지 않는다.

------------------------------------------------------------------------

# 12. Main Screens

## Screen 01 --- Goal

자연어 입력

## Screen 02 --- Agent Working

Tool 호출 과정과 진행률

## Screen 03 --- City Workspace

지도 + 일정 + 장소

## Screen 04 --- Agent Wallet

권한 정책

## Screen 05 --- Approval

예약 등 민감 행동 승인

## Screen 06 --- Agent Black Box

Tool call / input / output / reason / permission / impact

## Screen 07 --- WebMCP Evaluation

Human vs DOM Agent vs WebMCP

------------------------------------------------------------------------

# 13. Agent Black Box

모든 Tool Call을 기록한다.

``` text
14:02:11 search_places
12 results

14:02:13 search_restaurants
8 results

14:02:15 calculate_route
4 routes

14:02:18 update_itinerary
3 activities removed

14:02:21 request_reservation
USER APPROVAL REQUIRED
```

Tool 상세:

``` text
INPUT
OUTPUT
PERMISSION
STATUS
LATENCY
IMPACT
```

"AI가 무엇을 했는지"를 사용자가 볼 수 있게 한다.

------------------------------------------------------------------------

# 14. Evaluation

동일한 사용자 목표를 세 방식으로 실행한다.

### Mode A

Human UI

### Mode B

Agent + DOM

### Mode C

Agent + WebMCP

측정:

-   steps
-   interactions
-   tool calls
-   errors
-   completion time
-   task completion rate

중요: **임의의 70%, 85% 같은 숫자를 미리 넣지 않는다. 실제 테스트 결과만
공개한다.**

------------------------------------------------------------------------

# 15. MVP Demo Scenario

### Prompt

> "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을
> 만들어줘."

### Expected sequence

``` text
get_weather
↓
search_places
↓
search_events
↓
search_restaurants
↓
estimate_cost
↓
calculate_route
↓
update_itinerary
↓
request_reservation
↓
HUMAN APPROVAL
```

### Final screen

``` text
YOUR AGENT USED 7 BUSAN SERVICES

✓ Weather checked
✓ 12 places searched
✓ 8 restaurants compared
✓ 4 routes calculated
✓ Budget optimized
✓ Itinerary created

⚠ Reservation requires approval
🔒 Payment was never accessible

YOU STAYED IN CONTROL.
```

------------------------------------------------------------------------

# 16. Business Expansion

## Phase 1

HelloBusan 자체 서비스

## Phase 2

부산 관광/문화사업자 Agent-ready onboarding

## Phase 3

소상공인 Agent Passport

사업자가: - 메뉴 - 영업시간 - 예약 - 가격 - 정책

을 입력하면 WebMCP Tool을 생성.

## Phase 4

다른 도시 확장

``` text
HelloBusan
 ↓
HelloSeoul
 ↓
HelloKorea
 ↓
Agent-ready City Network
```

------------------------------------------------------------------------

# 17. Security

## 원칙

### Never trust the client

권한 검사는 Worker에서 수행.

### Sensitive actions

예약/결제 등은 approval record 생성 후 실행.

### Audit

모든 Tool Call을 기록.

### Origin

WebMCP는 secure origin 및 permission policy 조건을 고려한다.

### Cross-origin

외부 서비스 Tool 연결은 명시적으로 허용된 origin만 사용한다.

------------------------------------------------------------------------

# 18. Non-goals

MVP에서 하지 않는다.

-   실제 결제
-   실제 개인정보 변경
-   무제한 자율 Agent
-   전국 서비스
-   메타버스
-   완성형 OTA
-   모든 부산 사업자 연동
-   복잡한 회원/포인트 시스템

**해커톤에서는 WebMCP의 가치 증명에 집중한다.**

------------------------------------------------------------------------

# 19. Success Metrics

## Product

-   목표 입력 → 계획 생성 성공률
-   사용자의 승인/거부 성공률
-   itinerary completion rate

## WebMCP

-   Tool discovery 성공률
-   Tool execution success rate
-   평균 latency
-   오류율
-   DOM 대비 interaction 감소

## Demo

-   3분 이내 전체 시나리오 재현
-   심사위원이 WebMCP의 역할을 30초 내 이해
-   권한 정책을 10초 내 이해

------------------------------------------------------------------------

# 20. Hackathon Story

### 01 Problem

"AI는 정보를 잘 찾지만 현실의 웹서비스를 안정적으로 조작하기 어렵다."

### 02 Technology

"WebMCP는 웹사이트가 Agent에게 명시적인 행동 계약을 제공한다."

### 03 Human

"하지만 행동할수록 인간의 통제권이 중요해진다."

### 04 Solution

"HelloBusan은 WebMCP + Agent Permission + Human Approval을 결합한다."

### 05 Proof

"동일한 부산 업무를 Human / DOM Agent / WebMCP로 측정한다."

### 06 Future

"부산에서 시작해 Agent-ready City Network로 확장한다."

------------------------------------------------------------------------

# 21. Final Product Statement

> **HelloBusan is not an AI travel planner.**
>
> **It is a human-controlled interface between AI agents and the real
> services of a city.**

한국어:

> **HelloBusan은 여행을 대신 계획하는 AI가 아니라, 사람이 허용한 범위
> 안에서 AI가 도시의 웹서비스를 사용할 수 있게 만드는 새로운 도시
> 인터페이스다.**
