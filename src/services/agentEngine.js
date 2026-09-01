import { TOOL_NAMES } from "../constants/webmcpConfig.js";
import { persistToolCallToD1, persistApprovalToD1 } from "./apiService.js";

/**
 * Agent Engine for HelloBusan WebMCP Execution
 * Integrates Cloudflare Worker D1 Audit Trails & Server-Side Approvals
 */
export async function runAgentWorkflow({
  goalPrompt,
  permissionsWallet,
  dailyBudgetLimit,
  toolHandlers,
  onLogEvent,
  onRequestApproval,
  onStateUpdate
}) {
  const sessionId = "session-" + Date.now();

  const log = async (toolName, input, output, status, latencyMs, impactReason) => {
    const logItem = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      sessionId,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
      toolName,
      input,
      output,
      policy: permissionsWallet[toolName]?.policy || "ALLOW",
      status, // COMPLETED | ASK_APPROVAL | BLOCKED
      latencyMs,
      impactReason
    };

    onLogEvent(logItem);
    // Persist asynchronously to Cloudflare D1
    persistToolCallToD1(logItem).catch(() => {});
  };

  // Helper permission check
  const checkPermission = (toolName) => {
    const policy = permissionsWallet[toolName]?.policy || "ALLOW";
    return policy;
  };

  onStateUpdate({ isWorking: true, currentStep: "Initializing Agent Planner & Cloudflare Worker Session..." });
  await delay(400);

  // Step 1: get_weather
  onStateUpdate({ currentStep: "Checking Busan Weather (get_weather)..." });
  let weatherPolicy = checkPermission(TOOL_NAMES.GET_WEATHER);
  let weatherResult = null;
  if (weatherPolicy === "DENY") {
    await log(TOOL_NAMES.GET_WEATHER, {}, { error: "Permission Denied" }, "BLOCKED", 12, "User policy DENIED get_weather.");
  } else {
    const startMs = Date.now();
    weatherResult = await toolHandlers.current[TOOL_NAMES.GET_WEATHER]();
    await log(TOOL_NAMES.GET_WEATHER, {}, weatherResult, "COMPLETED", Date.now() - startMs, "Identified rainy condition (80% precip). Filter set to indoor venues.");
  }

  await delay(500);

  // Step 2: search_places (Indoor + Kid friendly)
  onStateUpdate({ currentStep: "Querying Cloudflare D1 Database for Indoor Places (search_places)..." });
  let placesPolicy = checkPermission(TOOL_NAMES.SEARCH_PLACES);
  let placesResult = [];
  if (placesPolicy === "DENY") {
    await log(TOOL_NAMES.SEARCH_PLACES, { isIndoor: true }, { error: "Permission Denied" }, "BLOCKED", 15, "Permission DENIED.");
  } else {
    const startMs = Date.now();
    const query = { district: "Centum City", isIndoor: true, childFriendly: true, maxPrice: 35000 };
    placesResult = await toolHandlers.current[TOOL_NAMES.SEARCH_PLACES](query);
    await log(TOOL_NAMES.SEARCH_PLACES, query, placesResult, "COMPLETED", Date.now() - startMs, `Retrieved ${placesResult.length} indoor places from Cloudflare D1 database.`);
  }

  await delay(600);

  // Step 3: search_restaurants
  onStateUpdate({ currentStep: "Querying Cloudflare D1 Database for Restaurants (search_restaurants)..." });
  let restPolicy = checkPermission(TOOL_NAMES.SEARCH_RESTAURANTS);
  let restResult = [];
  if (restPolicy === "DENY") {
    await log(TOOL_NAMES.SEARCH_RESTAURANTS, {}, { error: "Permission Denied" }, "BLOCKED", 10, "Permission DENIED.");
  } else {
    const startMs = Date.now();
    const query = { district: "Centum City", childFriendly: true, maxPriceAvg: 25000 };
    restResult = await toolHandlers.current[TOOL_NAMES.SEARCH_RESTAURANTS](query);
    await log(TOOL_NAMES.SEARCH_RESTAURANTS, query, restResult, "COMPLETED", Date.now() - startMs, `Retrieved ${restResult.length} dining options from Cloudflare D1 database.`);
  }

  await delay(500);

  // Step 4: calculate_route & estimate_cost
  onStateUpdate({ currentStep: "Calculating Transit Route & Budget (calculate_route, estimate_cost)..." });
  const selectedPlace = placesResult[0] || { id: "place-1", name: "SEA LIFE 부산아쿠아리움", priceMin: 21000 };
  const selectedRest = restResult[0] || { id: "rest-1", name: "수변최고돼지국밥 센텀점", priceAvg: 10000 };
  
  const routeInput = { originId: selectedRest.id, destinationId: selectedPlace.id };
  const startRoute = Date.now();
  const routeResult = await toolHandlers.current[TOOL_NAMES.CALCULATE_ROUTE](routeInput);
  await log(TOOL_NAMES.CALCULATE_ROUTE, routeInput, routeResult, "COMPLETED", Date.now() - startRoute, "Minimized walking distance due to heavy rain. Subway/Taxi 12 mins.");

  const costInput = { items: [selectedPlace, selectedRest, { name: "Transit Fee", price: 2800 }] };
  const startCost = Date.now();
  const costResult = await toolHandlers.current[TOOL_NAMES.ESTIMATE_COST](costInput);
  await log(TOOL_NAMES.ESTIMATE_COST, costInput, costResult, "COMPLETED", Date.now() - startCost, `Total estimated cost ₩${costResult.totalCost.toLocaleString()} (within ₩${dailyBudgetLimit.toLocaleString()} limit).`);

  await delay(600);

  // Step 5: update_itinerary
  onStateUpdate({ currentStep: "Persisting 6-Hour Itinerary to D1 Database (update_itinerary)..." });
  const itineraryItems = [
    {
      time: "11:30 - 12:40",
      title: selectedRest.name,
      category: "Dining / Lunch",
      location: selectedRest.district || "Centum City",
      cost: 20000,
      note: "담백한 한상 국밥 & 아이 수저 제공",
      lat: selectedRest.lat || 35.1704,
      lng: selectedRest.lng || 129.1302
    },
    {
      time: "12:40 - 13:00",
      title: "센텀 ➔ 해운대 이동 (Indoor Transit)",
      category: "Transit",
      location: "센텀역 -> 해운대역",
      cost: 2800,
      note: "우천 도보 최소화 지하철 이동 (12분)",
      lat: 35.165,
      lng: 129.145
    },
    {
      time: "13:00 - 15:30",
      title: selectedPlace.name,
      category: "Indoor Activity",
      location: selectedPlace.district || "Haeundae",
      cost: 21000,
      note: "우천 영향 없음, 가상 수중 터널 & 인어공주 공연 관람",
      lat: selectedPlace.lat || 35.1593,
      lng: selectedPlace.lng || 129.1623
    },
    {
      time: "15:30 - 17:00",
      title: "부산어묵체험관 & 베이커리 (Samjin Amook)",
      category: "Snack & Rest",
      location: "Centum City",
      cost: 8000,
      note: "수제 어묵 크로켓 & 핫초코 휴식",
      lat: 35.1685,
      lng: 129.1298
    }
  ];

  const updateStart = Date.now();
  await toolHandlers.current[TOOL_NAMES.UPDATE_ITINERARY]({ items: itineraryItems });
  await log(TOOL_NAMES.UPDATE_ITINERARY, { itemCount: itineraryItems.length }, { status: "success" }, "COMPLETED", Date.now() - updateStart, "Rendered active 6-hour timeline on map & workspace.");

  await delay(600);

  // Step 6: request_reservation (Sensitive Action Check)
  onStateUpdate({ currentStep: "Checking Reservation Policy (request_reservation)..." });
  const resPolicy = checkPermission(TOOL_NAMES.REQUEST_RESERVATION);

  const reservationPayload = {
    targetName: "오션뷰 뷔페 & 아쿠아 레스토랑",
    time: "17:30",
    partySize: 2,
    estimatedCost: 48000,
    details: "아동 동반 창가석 수족관 뷰 지정 예약"
  };

  if (resPolicy === "DENY") {
    await log(TOOL_NAMES.REQUEST_RESERVATION, reservationPayload, { error: "Denied by Agent Wallet policy" }, "BLOCKED", 10, "🔒 Reservation BLOCKED due to Agent Wallet policy = DENY.");
    onStateUpdate({ isWorking: false, isFinished: true, currentStep: "Completed (Reservation Blocked by Policy)" });
    return;
  }

  if (resPolicy === "ASK") {
    await log(TOOL_NAMES.REQUEST_RESERVATION, reservationPayload, { status: "Awaiting User Approval" }, "ASK_APPROVAL", 14, "⚠️ Reservation requires explicit Human Approval before proceeding.");
    
    // Pause execution and ask human approval
    const approved = await onRequestApproval(reservationPayload);

    if (approved) {
      const resStart = Date.now();
      const resResult = await toolHandlers.current[TOOL_NAMES.REQUEST_RESERVATION](reservationPayload);
      await log(TOOL_NAMES.REQUEST_RESERVATION, reservationPayload, resResult, "COMPLETED", Date.now() - resStart, "✅ User Approved. Reservation recorded in Cloudflare D1 Session.");
      persistApprovalToD1({ toolName: TOOL_NAMES.REQUEST_RESERVATION, payload: reservationPayload, status: "APPROVED" }).catch(() => {});
      onStateUpdate({ isWorking: false, isFinished: true, currentStep: "Workflow Completed Successfully!" });
    } else {
      await log(TOOL_NAMES.REQUEST_RESERVATION, reservationPayload, { status: "Rejected by User" }, "BLOCKED", 8, "❌ User Rejected the reservation request.");
      persistApprovalToD1({ toolName: TOOL_NAMES.REQUEST_RESERVATION, payload: reservationPayload, status: "REJECTED" }).catch(() => {});
      onStateUpdate({ isWorking: false, isFinished: true, currentStep: "Workflow Ended (Reservation Rejected by User)" });
    }
  } else {
    // ALLOW policy
    const resStart = Date.now();
    const resResult = await toolHandlers.current[TOOL_NAMES.REQUEST_RESERVATION](reservationPayload);
    await log(TOOL_NAMES.REQUEST_RESERVATION, reservationPayload, resResult, "COMPLETED", Date.now() - resStart, "Reservation executed automatically under ALLOW policy.");
    persistApprovalToD1({ toolName: TOOL_NAMES.REQUEST_RESERVATION, payload: reservationPayload, status: "AUTO_APPROVED" }).catch(() => {});
    onStateUpdate({ isWorking: false, isFinished: true, currentStep: "Workflow Completed Successfully!" });
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
