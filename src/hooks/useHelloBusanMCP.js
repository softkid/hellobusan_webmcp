import { useWebMCP } from "use-webmcp-tool";
import { TOOL_NAMES } from "../constants/webmcpConfig.js";

/**
 * Registers all 10 HelloBusan WebMCP tools into the browser runtime.
 * @param {Object} toolHandlers - Ref/Object containing handler functions for each tool.
 */
export default function useHelloBusanMCP(toolHandlers) {
  // 1. search_places
  useWebMCP({
    name: TOOL_NAMES.SEARCH_PLACES,
    description: "Busan City Places Search: Filter places by category, district, maximum budget, indoor status, and kid-friendliness.",
    inputSchema: {
      type: "object",
      properties: {
        district: { type: "string", description: "Busan district filter e.g. Haeundae, Centum City, Osiria" },
        maxPrice: { type: "number", description: "Maximum ticket price in KRW per person" },
        isIndoor: { type: "boolean", description: "Set true if rainy day requires indoor venue" },
        childFriendly: { type: "boolean", description: "Set true if visiting with kids" }
      }
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.SEARCH_PLACES]?.(params)
  });

  // 2. search_restaurants
  useWebMCP({
    name: TOOL_NAMES.SEARCH_RESTAURANTS,
    description: "Busan Food & Restaurants Search: Filter restaurants by district, cuisine, budget limit, and kid-friendly menus.",
    inputSchema: {
      type: "object",
      properties: {
        district: { type: "string", description: "Busan district filter" },
        maxPriceAvg: { type: "number", description: "Max average meal price in KRW per person" },
        childFriendly: { type: "boolean", description: "Set true for kid-friendly menus" }
      }
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.SEARCH_RESTAURANTS]?.(params)
  });

  // 3. search_events
  useWebMCP({
    name: TOOL_NAMES.SEARCH_EVENTS,
    description: "Busan Cultural Events & Exhibitions Search.",
    inputSchema: {
      type: "object",
      properties: {
        district: { type: "string", description: "District filter" },
        isIndoor: { type: "boolean", description: "Indoor event filter" }
      }
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.SEARCH_EVENTS]?.(params)
  });

  // 4. get_place_details
  useWebMCP({
    name: TOOL_NAMES.GET_PLACE_DETAILS,
    description: "Get detailed information, exact coordinates, open hours, and tags for a specific place.",
    inputSchema: {
      type: "object",
      properties: {
        placeId: { type: "string", description: "Place unique ID" }
      },
      required: ["placeId"]
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.GET_PLACE_DETAILS]?.(params)
  });

  // 5. calculate_route
  useWebMCP({
    name: TOOL_NAMES.CALCULATE_ROUTE,
    description: "Calculate optimal route, transit duration, and travel fee between Busan locations.",
    inputSchema: {
      type: "object",
      properties: {
        originId: { type: "string", description: "Starting place ID" },
        destinationId: { type: "string", description: "Destination place ID" }
      },
      required: ["originId", "destinationId"]
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.CALCULATE_ROUTE]?.(params)
  });

  // 6. estimate_cost
  useWebMCP({
    name: TOOL_NAMES.ESTIMATE_COST,
    description: "Calculate total cumulative budget cost for selected activities, dining, and transit.",
    inputSchema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: { type: "object" },
          description: "List of itinerary items with prices"
        }
      },
      required: ["items"]
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.ESTIMATE_COST]?.(params)
  });

  // 7. get_weather
  useWebMCP({
    name: TOOL_NAMES.GET_WEATHER,
    description: "Check live Busan weather condition, temperature, and rainy day indoor recommendation.",
    inputSchema: {
      type: "object",
      properties: {}
    },
    execute: () => toolHandlers.current?.[TOOL_NAMES.GET_WEATHER]?.()
  });

  // 8. get_itinerary
  useWebMCP({
    name: TOOL_NAMES.GET_ITINERARY,
    description: "Get current planned itinerary timeline and activity items.",
    inputSchema: {
      type: "object",
      properties: {}
    },
    execute: () => toolHandlers.current?.[TOOL_NAMES.GET_ITINERARY]?.()
  });

  // 9. update_itinerary
  useWebMCP({
    name: TOOL_NAMES.UPDATE_ITINERARY,
    description: "Update or replace the active 6-hour itinerary with optimized items and schedule.",
    inputSchema: {
      type: "object",
      properties: {
        items: { type: "array", description: "Array of scheduled itinerary items" }
      },
      required: ["items"]
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.UPDATE_ITINERARY]?.(params)
  });

  // 10. request_reservation (SENSITIVE)
  useWebMCP({
    name: TOOL_NAMES.REQUEST_RESERVATION,
    description: "Request a venue or restaurant reservation. Requires explicit user approval.",
    inputSchema: {
      type: "object",
      properties: {
        targetName: { type: "string", description: "Venue or Restaurant Name" },
        time: { type: "string", description: "Reservation time slot e.g. 13:00" },
        partySize: { type: "number", description: "Number of guests" },
        estimatedCost: { type: "number", description: "Estimated cost in KRW" }
      },
      required: ["targetName", "time", "partySize"]
    },
    execute: (params) => toolHandlers.current?.[TOOL_NAMES.REQUEST_RESERVATION]?.(params)
  });
}
