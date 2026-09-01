import React from "react";
import { Plus } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function WebMcpNetwork({ lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const serviceCategories = [
    { title: t.restaurants, count: "4 Tools", icon: "🍜" },
    { title: t.culture, count: "3 Tools", icon: "🎭" },
    { title: t.experience, count: "2 Tools", icon: "🎡" },
    { title: t.transport, count: "2 Tools", icon: "🚇" },
    { title: t.stay, count: "2 Tools", icon: "🏨" },
    { title: t.attractions, count: "2 Tools", icon: "🏞️" }
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
    <div className="glass-panel" style={{ padding: "0.85rem", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div>
          <h2 style={{ fontSize: "0.92rem", margin: 0, color: "#ffffff", letterSpacing: "0.01em" }}>
            {t.networkTitle}
          </h2>
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.networkSub}</span>
        </div>
        <span className="badge-status badge-allow" style={{ fontSize: "0.65rem" }}>
          {t.toolsCount}
        </span>
      </div>

      {/* 6 Category Service Grid (2 Comfortable Columns) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.4rem", marginBottom: "0.75rem" }}>
        {serviceCategories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(10, 15, 26, 0.7)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "0.4rem 0.45rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <span style={{ fontSize: "1rem" }}>{cat.icon}</span>
            <div style={{ overflow: "hidden" }}>
              <strong style={{ fontSize: "0.7rem", color: "#ffffff", display: "block", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat.title}</strong>
              <span style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}>{cat.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Tools List */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
          {t.activeTools}
        </span>
        <span style={{ fontSize: "0.65rem", color: "#34d399", fontFamily: "var(--font-mono)" }}>
          ◆ 7/18 Active
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1, overflowY: "auto", paddingRight: "0.2rem" }}>
        {activeTools.map((tool, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.4rem 0.55rem",
              borderRadius: "6px",
              background: "rgba(10, 15, 26, 0.6)",
              border: "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", overflow: "hidden" }}>
              <span className="pulse-dot" style={{ width: "6px", height: "6px", flexShrink: 0 }}></span>
              <div style={{ overflow: "hidden" }}>
                <strong style={{ fontSize: "0.72rem", color: "#ffffff", fontFamily: "var(--font-mono)", display: "block", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tool.name}
                </strong>
                <span style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tool.domain}
                </span>
              </div>
            </div>

            <span className={`badge-status ${tool.statusColor}`} style={{ fontSize: "0.58rem", flexShrink: 0 }}>
              {tool.type}
            </span>
          </div>
        ))}
      </div>

      {/* Add Tool Button */}
      <button
        className="btn-secondary"
        style={{
          marginTop: "0.6rem",
          padding: "0.35rem",
          justifyContent: "center",
          fontSize: "0.72rem",
          borderColor: "rgba(0, 242, 254, 0.25)",
          color: "#00f2fe"
        }}
      >
        <Plus size={13} /> {t.connectNewTool}
      </button>

    </div>
  );
}
