/**
 * WebMCP Tool Declarations & Permission Schemas for HelloBusan (English Default)
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
  [TOOL_NAMES.SEARCH_PLACES]: { policy: "ALLOW", label: "Search Places", type: "READ" },
  [TOOL_NAMES.SEARCH_RESTAURANTS]: { policy: "ALLOW", label: "Search Restaurants", type: "READ" },
  [TOOL_NAMES.SEARCH_EVENTS]: { policy: "ALLOW", label: "Search Events", type: "READ" },
  [TOOL_NAMES.GET_PLACE_DETAILS]: { policy: "ALLOW", label: "Place Details", type: "READ" },
  [TOOL_NAMES.CALCULATE_ROUTE]: { policy: "ALLOW", label: "Calculate Route", type: "READ" },
  [TOOL_NAMES.ESTIMATE_COST]: { policy: "ALLOW", label: "Estimate Cost", type: "READ" },
  [TOOL_NAMES.GET_WEATHER]: { policy: "ALLOW", label: "Get Weather", type: "READ" },
  [TOOL_NAMES.GET_ITINERARY]: { policy: "ALLOW", label: "Get Itinerary", type: "READ" },
  [TOOL_NAMES.UPDATE_ITINERARY]: { policy: "ALLOW", label: "Update Itinerary", type: "WRITE" },
  [TOOL_NAMES.REQUEST_RESERVATION]: { policy: "ASK", label: "Request Reservation", type: "SENSITIVE" }
};

export const PRESET_GOALS = [
  {
    id: "preset-1",
    title: "🌧️ Rainy Day Family 6h Trip (Under ₩50,000)",
    prompt: "Today it is raining. Create a 6-hour family itinerary with a kid in Centum & Haeundae under ₩50,000.",
    budget: 50000,
    duration: 360,
    requireIndoor: true,
    childFriendly: true
  },
  {
    id: "preset-2",
    title: "✨ Culture & Gourmet Date Course (Under ₩80,000)",
    prompt: "Plan a 5-hour couple date course with media art exhibition, pork soup lunch, and aquarium in Centum-Haeundae.",
    budget: 80000,
    duration: 300,
    requireIndoor: true,
    childFriendly: false
  },
  {
    id: "preset-3",
    title: "🚀 Robot Science & Abalone Feast (Under ₩45,000)",
    prompt: "Design a 4-hour kid-friendly course visiting Busan Science Museum robot dance show and abalone porridge dining.",
    budget: 45000,
    duration: 240,
    requireIndoor: false,
    childFriendly: true
  }
];

export const BENCHMARK_METRICS = {
  human: {
    title: "Human Manual (Direct Search)",
    steps: 32,
    interactions: 48,
    completionTimeSec: 285,
    errors: 4,
    successRate: "75%",
    description: "User manually switches across Naver Map, blogs, booking apps, and weather apps to query and calculate transit routes."
  },
  domAgent: {
    title: "DOM Agent (Web Automation)",
    steps: 18,
    interactions: 26,
    completionTimeSec: 54,
    errors: 3,
    successRate: "60%",
    description: "AI inspects DOM buttons & selectors to click. Fragile to dynamic UI changes or popup shifts leading to execution failure."
  },
  webMcp: {
    title: "WebMCP Agent (Structured Schema Tools)",
    steps: 8,
    interactions: 1, // Only 1 Human Approval interaction
    completionTimeSec: 8.4,
    errors: 0,
    successRate: "100%",
    description: "Browser mediates atomic JSON Schema tool calls. Zero DOM-breaking errors with 1-click human approval."
  }
};
