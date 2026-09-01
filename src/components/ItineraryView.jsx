import React from "react";
import { Clock, MapPin, DollarSign, Umbrella, CheckCircle2 } from "lucide-react";

export default function ItineraryView({ itinerary, totalCost, budgetLimit }) {
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🗺️</div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.4rem", color: "var(--text-main)" }}>
          No Active Itinerary Yet
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "320px" }}>
          자연어 목표를 입력하고 <strong style={{ color: "#00f2fe" }}>LET MY AGENT WORK</strong> 버튼을 누르면 WebMCP Tool을 통해 맞춤 6시간 동선이 자동 생성됩니다.
        </p>
      </div>
    );
  }

  const isOverBudget = totalCost > budgetLimit;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.05rem", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Clock size={18} color="#00f2fe" /> 6-Hour Optimized Itinerary
          </h2>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            WebMCP search & route tools compiled sequence
          </span>
        </div>

        {/* Cost Summary Pill */}
        <div style={{
          background: isOverBudget ? "rgba(255, 82, 82, 0.15)" : "rgba(16, 185, 129, 0.15)",
          border: isOverBudget ? "1px solid rgba(255, 82, 82, 0.4)" : "1px solid rgba(16, 185, 129, 0.4)",
          padding: "0.35rem 0.85rem",
          borderRadius: "10px",
          textAlign: "right"
        }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Total Cost / Budget</div>
          <strong style={{
            fontSize: "0.95rem",
            color: isOverBudget ? "#ff6b6b" : "#34d399",
            fontFamily: "var(--font-mono)"
          }}>
            ₩{totalCost.toLocaleString()} / ₩{budgetLimit.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "380px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {itinerary.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: "0.85rem",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0.85rem",
              position: "relative"
            }}
          >
            {/* Timeline Number Pin */}
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: item.category.includes("Transit") ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
              color: item.category.includes("Transit") ? "var(--text-muted)" : "#070913",
              fontWeight: 700,
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {idx + 1}
            </div>

            {/* Item Details */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ fontSize: "0.9rem", margin: 0, color: "var(--text-main)" }}>
                  {item.title}
                </h4>
                <span className="badge badge-allow" style={{ fontSize: "0.68rem" }}>
                  {item.time}
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", margin: "0.3rem 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <span>📍 {item.location}</span>
                <span>•</span>
                <span style={{ color: "#34d399", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                  ₩{item.cost.toLocaleString()}
                </span>
                {item.note?.includes("우천") && (
                  <span style={{ color: "#ffb703", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    <Umbrella size={12} /> 우천 실내
                  </span>
                )}
              </div>

              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", margin: 0 }}>
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
