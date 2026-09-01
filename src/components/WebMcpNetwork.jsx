import React from "react";
import { Network, Plus, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function WebMcpNetwork() {
  const serviceCategories = [
    { title: "음식점", subtitle: "Restaurants", count: "4 Tools", icon: "🍜" },
    { title: "문화/전시", subtitle: "Culture", count: "3 Tools", icon: "🎭" },
    { title: "체험", subtitle: "Experience", count: "2 Tools", icon: "🎡" },
    { title: "교통", subtitle: "Transport", count: "2 Tools", icon: "🚇" },
    { title: "숙소", subtitle: "Stay", count: "2 Tools", icon: "🏨" },
    { title: "관광지", subtitle: "Attraction", count: "2 Tools", icon: "🏞️" }
  ];

  const activeTools = [
    { name: "search_restaurants", domain: "busanfood.go.kr", type: "READ", statusColor: "badge-read" },
    { name: "search_entities", domain: "culture.busan.go.kr", type: "READ", statusColor: "badge-read" },
    { name: "calculate_route", domain: "busan-traffic.go.kr", type: "READ", statusColor: "badge-read" },
    { name: "check_availability", domain: "booking.busan.go.kr", type: "READ", statusColor: "badge-read" },
    { name: "create_itinerary", domain: "agentic-busan.app", type: "WRITE", statusColor: "badge-ask" },
    { name: "reserve_entity", domain: "booking.busan.go.kr", type: "USER APPROVAL", statusColor: "badge-deny" },
    { name: "estimate_cost", domain: "pricing.busan.go.kr", type: "READ", statusColor: "badge-read" }
  ];

  return (
    <div className="glass-panel" style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "0.95rem", margin: 0, color: "#ffffff", letterSpacing: "0.01em" }}>
            WEBMCP NETWORK
          </h2>
          <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>연결된 부산 웹 서비스</span>
        </div>
        <span className="badge-status badge-allow" style={{ fontSize: "0.68rem" }}>
          18 Tools
        </span>
      </div>

      {/* 6 Category Service Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.45rem", marginBottom: "0.85rem" }}>
        {serviceCategories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(10, 15, 26, 0.7)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.45rem 0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
            <div>
              <strong style={{ fontSize: "0.72rem", color: "#ffffff", display: "block", lineHeight: 1 }}>{cat.title}</strong>
              <span style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}>{cat.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Tools List */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
          ACTIVE TOOLS <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>활성화된 도구</span>
        </span>
        <span style={{ fontSize: "0.68rem", color: "#34d399", fontFamily: "var(--font-mono)" }}>
          ◆ 7/18
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1, overflowY: "auto", paddingRight: "0.2rem" }}>
        {activeTools.map((tool, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.45rem 0.65rem",
              borderRadius: "6px",
              background: "rgba(10, 15, 26, 0.6)",
              border: "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span className="pulse-dot" style={{ width: "6px", height: "6px" }}></span>
              <div>
                <strong style={{ fontSize: "0.75rem", color: "#ffffff", fontFamily: "var(--font-mono)", display: "block", lineHeight: 1 }}>
                  {tool.name}
                </strong>
                <span style={{ fontSize: "0.62rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  {tool.domain}
                </span>
              </div>
            </div>

            <span className={`badge-status ${tool.statusColor}`} style={{ fontSize: "0.6rem" }}>
              {tool.type}
            </span>
          </div>
        ))}
      </div>

      {/* Add Tool Button */}
      <button
        className="btn-secondary"
        style={{
          marginTop: "0.75rem",
          padding: "0.4rem",
          justifyContent: "center",
          fontSize: "0.75rem",
          borderColor: "rgba(0, 242, 254, 0.25)",
          color: "#00f2fe"
        }}
      >
        <Plus size={14} /> 새 도구 연결하기
      </button>

    </div>
  );
}
