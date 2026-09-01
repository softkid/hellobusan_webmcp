/**
 * WebMCP Tool Declarations & Permission Schemas for HelloBusan
 */

export const TOOL_NAMES = {
  SEARCH_PLACES: "search_places",
  SEARCH_RESTAURANTS: "search_restaurants",
  SEARCH_EVENTS: "search_events",
  GET_PLACE_DETAILS: "get_place_details",
  CALCULATE_ROUTE: "calculate_route",
  ESTIMATE_COST: "estimate_cost",
  GET_WEATHER: "get_weather",
  GET_ITINERARY: "get_itinerary",
  UPDATE_ITINERARY: "update_itinerary",
  REQUEST_RESERVATION: "request_reservation"
};

export const DEFAULT_PERMISSIONS = {
  [TOOL_NAMES.SEARCH_PLACES]: { policy: "ALLOW", label: "장소 검색 (Search Places)", type: "READ" },
  [TOOL_NAMES.SEARCH_RESTAURANTS]: { policy: "ALLOW", label: "식당 검색 (Search Restaurants)", type: "READ" },
  [TOOL_NAMES.SEARCH_EVENTS]: { policy: "ALLOW", label: "행사 검색 (Search Events)", type: "READ" },
  [TOOL_NAMES.GET_PLACE_DETAILS]: { policy: "ALLOW", label: "장소 상세정보 (Place Details)", type: "READ" },
  [TOOL_NAMES.CALCULATE_ROUTE]: { policy: "ALLOW", label: "경로 및 이동시간 계산 (Calculate Route)", type: "READ" },
  [TOOL_NAMES.ESTIMATE_COST]: { policy: "ALLOW", label: "총 예산 계산 (Estimate Cost)", type: "READ" },
  [TOOL_NAMES.GET_WEATHER]: { policy: "ALLOW", label: "부산 날씨 조회 (Get Weather)", type: "READ" },
  [TOOL_NAMES.GET_ITINERARY]: { policy: "ALLOW", label: "일정 정보 조회 (Get Itinerary)", type: "READ" },
  [TOOL_NAMES.UPDATE_ITINERARY]: { policy: "ALLOW", label: "일정 변경 및 작성 (Update Itinerary)", type: "WRITE" },
  [TOOL_NAMES.REQUEST_RESERVATION]: { policy: "ASK", label: "예약 승인 요청 (Request Reservation)", type: "SENSITIVE" }
};

export const PRESET_GOALS = [
  {
    id: "preset-1",
    title: "🌧️ 우천 대응 6시간 아이동반 코스 (₩50,000 이하)",
    prompt: "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산 센텀/해운대에서 할 일을 만들어줘.",
    budget: 50000,
    duration: 360,
    requireIndoor: true,
    childFriendly: true
  },
  {
    id: "preset-2",
    title: "✨ 센텀-해운대 문화 & 맛집 코스 (₩80,000 이하)",
    prompt: "센텀시티 미디어아트 전시와 돼지국밥, 해운대 아쿠아리움을 포함한 5시간 데이트 코스 짜줘.",
    budget: 80000,
    duration: 300,
    requireIndoor: true,
    childFriendly: false
  },
  {
    id: "preset-3",
    title: "🚀 동부산 오시리아 로봇체험 & 전복죽 투어 (₩45,000 이하)",
    prompt: "동부산 국립부산과학관 로봇공연 관람 후 전복죽을 먹는 아이 친화형 4시간 코스 구성해줘.",
    budget: 45000,
    duration: 240,
    requireIndoor: false,
    childFriendly: true
  }
];

export const BENCHMARK_METRICS = {
  human: {
    title: "Human Manual (직접 검색)",
    steps: 32,
    interactions: 48,
    completionTimeSec: 285,
    errors: 4,
    successRate: "75%",
    description: "사용자가 네이버지도, 블로그, 예약앱, 날씨앱 6개를 직접 번갈아 오가며 검색 및 동선 계산"
  },
  domAgent: {
    title: "DOM Agent (기존 웹 자동화)",
    steps: 18,
    interactions: 26,
    completionTimeSec: 54,
    errors: 3,
    successRate: "60%",
    description: "AI가 DOM 구조와 버튼 셀렉터를 추측하여 클릭. 동적 UI 변경이나 팝업 시 클릭 실패 발생"
  },
  webMcp: {
    title: "WebMCP Agent (구조화 Tool)",
    steps: 8,
    interactions: 1, // Only 1 Human Approval interaction
    completionTimeSec: 8.4,
    errors: 0,
    successRate: "100%",
    description: "브라우저가 중재하는 원자적 WebMCP Schema Tool 호출. UI 깨짐 없이 1회 승인으로 완료"
  }
};
