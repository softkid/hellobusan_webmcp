/**
 * Agent Sequential Workflow Engine for HelloBusan WebMCP (Pure English Default)
 */

import { TOOL_NAMES } from "../constants/webmcpConfig.js";

export async function runAgentWorkflow({
  goalPrompt,
  permissionsWallet,
  dailyBudgetLimit,
  toolHandlers,
  onLogEvent,
  onRequestApproval,
  onStateUpdate
}) {
  const timestamp = () => new Date().toLocaleTimeString("en-US", { hour12: false });

  // 1. Initial State
  onStateUpdate({ isWorking: true, isFinished: false, currentStep: "Parsing Natural Language Goal & Checking Weather..." });

  // Step 1: Check Weather
  const startMs = Date.now();
  const weatherResult = await toolHandlers.current[TOOL_NAMES.GET_WEATHER]();
  onLogEvent({
    timestamp: timestamp(),
    toolName: TOOL_NAMES.GET_WEATHER,
    inputParams: {},
    outputResult: weatherResult,
    permissionUsed: "READ (ALLOW)",
    status: "ALLOWED",
    latencyMs: Date.now() - startMs,
    impactReason: `Detected weather: ${weatherResult?.condition || "Rainy"}. Indoor venue priority applied.`
  });

  await new Promise((r) => setTimeout(r, 600));

  // Step 2: Search Indoor Places
  onStateUpdate({ currentStep: "Searching Indoor & Kid-Friendly Venues in Centum/Haeundae..." });
  const t2 = Date.now();
  const placesResult = await toolHandlers.current[TOOL_NAMES.SEARCH_PLACES]({
    district: "Centum City",
    isIndoor: true,
    childFriendly: true,
    maxPrice: 35000
  });

  onLogEvent({
    timestamp: timestamp(),
    toolName: TOOL_NAMES.SEARCH_PLACES,
    inputParams: { district: "Centum City", isIndoor: true, childFriendly: true },
    outputResult: { count: placesResult?.length || 4, places: placesResult },
    permissionUsed: "READ (ALLOW)",
    status: "ALLOWED",
    latencyMs: Date.now() - t2,
    impactReason: `Found ${placesResult?.length || 4} indoor places matching budget & kid-friendly criteria.`
  });

  await new Promise((r) => setTimeout(r, 600));

  // Step 3: Search Dining
  onStateUpdate({ currentStep: "Filtering Dining Options under Budget Limit..." });
  const t3 = Date.now();
  const restResult = await toolHandlers.current[TOOL_NAMES.SEARCH_RESTAURANTS]({
    district: "Centum City",
    maxPriceAvg: 25000,
    childFriendly: true
  });

  onLogEvent({
    timestamp: timestamp(),
    toolName: TOOL_NAMES.SEARCH_RESTAURANTS,
    inputParams: { district: "Centum City", maxPriceAvg: 25000, childFriendly: true },
    outputResult: { count: restResult?.length || 3, restaurants: restResult },
    permissionUsed: "READ (ALLOW)",
    status: "ALLOWED",
    latencyMs: Date.now() - t3,
    impactReason: `Selected ${restResult?.length || 3} dining options under ₩25,000 per person.`
  });

  await new Promise((r) => setTimeout(r, 600));

  // Step 4: Calculate Route
  onStateUpdate({ currentStep: "Calculating Transit Duration & Rain-Safe Corridors..." });
  const selectedPlace = placesResult[0] || { id: "place-1", name: "SEA LIFE Busan Aquarium", priceMin: 21000 };
  const selectedRest = restResult[0] || { id: "rest-1", name: "Subyeon Pork Soup Centum", priceAvg: 10000 };

  const t4 = Date.now();
  const routeResult = await toolHandlers.current[TOOL_NAMES.CALCULATE_ROUTE]({
    originId: selectedRest.id,
    destinationId: selectedPlace.id
  });

  onLogEvent({
    timestamp: timestamp(),
    toolName: TOOL_NAMES.CALCULATE_ROUTE,
    inputParams: { originId: selectedRest.id, destinationId: selectedPlace.id },
    outputResult: routeResult,
    permissionUsed: "READ (ALLOW)",
    status: "ALLOWED",
    latencyMs: Date.now() - t4,
    impactReason: `Transit optimized: ${routeResult?.mode} (${routeResult?.durationMinutes} min via underground walkway).`
  });

  await new Promise((r) => setTimeout(r, 600));

  // Step 5: Assemble & Update Itinerary Timeline
  onStateUpdate({ currentStep: "Assembling 6-Hour Timeline & Estimating Total Cost..." });
  const itineraryItems = [
    {
      step: 1,
      time: "10:00 - 11:30",
      title: "Subyeon Pork Soup Centum",
      category: "Korean Gukbap / Dining",
      cost: 10000,
      lat: 35.1704,
      lng: 129.1302,
      note: "Pork soup lunch & child dining utensil set provided"
    },
    {
      step: 2,
      time: "11:30 - 12:00",
      title: "Transit: Centum to Haeundae",
      category: "Subway / Indoor Walk",
      cost: 2800,
      location: "Centum Station -> Haeundae Station",
      lat: 35.1650,
      lng: 129.1450,
      note: "Underground walkway connection (12 min)"
    },
    {
      step: 3,
      time: "12:00 - 14:30",
      title: "SEA LIFE Busan Aquarium",
      category: "Aquarium / Indoor",
      cost: 21000,
      lat: 35.1593,
      lng: 129.1623,
      note: "Indoor marine tunnel & mermaid performance"
    },
    {
      step: 4,
      time: "14:30 - 16:00",
      title: "Samjin Amook Bakery Cafe",
      category: "Bakery & Cafe",
      cost: 6000,
      lat: 35.1610,
      lng: 129.1590,
      note: "Fishcake croquette & hot chocolate break"
    }
  ];

  const t5 = Date.now();
  await toolHandlers.current[TOOL_NAMES.UPDATE_ITINERARY]({ items: itineraryItems });

  onLogEvent({
    timestamp: timestamp(),
    toolName: TOOL_NAMES.UPDATE_ITINERARY,
    inputParams: { itemCounts: itineraryItems.length },
    outputResult: { status: "success", totalItems: itineraryItems.length },
    permissionUsed: "WRITE (ALLOW)",
    status: "ALLOWED",
    latencyMs: Date.now() - t5,
    impactReason: "6-hour itinerary assembled and rendered on interactive map."
  });

  await new Promise((r) => setTimeout(r, 600));

  // Step 6: Trigger Reservation Approval Interceptor
  onStateUpdate({ currentStep: "Requesting Reservation (Human Approval Required)..." });

  const reservationPayload = {
    targetName: "Ocean View Buffet & Aqua Restaurant",
    time: "17:30",
    partySize: 2,
    estimatedCost: 48000,
    details: "Window table reservation with ocean aquarium view for family"
  };

  onLogEvent({
    timestamp: timestamp(),
    toolName: TOOL_NAMES.REQUEST_RESERVATION,
    inputParams: reservationPayload,
    outputResult: { pendingApprovalId: "APP-9921", status: "WAITING_HUMAN_APPROVAL" },
    permissionUsed: "SENSITIVE (POLICY = ASK)",
    status: "ASK_APPROVAL",
    latencyMs: 10,
    impactReason: "Sensitive action intercept: Awaiting user confirmation modal."
  });

  const isApproved = await onRequestApproval(reservationPayload);

  if (isApproved) {
    const t6 = Date.now();
    const resResult = await toolHandlers.current[TOOL_NAMES.REQUEST_RESERVATION]({
      targetName: reservationPayload.targetName,
      time: reservationPayload.time,
      partySize: reservationPayload.partySize
    });

    onLogEvent({
      timestamp: timestamp(),
      toolName: TOOL_NAMES.REQUEST_RESERVATION,
      inputParams: reservationPayload,
      outputResult: resResult,
      permissionUsed: "SENSITIVE (APPROVED BY USER)",
      status: "ALLOWED",
      latencyMs: Date.now() - t6,
      impactReason: `User approved reservation! Confirmed ID: ${resResult.reservationId}`
    });

    onStateUpdate({ isWorking: false, isFinished: true, currentStep: "Agent Workflow Completed Successfully! 🎉" });
  } else {
    onLogEvent({
      timestamp: timestamp(),
      toolName: TOOL_NAMES.REQUEST_RESERVATION,
      inputParams: reservationPayload,
      outputResult: { status: "REJECTED_BY_USER" },
      permissionUsed: "SENSITIVE (REJECTED BY USER)",
      status: "BLOCKED",
      latencyMs: 10,
      impactReason: "User rejected reservation request. Action canceled safely."
    });

    onStateUpdate({ isWorking: false, isFinished: true, currentStep: "Itinerary Generated (Reservation Canceled by User)" });
  }
}
