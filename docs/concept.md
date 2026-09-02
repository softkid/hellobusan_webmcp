좋습니다. 지금까지의 논의를 한 단계 더 밀어붙이면 **“부산 여행 앱” 자체를 만드는 것은 버리는 게 맞습니다.**

특히 2026년 8월 기준 WebMCP의 공식 방향은 **웹사이트가 Agent에게 명시적인 Tool을 제공하고, 브라우저가 이를 중재하며, 사용자가 필요한 순간에 확인·개입하는 구조**입니다. 즉 “Agent가 인간을 대신해 무조건 실행한다”가 핵심이 아닙니다. ([Chrome for Developers][1])

그래서 제가 해커톤이라면 **“WebMCP를 이용한 여행 서비스”가 아니라 WebMCP 때문에만 가능한 새로운 문제**를 찾겠습니다.

아래 5개는 그 관점에서 완전히 새로 설계한 것입니다.

---

# 먼저 5개를 한눈에 보면

| 아이디어                                          | 핵심 질문                   | 심사위원 충격도 | 구현 난이도 | 추천 |
| --------------------------------------------- | ----------------------- | -------: | -----: | -: |
| **① Agent 권한지갑 — Agent Wallet**               | AI에게 어디까지 맡길 것인가?       |    ★★★★★ |   ★★★★ | 🥇 |
| **② 부산 Agent City — 도시 전체를 Tool로**            | AI가 여러 웹을 어떻게 연결하는가?    |    ★★★★★ |   ★★★★ | 🥇 |
| **③ Agent Black Box — AI 행동의 블랙박스**           | AI가 왜 이렇게 행동했는가?        |    ★★★★★ |    ★★★ | 🥈 |
| **④ WebMCP Battle — 인간 vs Agent vs DOM**      | WebMCP가 실제로 얼마나 좋은가?    |    ★★★★★ |    ★★★ | 🥈 |
| **⑤ 부산 Agent Passport — 모든 가게를 Agent-Ready로** | 소상공인도 AI 시대에 참여할 수 있는가? |    ★★★★☆ |   ★★★★ | 🥉 |

그런데 중요한 건 **5개를 단순 아이디어로 끝내지 않는 것**입니다.

---

# ① AGENT WALLET

## “AI에게 돈이 아니라 권한을 지갑처럼 준다”

제가 가장 추천합니다.

### 핵심 아이디어

사람이 AI에게:

> “부산 여행을 알아서 준비해줘.”

라고 말합니다.

하지만 AI에게 **무제한 권한을 주지 않습니다.**

사람이 Agent Wallet을 설정합니다.

```text
┌─────────────────────────────────┐
│       MY AGENT WALLET           │
├─────────────────────────────────┤
│                                 │
│ 🔍 Search              ALLOW    │
│ 🗺 Route               ALLOW    │
│ 📅 Change itinerary    ALLOW    │
│ 🎫 Check availability  ALLOW    │
│                                 │
│ 🛎 Reservation         ASK      │
│ 💳 Payment             DENY     │
│ 📍 Location            DENY     │
│                                 │
│ Daily limit           ₩50,000   │
│                                 │
└─────────────────────────────────┘
```

그런데 이것은 단순한 설정 화면이 아닙니다.

**Agent가 실제 Tool을 호출할 때 이 권한이 적용됩니다.**

---

## 심사위원에게 보여줄 장면

사용자:

> “오늘 부산에서 아이와 놀 수 있는 곳을 찾아줘. 5만원 이하.”

Agent:

```text
search_places()
✓

search_events()
✓

calculate_route()
✓

estimate_cost()
✓

reserve()
⚠ USER APPROVAL REQUIRED

payment()
🔒 BLOCKED
```

사용자가:

> **“예약 허용”**

을 누릅니다.

그러면:

```text
reserve()
       ↓
예약 확인
       ↓
HUMAN APPROVAL
       ↓
완료
```

---

## 여기서 중요한 철학

**AI의 자율성을 극대화하는 것이 목표가 아닙니다.**

> ### 인간이 AI의 자율성 범위를 설계한다.

이게 핵심입니다.

WebMCP는 실제로 민감한 작업에서 사용자 상호작용과 확인을 요청할 수 있도록 설계되어 있습니다. 공식 예시에서도 구매 Tool 실행 전에 `requestUserInteraction()`을 통해 사용자 확인을 받습니다. ([Web Machine Learning][2])

