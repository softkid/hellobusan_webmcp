# HELLOBUSAN --- WebMCP Hackathon TODO

Version: 1.0 · 2026-09-01

## P0 --- 반드시 데모 전에 완료

### 1. Repository / Cloudflare

-   [ ] GitHub repository 생성
-   [ ] Cloudflare Worker 프로젝트 생성
-   [ ] React/Vite frontend 연결
-   [ ] Wrangler local dev 환경 구성
-   [ ] production domain `hellobusan.*` 연결
-   [ ] environment 분리: local / staging / production
-   [ ] secrets 관리 방식 확정

### 2. D1

-   [ ] D1 database 생성
-   [ ] migration 구성
-   [ ] `users`
-   [ ] `places`
-   [ ] `restaurants`
-   [ ] `events`
-   [ ] `itineraries`
-   [ ] `itinerary_items`
-   [ ] `permissions`
-   [ ] `approvals`
-   [ ] `tool_definitions`
-   [ ] `tool_calls`
-   [ ] `evaluations`
-   [ ] seed data 삽입

### 3. Durable Object

-   [ ] `TripSession` 클래스 구현
-   [ ] session state 정의
-   [ ] approval state 관리
-   [ ] agent activity stream 관리
-   [ ] reconnect 처리
-   [ ] TTL/cleanup 정책

### 4. WebMCP

-   [ ] WebMCP feature detection
-   [ ] local Chrome testing flag/origin trial 확인
-   [ ] `search_places`
-   [ ] `search_restaurants`
-   [ ] `search_events`
-   [ ] `get_place_details`
-   [ ] `calculate_route`
-   [ ] `estimate_cost`
-   [ ] `get_weather`
-   [ ] `get_itinerary`
-   [ ] `update_itinerary`
-   [ ] `request_reservation`
-   [ ] 각 Tool JSON Schema 검증
-   [ ] readOnly / write annotation 검토
-   [ ] toolchange 대응
-   [ ] tool inspector로 등록 상태 확인

### 5. Permission Wallet

-   [ ] allow / ask / deny 모델 구현
-   [ ] 사용자별 정책 저장
-   [ ] server-side enforcement
-   [ ] reservation = ASK
-   [ ] payment = DENY
-   [ ] profile mutation = DENY
-   [ ] daily spending limit
-   [ ] permission 변경 audit

### 6. Approval

-   [ ] pending approval 생성
-   [ ] approval modal
-   [ ] 승인
-   [ ] 거절
-   [ ] 만료
-   [ ] 승인 후 action 재개
-   [ ] 승인되지 않은 tool 실행 차단

### 7. Agent Black Box

-   [ ] 모든 tool call 기록
-   [ ] timestamp
-   [ ] input
-   [ ] output
-   [ ] permission
-   [ ] status
-   [ ] latency
-   [ ] impact
-   [ ] 화면 timeline 구현

### 8. Main UX

-   [ ] Goal input
-   [ ] Agent Working
-   [ ] Map
-   [ ] Timeline
-   [ ] Agent Wallet
-   [ ] Approval
-   [ ] Black Box
-   [ ] WebMCP Evaluation
-   [ ] mobile fallback
-   [ ] Korean/English labels

------------------------------------------------------------------------

# P1 --- 해커톤 완성도

### City Data

-   [ ] 부산 구/군 기본 데이터
-   [ ] 관광지 seed 100+
-   [ ] 식당 seed 100+
-   [ ] 문화행사 seed 50+
-   [ ] 체험 seed 50+
-   [ ] 좌표 검증
-   [ ] 운영시간 데이터
-   [ ] 가격 범위
-   [ ] 태그
-   [ ] 어린이 친화성
-   [ ] 우천 대응 여부

### Agent Planning

-   [ ] 자연어 goal parser
-   [ ] budget extraction
-   [ ] duration extraction
-   [ ] family/child extraction
-   [ ] weather constraint
-   [ ] dietary constraint
-   [ ] route optimization
-   [ ] budget optimization
-   [ ] itinerary ranking

