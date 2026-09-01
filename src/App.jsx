import React, { useState, useRef, useCallback } from "react";
import Header from "./components/Header.jsx";
import SwarmPanel from "./components/SwarmPanel.jsx";
import AgentWallet from "./components/AgentWallet.jsx";
import AIPlanMap from "./components/AIPlanMap.jsx";
import WebMcpNetwork from "./components/WebMcpNetwork.jsx";

import AgentActivity from "./components/AgentActivity.jsx";
import AgentBlackBox from "./components/AgentBlackBox.jsx";
import WebMcpEvaluation from "./components/WebMcpEvaluation.jsx";
import AgentAssistant from "./components/AgentAssistant.jsx";

import ApprovalModal from "./components/ApprovalModal.jsx";
import WebMCPBenchmark from "./components/WebMCPBenchmark.jsx";
import WebMCPDoc from "./components/WebMCPDoc.jsx";
import Footer from "./components/Footer.jsx";

import useHelloBusanMCP from "./hooks/useHelloBusanMCP.js";
import { runSwarmOrchestration } from "./services/swarmEngine.js";
import { fetchPlacesFromWorker, fetchRestaurantsFromWorker } from "./services/apiService.js";
import { DEFAULT_PERMISSIONS, TOOL_NAMES } from "./constants/webmcpConfig.js";
import { BUSAN_PLACES, BUSAN_RESTAURANTS, BUSAN_EVENTS, BUSAN_WEATHER } from "./data/mockBusanData.js";

export default function App() {
  const [lang, setLang] = useState("en"); // "en" (default) | "ko"
  const [activeTab, setActiveTab] = useState("workspace"); // workspace | doc | benchmark
  const [goalPrompt, setGoalPrompt] = useState("Today, make a 6-hour Busan trip for family with a kid under ₩50,000.");
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [budgetLimit, setBudgetLimit] = useState(50000);

  // Google Authenticated User State
  const [user, setUser] = useState({
    name: "Kim Minjun",
    email: "minjun.kim@gmail.com",
    picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    plan: "Premium Plan",
    isAuthenticated: true
  });

  const [itinerary, setItinerary] = useState([]);
  const [blackBoxLogs, setBlackBoxLogs] = useState([]);
  const [agentState, setAgentState] = useState({
    isWorking: false,
    isFinished: false,
    currentStep: "Swarm Agents Ready"
  });

  const [approvalModalPayload, setApprovalModalPayload] = useState(null);
  const approvalResolverRef = useRef(null);

  // Implement 10 WebMCP Tool Handlers connected to Cloudflare Worker & D1
  const toolHandlers = useRef({
    [TOOL_NAMES.SEARCH_PLACES]: async (query = {}) => {
      const workerPlaces = await fetchPlacesFromWorker(query);
      if (workerPlaces && workerPlaces.length > 0) return workerPlaces;

      let filtered = BUSAN_PLACES;
      if (query.district) filtered = filtered.filter((p) => p.district.includes(query.district));
      if (query.maxPrice) filtered = filtered.filter((p) => p.priceMin <= query.maxPrice);
      if (query.isIndoor) filtered = filtered.filter((p) => p.isIndoor);
      if (query.childFriendly) filtered = filtered.filter((p) => p.childFriendly);
      return filtered;
    },

    [TOOL_NAMES.SEARCH_RESTAURANTS]: async (query = {}) => {
      const workerRest = await fetchRestaurantsFromWorker(query);
      if (workerRest && workerRest.length > 0) return workerRest;

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
        rainSafetyNotice: "Underground walkway connection within 2 min walk"
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
  };

  const handleReject = () => {
    setApprovalModalPayload(null);
    if (approvalResolverRef.current) approvalResolverRef.current(false);
  };

  // Run Swarm Multi-Agent Execution Workflow
  const handleRunAgent = async () => {
    setBlackBoxLogs([]);
    setItinerary([]);
    setAgentState({ isWorking: true, isFinished: false, currentStep: "Initializing Swarm Agents..." });

    await runSwarmOrchestration({
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
    setGoalPrompt(lang === "en" ? "Today, make a 6-hour Busan trip for family with a kid under ₩50,000." : "오늘 아이와 5만원으로 부산에서 6시간 즐길 수 있는 코스를 만들어줘.");
    setItinerary([]);
    setBlackBoxLogs([]);
    setPermissions(DEFAULT_PERMISSIONS);
    setBudgetLimit(50000);
    setAgentState({ isWorking: false, isFinished: false, currentStep: "Swarm Agents Ready" });
  };

  const totalCost = itinerary.reduce((sum, item) => sum + (item.cost || 0), 0);

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0.85rem 1.25rem", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Header Bar with i18n & Google Auth */}
      <Header
        goalPrompt={goalPrompt}
        setGoalPrompt={setGoalPrompt}
        isWorking={agentState.isWorking}
        onRunAgent={handleRunAgent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        user={user}
        setUser={setUser}
      />

      {/* Main Tab Views */}
      {activeTab === "benchmark" ? (
        <WebMCPBenchmark lang={lang} />
      ) : activeTab === "doc" ? (
        <WebMCPDoc toolHandlers={toolHandlers} lang={lang} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
          
          {/* Multi-Agent Swarm Visualizer Panel */}
          <SwarmPanel isWorking={agentState.isWorking} currentStep={agentState.currentStep} lang={lang} />

          {/* Top Row: 3 Panels Responsive Grid */}
          <div className="top-grid-container" style={{ display: "grid", gridTemplateColumns: "270px 1fr 310px", gap: "0.85rem", minHeight: "500px", alignItems: "stretch" }}>
            
            {/* Left Panel: Agent Wallet */}
            <AgentWallet
              permissions={permissions}
              setPermissions={setPermissions}
              budgetLimit={budgetLimit}
              setBudgetLimit={setBudgetLimit}
              lang={lang}
            />

            {/* Center Panel: AI Plan & Interactive Map */}
            <AIPlanMap
              itinerary={itinerary}
              totalCost={totalCost}
              dailyBudgetLimit={budgetLimit}
              lang={lang}
            />

            {/* Right Panel: WebMCP Network */}
            <div className="network-panel-grid">
              <WebMcpNetwork lang={lang} />
            </div>

          </div>

          {/* Bottom Row: 4 Panels Responsive Grid */}
          <div className="bottom-grid-container" style={{ display: "grid", gridTemplateColumns: "260px 1.4fr 1.3fr 260px", gap: "0.85rem", minHeight: "220px", alignItems: "stretch" }}>
            
            {/* Panel 1: Agent Activity */}
            <AgentActivity logs={blackBoxLogs} lang={lang} />

            {/* Panel 2: Agent Black Box */}
            <AgentBlackBox lang={lang} />

            {/* Panel 3: WebMCP Evaluation */}
            <WebMcpEvaluation lang={lang} />

            {/* Panel 4: Agent Assistant */}
            <AgentAssistant lang={lang} />

          </div>

          {/* Footer Tagline */}
          <Footer lang={lang} />

        </div>
      )}

      {/* Human-in-the-Loop Approval Modal Dialog with WebAuthn Passkey */}
      <ApprovalModal
        payload={approvalModalPayload}
        onApprove={handleApprove}
        onReject={handleReject}
        lang={lang}
      />
    </div>
  );
}