따라서 이것은 WebMCP의 **permission + human-in-the-loop** 특성을 제품의 핵심 경험으로 끌어올린 겁니다.

### 한 줄

> **“AI에게 자유를 주는 것이 아니라, 내가 자유의 범위를 정한다.”**

이건 꽤 강합니다.

---

# ② AGENTIC BUSAN CITY

## “부산 하나의 웹사이트가 아니라 부산 전체가 Agent Interface가 된다”

이건 **비주얼 임팩트가 가장 큽니다.**

여행 앱 하나를 만들지 않습니다.

대신 가짜로라도 부산의 여러 서비스를 만듭니다.

```text
             AGENT
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
    식당웹    문화웹    교통웹
     MCP       MCP       MCP
       ↓        ↓        ↓
    예약       티켓      이동
       └────────┼────────┘
                ↓
             BUSAN
```

예를 들어 데모에서 6개 웹사이트를 만들어버립니다.

### Busan WebMCP Network

* 부산 음식점
* 부산 공연
* 부산 전시
* 부산 체험
* 부산 교통
* 부산 관광
* 부산 숙소

각각 독립적인 WebMCP Tool을 제공합니다.

---

## 그리고 사용자가 한 문장만 합니다.

> **“오늘 저녁 6시부터 10시까지 부산에서 여자친구와 데이트해줘. 10만원 이하.”**

Agent가:

```text
Culture MCP
↓
Exhibition

Restaurant MCP
↓
Dinner

Transport MCP
↓
Route

Experience MCP
↓
Night activity
```

를 조합합니다.

---

## 여기서 중요한 장면

각 웹사이트가 Agent에게:

```text
Restaurant
● search
● check_availability
● reserve

Museum
● search_exhibitions
● check_ticket

Transport
● calculate_route
```

를 각각 공개합니다.

그리고 화면 중앙에:

# **BUSAN AGENT NETWORK**

가 뜹니다.

```text
6 Websites
18 WebMCP Tools
1 Human Goal

          ↓

      AGENT
```

이건 심사위원이 **“아, WebMCP를 이해했구나”**라고 느끼게 만들 수 있습니다.

공식 WebMCP도 사이트가 Tool을 등록하고, 브라우저가 이를 Agent에게 제공하는 구조를 핵심으로 합니다. ([Chrome for Developers][3])

### 한 줄

> **“우리는 부산 여행 사이트를 만든 것이 아니라, 부산의 웹을 Agent가 사용할 수 있는 네트워크로 만들었다.”**

---

# ③ AGENT BLACK BOX

## “AI가 무엇을 했는지가 아니라, 왜 그렇게 했는지를 보여준다”

이건 의외로 굉장히 강한 아이디어입니다.

사람이 AI에게 일을 시키면 결과만 나옵니다.

그런데 문제가 있습니다.

> **“왜 이 식당을 골랐지?”**

> **“왜 이 경로를 선택했지?”**

> **“왜 이 예약은 나한테 승인을 요청했지?”**

그래서 Agent의 모든 WebMCP 행동을 **Black Box처럼 기록**합니다.

---

## 화면

```text
AGENT BLACK BOX

USER
"5만원 이하로 부산 하루 여행 만들어줘"

        ↓

14:02:11
search_places
reason:
"사용자 조건에 local + budget 적용"

        ↓

14:02:13
search_restaurants
reason:
"점심 필요"

        ↓

14:02:15
calculate_route
reason:
"도보 이동 최소화"

        ↓

14:02:18
remove_activity
reason:
"예산 초과"

        ↓

14:02:21
reserve_restaurant

⚠ USER APPROVAL
```

그리고 각 Tool을 클릭하면:

```text
INPUT
OUTPUT
CURRENT STATE
USER PERMISSION
AGENT DECISION
```

을 보여줍니다.

---

## 이걸 왜 부산에서 하느냐?

부산은 단순한 데이터셋입니다.

실제로:

```text
식당
공연
관광
교통
예약
```

이라는 복합적인 Tool chain을 보여주기 좋습니다.

### 심사위원에게 던지는 질문

> **“AI가 현실세계에서 행동하기 시작한다면 우리는 AI의 행동을 얼마나 투명하게 볼 수 있어야 할까요?”**

이건 단순 여행 앱보다 훨씬 깊습니다.

---

# ④ WEBMCP BATTLE

## “WebMCP가 진짜 더 좋은지 직접 실험한다”

