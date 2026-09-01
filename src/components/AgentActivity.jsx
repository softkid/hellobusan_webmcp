import React from "react";
import { Activity } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function AgentActivity({ logs, lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const defaultLogs = [
    { time: "14:02:11", name: "search_places", detail: "Kid-friendly indoor venue search", badge: "12 results", color: "badge-allow" },
    { time: "14:02:13", name: "search_restaurants", detail: "Filter dining under ₩50,000 budget", badge: "8 results", color: "badge-allow" },
    { time: "14:02:15", name: "calculate_route", detail: "Route time optimization", badge: "4 routes", color: "badge-allow" },
    { time: "14:02:18", name: "remove_activity", detail: "Exceeded budget items removed", badge: "3 removed", color: "badge-ask" },
    { time: "14:02:21", name: "reserve_restaurant", detail: "Check reservation availability", badge: "ASK APPROVAL", color: "badge-deny" }
  ];

  const activeLogs = logs && logs.length > 0 ? logs.map((l) => ({
    time: l.timestamp,
    name: l.toolName,
    detail: l.impactReason || "Tool Execution",
    badge: l.status === "ASK_APPROVAL" ? t.ask : l.status === "BLOCKED" ? t.deny : t.allow,
    color: l.status === "ASK_APPROVAL" ? "badge-ask" : l.status === "BLOCKED" ? "badge-deny" : "badge-allow"
  })) : defaultLogs;

  return (
    <div className="glass-panel" style={{ padding: "0.85rem", height: "100%", minHeight: "220px", display: "flex", flexDirection: "column" }}>
      
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div>
          <h3 style={{ fontSize: "0.85rem", margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Activity size={14} color="#00f2fe" /> {t.activityTitle}
          </h3>
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.activitySub}</span>
        </div>
        <span className="badge-status badge-allow" style={{ fontSize: "0.6rem" }}>
          {t.live}
        </span>
      </div>

      {/* Activity Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1, overflowY: "auto" }}>
        {activeLogs.map((log, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.4rem 0.5rem",
              borderRadius: "6px",
              background: "rgba(10, 15, 26, 0.6)",
              border: "1px solid var(--border)",
              fontSize: "0.72rem"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.65rem" }}>
                  {log.time}
                </span>
                <strong style={{ color: "#00f2fe", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                  {log.name}
                </strong>
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>
                {log.detail}
              </span>
            </div>

            <span className={`badge-status ${log.color}`} style={{ fontSize: "0.6rem" }}>
              {log.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
        <button style={{ background: "transparent", border: "none", color: "var(--text-dim)", fontSize: "0.7rem", cursor: "pointer" }}>
          {t.viewFullLog}
        </button>
      </div>

    </div>
  );
}
