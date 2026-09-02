/**
 * document.modelContext.registerTool() metadata for every HelloBusan tool.
 * These are consumed by <WebMCPToolBinding> (via the `use-webmcp-tool`
 * React hook) — see HELLOBUSAN_PRD.md section 9 "WebMCP Tool Contract".
 *
 * Each tool's `execute` in the app is wired to the SAME function the
 * built-in agent uses (`engine.callTool`), so an external WebMCP-capable
 * agent (e.g. Chrome with WebMCP enabled, or a ChatGPT-app browser tab)
 * gets identical behavior — including permission checks and the human
 * approval flow — to the agent baked into this page.
 */

const DISTRICTS = [
  "Haeundae-gu", "Suyeong-gu", "Jung-gu", "Saha-gu", "Yeongdo-gu",
  "Dongnae-gu", "Gijang-gun", "Nam-gu", "Dong-gu", "Seo-gu", "Yeonje-gu", "Jin-gu",
];

export const TOOL_SCHEMAS = {
  get_weather: {
    description:
      "Check today's Busan weather (simulated for this demo). Returns condition, rain flag, and temperature in Celsius. Call this before deciding indoor vs outdoor activities.",
    inputSchema: { type: "object", properties: {}, required: [] },
    annotations: { readOnlyHint: true },
  },

  search_places: {
    description:
      "Search Busan attractions, parks, museums and viewpoints. Filter by whether it should stay open in the rain, whether it should be kid-friendly, and an optional district. Returns place objects with id, name, category, district, price range, indoor/rain_ok flags and tags.",
    inputSchema: {
      type: "object",
      properties: {
        rainy: { type: "boolean", description: "If true, only returns places that work in the rain (rain_ok)." },
        hasChild: { type: "boolean", description: "If true, only returns kid-friendly places." },
        district: { type: "string", enum: DISTRICTS, description: "Optional district filter." },
        limit: { type: "number", description: "Max results (default 12)." },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
  },

  search_events: {
    description:
      "Search current festivals, workshops and cultural events in Busan. Same filters as search_places (rainy, hasChild, district).",
    inputSchema: {
      type: "object",
      properties: {
        rainy: { type: "boolean" },
        hasChild: { type: "boolean" },
        district: { type: "string", enum: DISTRICTS },
        limit: { type: "number" },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
  },

  search_restaurants: {
    description:
      "Search Busan restaurants by per-person budget, dietary needs, and whether they need to be kid-friendly. Returns restaurant objects with price range, cuisine, dietary tags and rating.",
    inputSchema: {
      type: "object",
      properties: {
        budgetPerPerson: { type: "number", description: "Max KRW per person." },
        hasChild: { type: "boolean" },
        dietary: {
          type: "array",
          items: { type: "string", enum: ["vegetarian_option", "halal"] },
          description: "Dietary requirements to filter by.",
        },
        district: { type: "string", enum: DISTRICTS },
        limit: { type: "number" },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
  },

  get_place_details: {
    description: "Get full details for a single place, restaurant or event by id or name.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
  },

  estimate_cost: {
    description:
      "Estimate the total cost (in KRW) of a set of itinerary items for a given party size. If no items are passed, estimates the cost of the current itinerary.",
    inputSchema: {
      type: "object",
      properties: {
        items: { type: "array", items: { type: "object" }, description: "Itinerary items to price. Optional — defaults to the current itinerary." },
        partySize: { type: "number", description: "Number of people. Defaults to the current itinerary's party size." },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
  },

  calculate_route: {
    description:
      "Calculate travel time and distance between a sequence of stops (each with lat/lng). If no stops are passed, uses the current itinerary's order.",
    inputSchema: {
      type: "object",
      properties: {
        stops: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, lat: { type: "number" }, lng: { type: "number" } },
          },
        },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
  },

  get_itinerary: {
    description: "Read the current itinerary: ordered items, total cost, total duration and reservation status.",
    inputSchema: { type: "object", properties: {}, required: [] },
    annotations: { readOnlyHint: true },
  },

  update_itinerary: {
    description:
      "Modify the itinerary shown in the UI. Use action='replace_all' with a payload of {items, totalCost, ...} to set a whole new plan, or action='add'/'remove' for a single item. This is a WRITE action: it changes what the human sees on screen immediately.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["replace_all", "add", "remove"] },
        payload: { type: "object", description: "Used with action='replace_all'." },
        item: { type: "object", description: "Used with action='add'." },
        itemId: { type: "string", description: "Used with action='remove'." },
      },
      required: ["action"],
    },
    annotations: { readOnlyHint: false },
  },

  request_reservation: {
    description:
      "Request a restaurant reservation on the person's behalf. IMPORTANT: this never books or charges anything directly — by default it pauses and requires the human to tap Approve in the Agent Wallet before the reservation is marked confirmed. This is the one sensitive, real-world-facing action in HelloBusan's tool set.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Restaurant name." },
        time: { type: "string", description: "Reservation time, e.g. '19:00'." },
        partySize: { type: "number" },
        cost: { type: "number", description: "Estimated cost in KRW." },
      },
      required: ["name"],
    },
    annotations: { readOnlyHint: false },
  },

  process_payment: {
    description:
      "Attempt to process a payment. NOT AVAILABLE in this MVP — calling this will always fail with a permission error, by design (see Agent Wallet: Payment is hard-locked to DENY). Registered so agents and judges can verify the lock actually holds.",
    inputSchema: {
      type: "object",
      properties: { amount: { type: "number" }, method: { type: "string" } },
      required: [],
    },
    annotations: { readOnlyHint: false },
  },

  update_profile: {
    description:
      "Attempt to change the person's saved profile/personal data. NOT AVAILABLE in this MVP — always fails, by design (hard-locked to DENY).",
    inputSchema: { type: "object", properties: {}, required: [] },
    annotations: { readOnlyHint: false },
  },
};