이건 **기술 심사위원을 잡는 아이디어**입니다.

앱을 예쁘게 만드는 대신 아예 실험장을 만듭니다.

동일한 업무를 세 가지 방식으로 실행합니다.

---

## MODE A

### Human UI

```text
클릭
↓
검색
↓
필터
↓
예약
```

---

## MODE B

### Agent + DOM

```text
페이지 분석
↓
버튼 탐색
↓
입력
↓
클릭
↓
검증
```

---

## MODE C

### Agent + WebMCP

```text
Tool discovery
↓
structured arguments
↓
tool call
↓
result
```

그리고 실제로 비교합니다.

```text
                DOM       WebMCP

Tool calls       17          5
Steps            31          9
Errors            4          0
Time            42s        11s
```

물론 **실제 측정값으로만 표시**해야 합니다.

---

## 심사위원에게

> “WebMCP가 좋다고 주장하지 않습니다.”

> **“같은 일을 실제로 시켜봤습니다.”**

이게 강합니다.

WebMCP 공식 문서도 DOM을 Agent가 해석하며 수행하는 actuation보다, 사이트가 목적과 입력 스키마를 명시적으로 제공하는 방식이 더 신뢰성 있고 효율적일 수 있다고 설명합니다. ([Chrome for Developers][1])

즉 우리가 **WebMCP의 필요성을 직접 증명하는 benchmark**를 만드는 겁니다.

### 한 줄

> **“WebMCP가 왜 필요한지 설명하지 않고, 직접 측정해서 보여준다.”**

---

# ⑤ AGENT PASSPORT

## “부산의 모든 소상공인이 10분 만에 AI Agent에게 서비스를 제공한다”

이건 사업화까지 생각한다면 가장 좋습니다.

현재 AI 시대의 문제는:

> 대기업은 API가 있다.

> 작은 가게는 API가 없다.

입니다.

예를 들어 부산의 작은 식당 사장님이 있습니다.

기존:

```text
웹사이트
전화번호
메뉴
예약 버튼
```

여기에는 Agent가 사용할 수 있는 명시적 인터페이스가 없습니다.

---

# Agent Passport

가게가 간단한 정보를 입력합니다.

```text
가게 이름
영업시간
메뉴
가격
예약 가능 여부
언어
주차
반려동물
```

그리고:

# **“Make my business Agent-ready”**

를 누릅니다.

그러면 시스템이:

```text
search()
get_details()
check_availability()
reserve()
```

같은 WebMCP Tool을 자동 생성합니다.

---

## 그러면 AI가

> “부산에서 4명이 갈 수 있는 해산물 식당을 찾아줘.”

라고 했을 때,

Agent Passport를 가진 작은 식당들이 검색 대상이 됩니다.

---

# 이 아이디어의 진짜 무서운 부분

이것은 관광 플랫폼이 아닙니다.

**소상공인을 Agentic Web에 편입시키는 인프라**입니다.

```text
         AI Agent
             ↓
      Agent Discovery
             ↓
 ┌─────────────────────┐
 │ Agent-ready Business│
 ├─────────────────────┤
 │ Restaurant          │
 │ Cafe                │
 │ Hotel               │
 │ Museum              │
 │ Shop                │
 │ Experience          │
 └─────────────────────┘
```

부산에서 시작하지만:

```text
Busan
 ↓
Korea
 ↓
Global Local Business
```

로 확장됩니다.

### 한 줄

> **“API를 만들 돈이 없는 작은 가게도 AI 시대의 서비스 제공자가 될 수 있게 한다.”**

---

# 그런데 5개 중 제가 고른다면

저는 단순히 하나를 고르지 않고 **① + ② + ④를 결합**하겠습니다.

이렇게 됩니다.

# **AGENTIC BUSAN**

## Human-Controlled Agent City

그리고 세 가지 층을 만듭니다.

```text
                    HUMAN
                      │
                      ▼
             ┌────────────────┐
             │  AGENT WALLET  │
             │                │
             │ What may AI do?│
             └───────┬────────┘
                     ↓
                  AGENT
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     Food MCP     Culture MCP   Transit MCP
        ↓            ↓            ↓
     Restaurant     Museum       Subway
        └────────────┼────────────┘
                     ↓
              REAL BUSAN WEB
                     │
                     ▼
              HUMAN APPROVAL
```

그리고 오른쪽에 작은 패널을 둡니다.

