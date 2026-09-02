/**
 * HelloBusan — shared constants.
 *
 * UI copy is English-first throughout the app (hackathon judges are not
 * assumed to read Korean); Korean appears only as a small secondary
 * caption under English headings, matching the project's own mockups.
 */

// The 10 WebMCP tools defined in the PRD (section 9), plus two tools that
// exist purely to demonstrate a hard DENY (payment, profile mutation).
// type: READ | WRITE | SENSITIVE | FINANCIAL | PERSONAL
export const TOOL_DEFINITIONS = [
  { name: "get_weather", type: "READ", category: "core", label: "Check weather", defaultPolicy: "allow" },
  { name: "search_places", type: "READ", category: "attraction", label: "Search places", defaultPolicy: "allow" },
  { name: "search_events", type: "READ", category: "culture", label: "Search events", defaultPolicy: "allow" },
  { name: "search_restaurants", type: "READ", category: "food", label: "Search restaurants", defaultPolicy: "allow" },
  { name: "get_place_details", type: "READ", category: "attraction", label: "Place details", defaultPolicy: "allow" },
  { name: "estimate_cost", type: "READ", category: "core", label: "Estimate cost", defaultPolicy: "allow" },
  { name: "calculate_route", type: "READ", category: "transport", label: "Calculate route", defaultPolicy: "allow" },
  { name: "get_itinerary", type: "READ", category: "core", label: "Read itinerary", defaultPolicy: "allow" },
  { name: "update_itinerary", type: "WRITE", category: "core", label: "Update itinerary", defaultPolicy: "allow" },
  { name: "request_reservation", type: "SENSITIVE", category: "food", label: "Request reservation", defaultPolicy: "ask" },
  { name: "process_payment", type: "FINANCIAL", category: "core", label: "Payment", defaultPolicy: "deny" },
  { name: "update_profile", type: "PERSONAL", category: "core", label: "Profile mutation", defaultPolicy: "deny" },
];

export const PERMISSION_ROWS = [
  { key: "search", label: "Search", sub: "검색", tools: ["search_places", "search_restaurants", "search_events", "get_place_details", "get_weather"] },
  { key: "compare", label: "Compare", sub: "비교", tools: ["estimate_cost"] },
  { key: "route", label: "Route", sub: "경로 계산", tools: ["calculate_route"] },
  { key: "schedule", label: "Schedule", sub: "일정 수정", tools: ["update_itinerary", "get_itinerary"] },
  { key: "reservation", label: "Reservation", sub: "예약", tools: ["request_reservation"] },
  { key: "payment", label: "Payment", sub: "결제", tools: ["process_payment"], locked: true },
  { key: "profile", label: "Profile data", sub: "개인정보 사용", tools: ["update_profile"], locked: true },
];

export const POLICY_LABEL = {
  allow: "Allow",
  ask: "Ask first",
  deny: "Blocked",
};

export const DEFAULT_DAILY_LIMIT = 50000;

// English first — this is what judges will actually read and run. A
// Korean example is kept for authenticity/local color.
export const DEMO_PROMPTS = [
  "It's raining today. Plan 6 hours in Busan with my kid for under ₩50,000.",
  "Plan a 3-hour date near Haeundae for about ₩30,000.",
  "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을 만들어줘.",
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
