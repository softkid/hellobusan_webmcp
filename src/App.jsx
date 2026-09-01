import React, { useState, useRef, useCallback } from "react";
import Header from "./components/Header.jsx";
import GoalInput from "./components/GoalInput.jsx";
import AgentWallet from "./components/AgentWallet.jsx";
import BusanMap from "./components/BusanMap.jsx";
import ItineraryView from "./components/ItineraryView.jsx";
import BlackBoxLog from "./components/BlackBoxLog.jsx";
import ApprovalModal from "./components/ApprovalModal.jsx";
import WebMCPBenchmark from "./components/WebMCPBenchmark.jsx";
import AgentNetworkPanel from "./components/AgentNetworkPanel.jsx";
import SummaryBanner from "./components/SummaryBanner.jsx";

import useHelloBusanMCP from "./hooks/useHelloBusanMCP.js";
import { runAgentWorkflow } from "./services/agentEngine.js";
import { DEFAULT_PERMISSIONS, PRESET_GOALS, TOOL_NAMES } from "./constants/webmcpConfig.js";
import { BUSAN_PLACES, BUSAN_RESTAURANTS, BUSAN_EVENTS, BUSAN_WEATHER } from "./data/mockBusanData.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("workspace"); // workspace | benchmark
  const [goalPrompt, setGoalPrompt] = useState(PRESET_GOALS[0].prompt);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [budgetLimit, setBudgetLimit] = useState(50000);

  const [itinerary, setItinerary] = useState([]);
  const [blackBoxLogs, setBlackBoxLogs] = useState([]);
  const [agentState, setAgentState] = useState({
    isWorking: false,
    isFinished: false,
    currentStep: "Ready"
  });

  const [approvalModalPayload, setApprovalModalPayload] = useState(null);
  const approvalResolverRef = useRef(null);

  // Implement 10 WebMCP Tool Handlers
  const toolHandlers = useRef({
    [TOOL_NAMES.SEARCH_PLACES]: async (query = {}) => {
      let filtered = BUSAN_PLACES;
      if (query.district) filtered = filtered.filter((p) => p.district.includes(query.district));
      if (query.maxPrice) filtered = filtered.filter((p) => p.priceMin <= query.maxPrice);
      if (query.isIndoor) filtered = filtered.filter((p) => p.isIndoor);
      if (query.childFriendly) filtered = filtered.filter((p) => p.childFriendly);
      return filtered;
    },

    [TOOL_NAMES.SEARCH_RESTAURANTS]: async (query = {}) => {
      let filtered = BUSAN_RESTAURANTS;
      if (query.district) filtered = filtered.filter((r) => r.district.includes(query.district));
      if (query.maxPriceAvg) filtered = filtered.filter((r) => r.priceAvg <= query.maxPriceAvg);
      if (query.childFriendly) filtered = filtered.filter((r) => r.childFriendly);
      return filtered;
    },

    [TOOL_NAMES.SEARCH_EVENTS]: async (query = {}) => {
      let filtered = BUSAN_EVENTS;
      if (query.district) filtered = filtered.filter((e) => e.district.includes(query.district));
      if (query.isIndoor) filtered = filtered.filter((e) => e.isIndoor);
      return filtered;
    },

    [TOOL_NAMES.GET_PLACE_DETAILS]: async ({ placeId }) => {
      return BUSAN_PLACES.find((p) => p.id === placeId) || null;
    },

    [TOOL_NAMES.CALCULATE_ROUTE]: async ({ originId, destinationId }) => {
      return {
        originId,
        destinationId,
        distanceKm: 3.4,
        durationMinutes: 12,
        mode: "Subway / Indoor Transit",
        transitFee: 2800,
        rainSafetyNotice: "도보 2분 이내 지하 연결 통로 이용"
      };
    },

    [TOOL_NAMES.ESTIMATE_COST]: async ({ items = [] }) => {
      const totalCost = items.reduce((sum, item) => sum + (item.price || item.cost || item.priceMin || item.priceAvg || 0), 0);
      return { totalCost, itemCount: items.length };
    },

    [TOOL_NAMES.GET_WEATHER]: async () => {
      return BUSAN_WEATHER;
    },

    [TOOL_NAMES.GET_ITINERARY]: async () => {
      return itinerary;
    },

    [TOOL_NAMES.UPDATE_ITINERARY]: async ({ items }) => {
      setItinerary(items);
      return { status: "success", count: items.length };
    },

    [TOOL_NAMES.REQUEST_RESERVATION]: async (params) => {
      return {
        reservationId: "RES-BSN-" + Math.floor(100000 + Math.random() * 900000),
        status: "CONFIRMED",
        targetName: params.targetName,
        time: params.time,
        partySize: params.partySize,
        timestamp: new Date().toISOString()
      };
    }
  });

  // Register WebMCP Tools in Browser Runtime
  useHelloBusanMCP(toolHandlers);

  // Handle Human Approval Request
  const handleRequestApproval = useCallback((payload) => {
    return new Promise((resolve) => {
      setApprovalModalPayload(payload);
      approvalResolverRef.current = resolve;
    });
  }, []);

  const handleApprove = () => {
    setApprovalModalPayload(null);
    if (approvalResolverRef.current) approvalResolverRef.current(true);
  },
  handleReject = () => {
    setApprovalModalPayload(null);
    if (approvalResolverRef.current) approvalResolverRef.current(false);
  };

  // Run Agent Execution Workflow
  const handleRunAgent = async () => {
    setBlackBoxLogs([]);
    setItinerary([]);
    setAgentState({ isWorking: true, isFinished: false, currentStep: "Initializing Agent Planner..." });

    await runAgentWorkflow({
      goalPrompt,
      permissionsWallet: permissions,
      dailyBudgetLimit: budgetLimit,
      toolHandlers,
      onLogEvent: (log) => setBlackBoxLogs((prev) => [...prev, log]),
      onRequestApproval: handleRequestApproval,
      onStateUpdate: (state) => setAgentState((prev) => ({ ...prev, ...state }))
    });
  };

  // Reset Demo
  const handleReset = () => {
    setGoalPrompt(PRESET_GOALS[0].prompt);
    setItinerary([]);
    setBlackBoxLogs([]);
    setPermissions(DEFAULT_PERMISSIONS);
    setBudgetLimit(50000);
    setAgentState({ isWorking: false, isFinished: false, currentStep: "Ready" });
  };

  const totalCost = itinerary.reduce((sum, item) => sum + (item.cost || 0), 0);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.25rem 1.5rem" }}>
      {/* Header */}
      <Header
        toolCount={Object.keys(DEFAULT_PERMISSIONS).length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
      />

      {/* Main Tab Views */}
      {activeTab === "benchmark" ? (
        <WebMCPBenchmark />
      ) : (
        <>
          {/* Natural Language Goal Input Bar */}
          <GoalInput
            goalPrompt={goalPrompt}
            setGoalPrompt={setGoalPrompt}
            isWorking={agentState.isWorking}
            onRunAgent={handleRunAgent}
          />

          {/* Outcome Summary Banner (Appears when finished) */}
          {agentState.isFinished && (
            <SummaryBanner currentStep={agentState.currentStep} onReset={handleReset} />
          )}

          {/* Main Workspace 3-Column Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "310px 1fr 370px", gap: "1rem", alignItems: "start" }}>
            
            {/* Left Column: Agent Permission Wallet & Network */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <AgentWallet
                permissions={permissions}
                setPermissions={setPermissions}
                budgetLimit={budgetLimit}
                setBudgetLimit={setBudgetLimit}
              />
              <AgentNetworkPanel />
            </div>

            {/* Middle Column: Busan Map & Itinerary Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <BusanMap itinerary={itinerary} />
              <ItineraryView itinerary={itinerary} totalCost={totalCost} budgetLimit={budgetLimit} />
            </div>

            {/* Right Column: Agent Black Box Audit Log */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <BlackBoxLog logs={blackBoxLogs} />
            </div>

          </div>
        </>
      )}

      {/* Human-in-the-Loop Approval Modal Dialog */}
      <ApprovalModal
        payload={approvalModalPayload}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
