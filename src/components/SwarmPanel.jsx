import React from "react";
import { Cpu, ShieldCheck, MapPin, Utensils, BellRing } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function SwarmPanel({ isWorking, currentStep, lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const agents = [
    {
      id: "gov",
      name: "GovernanceAgent",
      role: "Wallet Policy & Spending Limit",
      icon: ShieldCheck,
      color: "#00f2fe",
      status: isWorking ? "ACTIVE (Checking Caps)" : "STANDBY (Rule Verified)"
    },
    {
      id: "transit",
      name: "TransitAgent",
      role: "GIS Route & Rain Corridor",
      icon: MapPin,
      color: "#34d399",
      status: isWorking ? "ACTIVE (Parallel GIS Routing)" : "STANDBY (Subway Corridor Set)"
    },
    {
      id: "dining",
      name: "DiningCuratorAgent",
      role: "Kid-Friendly & Dietary Match",
      icon: Utensils,
      color: "#ffb703",
      status: isWorking ? "ACTIVE (Searching Dining)" : "STANDBY (Rating 4.8+ Matched)"
    },
    {
      id: "booking",
      name: "BookingAgent",
      role: "Passkey WebAuthn & Escrow",
      icon: BellRing,
      color: "#a855f7",
      status: isWorking ? "ACTIVE (Passkey Verification)" : "STANDBY (Passkey Signed)"
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: "0.85rem", borderRadius: "12px", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Cpu size={16} color="#00f2fe" />
          <h3 style={{ fontSize: "0.88rem", margin: 0, color: "#ffffff" }}>
            Multi-Agent Swarm Orchestration Engine
          </h3>
          <span className="badge-status badge-allow" style={{ fontSize: "0.6rem" }}>
            4 Parallel Sub-Agents
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          {currentStep}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
        {agents.map((ag) => {
          const IconComponent = ag.icon;
          return (
            <div
              key={ag.id}
              style={{
                background: "rgba(10, 15, 26, 0.8)",
                border: `1px solid ${ag.color}40`,
                borderRadius: "8px",
                padding: "0.5rem 0.65rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: `${ag.color}20`,
                border: `1px solid ${ag.color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <IconComponent size={14} color={ag.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontSize: "0.75rem", color: "#ffffff", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ag.name}
                </strong>
                <span style={{ fontSize: "0.62rem", color: "var(--text-dim)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ag.role}
                </span>
                <span style={{ fontSize: "0.6rem", color: ag.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  ● {ag.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