```text
WEBMCP EVAL

Human UI        31 steps
DOM Agent       17 steps
WebMCP Agent     5 steps

↓ 70% fewer interactions
```

**이렇게 하면 제품 + 기술 + 미래성 + 인간성까지 한 번에 잡힙니다.**

---

# 그런데 제가 더 중요하게 보는 것은 “부산”을 어떻게 정의하느냐입니다.

지금까지는:

> **부산 = 여행 데이터**

였습니다.

이것을 버립니다.

---

## 새로운 정의

# 부산 = AI가 현실세계와 상호작용하는 테스트베드

그래서 화면도 여행 앱처럼 시작할 필요가 없습니다.

첫 화면을 이렇게 만들 수 있습니다.

---

```text
        AGENTIC BUSAN

     THE CITY IS YOUR INTERFACE.

──────────────────────────────────

What do you want to do?

┌──────────────────────────────────┐
│                                  │
│ "오늘 부산에서 5만원으로          │
│  아이와 놀고 싶어."               │
│                                  │
└──────────────────────────────────┘

          [ LET MY AGENT WORK ]

──────────────────────────────────

        AGENT PERMISSIONS

Search          ✓
Compare         ✓
Route           ✓
Schedule        ✓
Reservation     ASK
Payment         LOCKED

──────────────────────────────────

        WEBMCP NETWORK

  🍜 Food     🎭 Culture     🚇 Transit
      ●            ●             ●

        18 TOOLS AVAILABLE

──────────────────────────────────
```

이게 훨씬 좋습니다.

---

# 그리고 데모의 마지막 장면이 중요합니다

Agent가 일을 끝낸 뒤 단순히:

> “여행 일정이 완성되었습니다.”

라고 하지 않습니다.

화면에:

# **YOUR AGENT USED 7 BUSAN SERVICES**

가 뜹니다.

```text
✓ Found 12 places
✓ Compared 8 restaurants
✓ Calculated 4 routes
✓ Removed 3 expensive options
✓ Built 1 itinerary

⚠ Reservation requires you

🔒 Payment was never accessible
```

그리고 마지막:

# **You stayed in control.**

이 한 문장이 나옵니다.

---

# 이게 제가 생각하는 “심사위원이 기억할 장면”입니다.

심사위원이 발표가 끝난 뒤 기억하는 것은:

> “부산 여행 AI 앱”

이 아니라

> **“아, AI Agent가 현실의 웹을 사용하게 되면 인간이 권한을 어떻게 통제해야 하는지를 부산이라는 도시로 보여준 프로젝트였지.”**

가 되어야 합니다.

그게 훨씬 강합니다.

---

## 5개 중 최종 평가

### 🥇 ① Agent Wallet

**가장 혁신적이고 WebMCP 철학과 잘 맞음**

### 🥇 ② Agentic Busan Network

**가장 시각적으로 강하고 부산이라는 지역성이 살아남**

### 🥈 ③ Agent Black Box

**AI Safety / Trust 관점에서 깊이가 있음**

### 🥈 ④ WebMCP Battle

**기술 심사위원에게 가장 강함**

### 🥉 ⑤ Agent Passport

**사업성과 확장성이 가장 큼**

---

## 제 판단은 조금 더 명확합니다.

**이번 해커톤에서 ②만 하면 “멋진 WebMCP 여행 데모”가 되고,
①만 하면 “AI 권한 관리 서비스”가 됩니다.**

그런데

> **① Agent Wallet + ② Agentic Busan Network + ④ WebMCP Battle**

을 하나의 스토리로 묶으면,

# **“사람이 AI에게 권한을 주고 → AI가 부산의 여러 웹을 사용하고 → 그 결과를 사람이 검증하며 → WebMCP가 기존 웹 자동화보다 실제로 효율적인지 증명한다.”**

라는 완결된 작품이 됩니다.

그리고 이 구조는 현재 WebMCP가 강조하는 **명시적 Tool, 구조화된 입력, 브라우저 중재, 사용자 확인, 실제 사용자 목표 중심의 Tool 설계**와도 정확히 맞물립니다. ([Chrome for Developers][1])

**저라면 이 방향으로 갑니다.**

원하시면 다음 단계에서 이 3개를 합친 **실제 해커톤 출품작의 전체 화면 UI/UX를 한 장의 고급 제품 콘셉트 이미지로 설계해드릴 수 있습니다.**
 