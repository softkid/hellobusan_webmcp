/**
 * HelloBusan — shared constants.
 */

// The 10 WebMCP tools defined in the PRD (section 9), plus two tools that
// exist purely to demonstrate a hard DENY (payment, profile mutation).
// type: READ | WRITE | SENSITIVE | FINANCIAL | PERSONAL
export const TOOL_DEFINITIONS = [
  { name: "get_weather", type: "READ", category: "core", label: "날씨 확인", defaultPolicy: "allow" },
  { name: "search_places", type: "READ", category: "attraction", label: "장소 검색", defaultPolicy: "allow" },
  { name: "search_events", type: "READ", category: "culture", label: "행사 검색", defaultPolicy: "allow" },
  { name: "search_restaurants", type: "READ", category: "food", label: "식당 검색", defaultPolicy: "allow" },
  { name: "get_place_details", type: "READ", category: "attraction", label: "장소 상세", defaultPolicy: "allow" },
  { name: "estimate_cost", type: "READ", category: "core", label: "예산 계산", defaultPolicy: "allow" },
  { name: "calculate_route", type: "READ", category: "transport", label: "경로 계산", defaultPolicy: "allow" },
  { name: "get_itinerary", type: "READ", category: "core", label: "일정 조회", defaultPolicy: "allow" },
  { name: "update_itinerary", type: "WRITE", category: "core", label: "일정 수정", defaultPolicy: "allow" },
  { name: "request_reservation", type: "SENSITIVE", category: "food", label: "예약 요청", defaultPolicy: "ask" },
  { name: "process_payment", type: "FINANCIAL", category: "core", label: "결제", defaultPolicy: "deny" },
  { name: "update_profile", type: "PERSONAL", category: "core", label: "개인정보 변경", defaultPolicy: "deny" },
];

export const PERMISSION_ROWS = [
  { key: "search", label: "검색 (Search)", tools: ["search_places", "search_restaurants", "search_events", "get_place_details", "get_weather"] },
  { key: "compare", label: "비교 (Compare)", tools: ["estimate_cost"] },
  { key: "route", label: "경로 계산 (Route)", tools: ["calculate_route"] },
  { key: "schedule", label: "일정 수정 (Schedule)", tools: ["update_itinerary", "get_itinerary"] },
  { key: "reservation", label: "예약 (Reservation)", tools: ["request_reservation"] },
  { key: "payment", label: "결제 (Payment)", tools: ["process_payment"], locked: true },
  { key: "profile", label: "개인정보 사용 (Profile)", tools: ["update_profile"], locked: true },
];

export const POLICY_LABEL = {
  allow: "허용",
  ask: "승인 필요",
  deny: "차단",
};

export const DEFAULT_DAILY_LIMIT = 50000;

export const DEMO_PROMPTS = [
  "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을 만들어줘.",
  "해운대 근처에서 3시간, 예산 3만원으로 데이트 코스 짜줘.",
  "Give me a rainy-day, kid-friendly plan in Busan for 6 hours under ₩50,000.",
];

export const AGENT_STEP_SEQUENCE = [
  "get_weather",
  "search_places",
  "search_events",
  "search_restaurants",
  "estimate_cost",
  "calculate_route",
  "update_itinerary",
  "request_reservation",
];
