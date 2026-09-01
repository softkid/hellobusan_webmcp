import React, { useState } from "react";
import { BookOpen, Play, CheckCircle2, Terminal, Layers, FileCode } from "lucide-react";
import { TOOL_NAMES } from "../constants/webmcpConfig.js";

export default function WebMCPDoc({ toolHandlers }) {
  const [selectedTool, setSelectedTool] = useState(TOOL_NAMES.SEARCH_PLACES);
  const [liveTestResult, setLiveTestResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const toolSpecs = {
    [TOOL_NAMES.SEARCH_PLACES]: {
      name: TOOL_NAMES.SEARCH_PLACES,
      label: "search_places (Places & Attractions Search)",
      type: "READ",
      policy: "ALLOW",
      description: "Searches Busan indoor places, aquariums, science museums, and galleries filtered by district, budget, and child-friendliness.",
      inputSchema: {
        type: "object",
        properties: {
          district: { type: "string", description: "Busan district (e.g. Haeundae, Centum City, Osiria)" },
          maxPrice: { type: "number", description: "Maximum entry fee in KRW per person" },
          isIndoor: { type: "boolean", description: "Set true for rainy day indoor venue filter" },
          childFriendly: { type: "boolean", description: "Set true for kids-friendly activities" }
        }
      },
      sampleInput: { district: "Centum City", isIndoor: true, childFriendly: true, maxPrice: 35000 },
      codeSnippet: `useWebMCP({
  name: "search_places",
  description: "Busan City Places Search",
  inputSchema: {
    type: "object",
    properties: {
      district: { type: "string" },
      maxPrice: { type: "number" },
      isIndoor: { type: "boolean" },
      childFriendly: { type: "boolean" }
    }
  },
  execute: async (params) => fetchPlacesFromD1(params)
});`
    },

    [TOOL_NAMES.SEARCH_RESTAURANTS]: {
      name: TOOL_NAMES.SEARCH_RESTAURANTS,
      label: "search_restaurants (Dining & Restaurant Search)",
      type: "READ",
      policy: "ALLOW",
      description: "Queries Busan restaurants with cuisine type, average meal cost, and child menu options.",
      inputSchema: {
        type: "object",
        properties: {
          district: { type: "string", description: "District filter" },
          maxPriceAvg: { type: "number", description: "Max average price per person in KRW" },
          childFriendly: { type: "boolean", description: "Child menu availability" }
        }
      },
      sampleInput: { district: "Centum City", childFriendly: true, maxPriceAvg: 25000 },
      codeSnippet: `useWebMCP({
  name: "search_restaurants",
  description: "Busan Food & Dining Search",
  inputSchema: {
    type: "object",
    properties: {
      district: { type: "string" },
      maxPriceAvg: { type: "number" },
      childFriendly: { type: "boolean" }
    }
  },
  execute: async (params) => fetchRestaurantsFromD1(params)
});`
    },

    [TOOL_NAMES.SEARCH_EVENTS]: {
      name: TOOL_NAMES.SEARCH_EVENTS,
      label: "search_events (Events & Culture Search)",
      type: "READ",
      policy: "ALLOW",
      description: "Search cultural exhibitions, media facade shows, and robot dance events in Busan.",
      inputSchema: {
        type: "object",
        properties: {
          district: { type: "string", description: "District filter" },
          isIndoor: { type: "boolean", description: "Indoor event filter" }
        }
      },
      sampleInput: { district: "Centum City", isIndoor: true },
      codeSnippet: `useWebMCP({
  name: "search_events",
  description: "Busan Events Search",
  inputSchema: {
    type: "object",
    properties: { district: { type: "string" }, isIndoor: { type: "boolean" } }
  },
  execute: async (params) => fetchEvents(params)
});`
    },

    [TOOL_NAMES.GET_PLACE_DETAILS]: {
      name: TOOL_NAMES.GET_PLACE_DETAILS,
      label: "get_place_details (Place Details Inquiry)",
      type: "READ",
      policy: "ALLOW",
      description: "Returns precise GPS coordinates, operating hours, and tags for a specific venue ID.",
      inputSchema: {
        type: "object",
        properties: {
          placeId: { type: "string", description: "Place unique ID" }
        },
        required: ["placeId"]
      },
      sampleInput: { placeId: "place-1" },
      codeSnippet: `useWebMCP({
  name: "get_place_details",
  description: "Get place details",
  inputSchema: {
    type: "object",
    properties: { placeId: { type: "string" } },
    required: ["placeId"]
  },
  execute: async ({ placeId }) => getPlaceById(placeId)
});`
    },

    [TOOL_NAMES.CALCULATE_ROUTE]: {
      name: TOOL_NAMES.CALCULATE_ROUTE,
      label: "calculate_route (Route & Transit Calculation)",
      type: "READ",
      policy: "ALLOW",
      description: "Computes subway/taxi transit duration, walking distance, and rainy day safety route.",
      inputSchema: {
        type: "object",
        properties: {
          originId: { type: "string", description: "Starting venue ID" },
          destinationId: { type: "string", description: "Destination venue ID" }
        },
        required: ["originId", "destinationId"]
      },
      sampleInput: { originId: "rest-1", destinationId: "place-1" },
      codeSnippet: `useWebMCP({
  name: "calculate_route",
  description: "Calculate optimal route",
  inputSchema: {
    type: "object",
    properties: {
      originId: { type: "string" },
      destinationId: { type: "string" }
    },
    required: ["originId", "destinationId"]
  },
  execute: async (params) => computeTransitRoute(params)
});`
    },

    [TOOL_NAMES.ESTIMATE_COST]: {
      name: TOOL_NAMES.ESTIMATE_COST,
      label: "estimate_cost (Budget & Cost Estimation)",
      type: "READ",
      policy: "ALLOW",
      description: "Calculates total cost for selected activities, dining, and transit against daily budget limits.",
      inputSchema: {
        type: "object",
        properties: {
          items: { type: "array", description: "List of items with costs" }
        },
        required: ["items"]
      },
      sampleInput: { items: [{ name: "Aquarium", price: 21000 }, { name: "Pork Soup", price: 10000 }, { name: "Subway", price: 2800 }] },
      codeSnippet: `useWebMCP({
  name: "estimate_cost",
  description: "Estimate total budget",
  inputSchema: {
    type: "object",
    properties: { items: { type: "array" } },
    required: ["items"]
  },
  execute: async ({ items }) => sumCost(items)
});`
    },

    [TOOL_NAMES.GET_WEATHER]: {
      name: TOOL_NAMES.GET_WEATHER,
      label: "get_weather (Busan Weather Inquiry)",
      type: "READ",
      policy: "ALLOW",
      description: "Returns live Busan weather condition, temperature, and rainy day recommendations.",
      inputSchema: { type: "object", properties: {} },
      sampleInput: {},
      codeSnippet: `useWebMCP({
  name: "get_weather",
  description: "Get Busan live weather",
  inputSchema: { type: "object", properties: {} },
  execute: async () => fetchBusanWeather()
});`
    },

    [TOOL_NAMES.GET_ITINERARY]: {
      name: TOOL_NAMES.GET_ITINERARY,
      label: "get_itinerary (Active Itinerary Query)",
      type: "READ",
      policy: "ALLOW",
      description: "Returns current active 6-hour itinerary sequence.",
      inputSchema: { type: "object", properties: {} },
      sampleInput: {},
      codeSnippet: `useWebMCP({
  name: "get_itinerary",
  description: "Get active itinerary",
  inputSchema: { type: "object", properties: {} },
  execute: async () => getActiveItinerary()
});`
    },

    [TOOL_NAMES.UPDATE_ITINERARY]: {
      name: TOOL_NAMES.UPDATE_ITINERARY,
      label: "update_itinerary (Update 6h Itinerary Timeline)",
      type: "WRITE",
      policy: "ALLOW",
      description: "Replaces or updates the active 6-hour itinerary timeline items.",
      inputSchema: {
        type: "object",
        properties: {
          items: { type: "array", description: "Array of scheduled items" }
        },
        required: ["items"]
      },
      sampleInput: { items: [{ time: "11:30", title: "Lunch Pork Soup", cost: 10000 }, { time: "13:00", title: "Aquarium Visit", cost: 21000 }] },
      codeSnippet: `useWebMCP({
  name: "update_itinerary",
  description: "Update itinerary timeline",
  inputSchema: {
    type: "object",
    properties: { items: { type: "array" } },
    required: ["items"]
  },
  execute: async ({ items }) => saveItineraryToD1(items)
});`
    },

    [TOOL_NAMES.REQUEST_RESERVATION]: {
      name: TOOL_NAMES.REQUEST_RESERVATION,
      label: "request_reservation (Request Reservation - Sensitive Action)",
      type: "SENSITIVE",
      policy: "ASK",
      description: "Requests venue or restaurant reservation. Triggers mandatory Human Approval modal before execution.",
      inputSchema: {
        type: "object",
        properties: {
          targetName: { type: "string", description: "Venue Name" },
          time: { type: "string", description: "Reservation Time Slot" },
          partySize: { type: "number", description: "Guest count" },
          estimatedCost: { type: "number", description: "Estimated cost in KRW" }
        },
        required: ["targetName", "time", "partySize"]
      },
      sampleInput: { targetName: "Ocean View Buffet & Aqua Restaurant", time: "17:30", partySize: 2, estimatedCost: 48000 },
      codeSnippet: `useWebMCP({
  name: "request_reservation",
  description: "Request reservation with Human Approval",
  inputSchema: {
    type: "object",
    properties: {
      targetName: { type: "string" },
      time: { type: "string" },
      partySize: { type: "number" }
    },
    required: ["targetName", "time", "partySize"]
  },
  execute: async (params) => {
    // Triggers Human Approval Modal
    const approved = await requestHumanApproval(params);
    if (!approved) throw new Error("User Rejected");
    return executeReservationInD1(params);
  }
});`
    }
  };

  const activeSpec = toolSpecs[selectedTool] || toolSpecs[TOOL_NAMES.SEARCH_PLACES];

  const handleRunLiveTest = async () => {
    setIsExecuting(true);
    setLiveTestResult(null);
    const startMs = Date.now();
    try {
      const handler = toolHandlers.current?.[selectedTool];
      let res = null;
      if (handler) {
        res = await handler(activeSpec.sampleInput);
      } else {
        res = { message: "Mock execution succeeded", input: activeSpec.sampleInput };
      }
      setLiveTestResult({
        status: "200 OK",
        latencyMs: Date.now() - startMs,
        data: res
      });
    } catch (err) {
      setLiveTestResult({
        status: "ERROR",
        latencyMs: Date.now() - startMs,
        error: err.message
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Documentation Banner */}
      <div className="glass-panel-glow" style={{ padding: "1.5rem 1.75rem", borderRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <BookOpen size={24} color="#00f2fe" />
            <h2 style={{ fontSize: "1.3rem", margin: 0, color: "#ffffff" }}>
              WebMCP Technical Documentation & Live Schema Inspector
            </h2>
          </div>
          <span className="badge badge-allow" style={{ padding: "0.3rem 0.75rem", fontSize: "0.78rem" }}>
            Chrome WebMCP Spec v2026
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
          Technical specification of the <strong>10 explicit WebMCP Tool API Schemas</strong> and <strong>Agent Permission Governance Wallet</strong> exposed by HelloBusan to browser AI agents.
        </p>
      </div>

      {/* Main 2-Column Inspector Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.25rem", alignItems: "start" }}>
        
        {/* Left Column: 10 Tools Selector List */}
        <div className="glass-panel" style={{ padding: "1rem" }}>
          <h3 style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Layers size={16} color="#00f2fe" /> WebMCP Tool Registry
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {Object.keys(toolSpecs).map((name) => {
              const spec = toolSpecs[name];
              const isSelected = selectedTool === name;
              return (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedTool(name);
                    setLiveTestResult(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "8px",
                    border: isSelected ? "1px solid rgba(0, 242, 254, 0.5)" : "1px solid var(--border)",
                    background: isSelected ? "rgba(0, 242, 254, 0.12)" : "rgba(15, 23, 42, 0.6)",
                    color: isSelected ? "#00f2fe" : "var(--text-main)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                      {spec.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                      {spec.label.split(" (")[1]?.replace(")", "")}
                    </div>
                  </div>

                  <span className={`badge ${spec.type === "READ" ? "badge-allow" : spec.type === "WRITE" ? "badge-ask" : "badge-deny"}`} style={{ fontSize: "0.6rem" }}>
                    {spec.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Tool Detail & Live Sandbox */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Tool Overview Card */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <h3 style={{ fontSize: "1.25rem", margin: 0, color: "#00f2fe", fontFamily: "var(--font-mono)" }}>
                    {activeSpec.name}
                  </h3>
                  <span className={`badge ${activeSpec.type === "READ" ? "badge-allow" : activeSpec.type === "WRITE" ? "badge-ask" : "badge-deny"}`}>
                    TYPE: {activeSpec.type}
                  </span>
                  <span className="badge badge-ask" style={{ fontSize: "0.68rem" }}>
                    Default Policy: {activeSpec.policy}
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                  {activeSpec.description}
                </p>
              </div>

              <button
                onClick={handleRunLiveTest}
                disabled={isExecuting}
                className="btn-primary"
                style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}
              >
                {isExecuting ? "Executing..." : <><Play size={15} fill="currentColor" /> Test Run Tool</>}
              </button>
            </div>

            {/* JSON Schema Viewer */}
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ fontSize: "0.85rem", color: "#34d399", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Terminal size={15} /> JSON Schema Definition (inputSchema)
              </h4>
              <pre style={{
                background: "#070913",
                border: "1px solid var(--border)",
                padding: "1rem",
                borderRadius: "10px",
                fontSize: "0.78rem",
                color: "#00f2fe",
                fontFamily: "var(--font-mono)",
                maxHeight: "220px",
                overflow: "auto"
              }}>
                {JSON.stringify(activeSpec.inputSchema, null, 2)}
              </pre>
            </div>

            {/* Code Snippet */}
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "#a855f7", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FileCode size={15} /> WebMCP Registration Implementation (`useWebMCP`)
              </h4>
              <pre style={{
                background: "#070913",
                border: "1px solid var(--border)",
                padding: "1rem",
                borderRadius: "10px",
                fontSize: "0.78rem",
                color: "#e2e8f0",
                fontFamily: "var(--font-mono)",
                maxHeight: "220px",
                overflow: "auto"
              }}>
                {activeSpec.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Live Test Run Sandbox Result */}
          {liveTestResult && (
            <div className="glass-panel-glow" style={{ padding: "1.25rem", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <strong style={{ fontSize: "0.95rem", color: "#ffffff" }}>
                    Live Execution Result ({liveTestResult.status})
                  </strong>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Latency: {liveTestResult.latencyMs} ms
                </span>
              </div>

              <pre style={{
                background: "#070913",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                padding: "0.85rem",
                borderRadius: "8px",
                fontSize: "0.78rem",
                color: "#34d399",
                fontFamily: "var(--font-mono)",
                maxHeight: "250px",
                overflow: "auto"
              }}>
                {JSON.stringify(liveTestResult.data, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