### Demo APIs

-   [ ] weather mock/API
-   [ ] map/route mock/API
-   [ ] reservation mock
-   [ ] restaurant service
-   [ ] culture service
-   [ ] transport service

------------------------------------------------------------------------

# P2 --- WebMCP Benchmark

## Test scenario

Prompt: "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할
일을 만들어줘."

### Human

-   [ ] steps 측정
-   [ ] interaction 측정
-   [ ] completion time
-   [ ] errors

### DOM Agent

-   [ ] steps
-   [ ] interaction
-   [ ] completion time
-   [ ] errors

### WebMCP Agent

-   [ ] tool calls
-   [ ] interaction
-   [ ] completion time
-   [ ] errors
-   [ ] completion rate

### Dashboard

-   [ ] side-by-side comparison
-   [ ] actual measurements only
-   [ ] no fabricated performance claims

------------------------------------------------------------------------

# P3 --- Visual Polish

-   [ ] dark premium UI
-   [ ] Agent Wallet left panel
-   [ ] central Busan map
-   [ ] WebMCP Network right panel
-   [ ] bottom Activity
-   [ ] Black Box
-   [ ] Evaluation
-   [ ] Agent Assistant
-   [ ] bilingual typography
-   [ ] responsive layout
-   [ ] loading states
-   [ ] error states
-   [ ] empty states
-   [ ] approval animations
-   [ ] tool execution animations

------------------------------------------------------------------------

# P4 --- Security / Reliability

-   [ ] server-side permission enforcement
-   [ ] input validation
-   [ ] schema validation
-   [ ] rate limiting
-   [ ] audit log
-   [ ] sensitive payload redaction
-   [ ] CSRF / origin policy review
-   [ ] secure headers
-   [ ] WebMCP permissions policy
-   [ ] cross-origin exposure review
-   [ ] no payment capability in MVP
-   [ ] mock reservation only

------------------------------------------------------------------------

# P5 --- Deployment

-   [ ] `wrangler dev`
-   [ ] preview deployment
-   [ ] staging Worker
-   [ ] D1 migration staging
-   [ ] production D1
-   [ ] production Worker
-   [ ] custom domain
-   [ ] HTTPS
-   [ ] smoke test
-   [ ] WebMCP browser test
-   [ ] tool inspector test
-   [ ] demo reset endpoint
-   [ ] seed/reset script

------------------------------------------------------------------------

# P6 --- Presentation

## 3-minute demo

-   [ ] 0:00 Problem
-   [ ] 0:20 Human goal
-   [ ] 0:40 Agent starts
-   [ ] 1:00 WebMCP tools appear
-   [ ] 1:20 itinerary generated
-   [ ] 1:40 reservation approval
-   [ ] 2:00 Black Box
-   [ ] 2:20 WebMCP benchmark
-   [ ] 2:45 future
-   [ ] 3:00 closing line

## Closing line

> You decide. Your agent acts. Busan responds.

------------------------------------------------------------------------

# P7 --- Optional Post-Hackathon

-   [ ] Agent Passport for local businesses
-   [ ] merchant onboarding
-   [ ] automatic WebMCP tool generation
-   [ ] business dashboard
-   [ ] tool analytics
-   [ ] Agent discovery directory
-   [ ] HelloSeoul
-   [ ] HelloKorea
-   [ ] international city network
-   [ ] real booking integrations
-   [ ] payment with explicit authorization architecture

------------------------------------------------------------------------

# Definition of Done

MVP is DONE when:

1.  User enters one natural-language goal.
2.  Agent calls at least 5 real WebMCP tools.
3.  Tools operate on the same visible application state.
4.  User can inspect every tool call.
5.  User can change Agent permissions.
6.  Reservation requires explicit approval.
7.  Payment cannot be executed.
8.  Result is visible on map + itinerary.
9.  Tool calls are persisted.
10. The same task can be benchmarked against Human / DOM Agent / WebMCP.
11. Application deploys to Cloudflare.
12. Demo can be reset and repeated reliably.
