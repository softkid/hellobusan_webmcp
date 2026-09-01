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
      status: isWorking ? "ACTIVE" : "VERIFIED"
    },
    {
      id: "transit",
      name: "TransitAgent",
      role: "GIS Route & Rain Corridor",
      icon: MapPin,
      color: "#34d399",
      status: isWorking ? "ACTIVE" : "OPTIMIZED"
    },
    {
      id: "dining",
      name: "DiningCuratorAgent",
      role: "Kid-Friendly & Dietary Match",
      icon: Utensils,
      color: "#ffb703",
      status: isWorking ? "ACTIVE" : "MATCHED"
    },
    {
      id: "booking",
      name: "BookingAgent",
      role: "Passkey WebAuthn & Escrow",
      icon: BellRing,
      color: "#a855f7",
      status: isWorking ? "ACTIVE" : "PASSKEY SIGNED"
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: "0.6rem 0.85rem", borderRadius: "10px", marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Cpu size={15} color="#00f2fe" />
          <strong style={{ fontSize: "0.82rem", color: "#ffffff" }}>
            Multi-Agent Swarm Orchestration Engine
          </strong>
          <span className="badge-status badge-allow" style={{ fontSize: "0.58rem", padding: "0.05rem 0.35rem" }}>
            4 Parallel Sub-Agents
          </span>
        </div>

        {/* 4 Compact Agent Pills */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", flex: 1, justifySelf: "flex-end", justifyContent: "flex-end" }}>
          {agents.map((ag) => {
            const IconComponent = ag.icon;
            return (
              <div
                key={ag.id}
                style={{
                  background: "rgba(10, 15, 26, 0.7)",
                  border: `1px solid ${ag.color}40`,
                  borderRadius: "6px",
                  padding: "0.25rem 0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.72rem"
                }}
              >
                <IconComponent size={12} color={ag.color} />
                <span style={{ color: "#ffffff", fontWeight: 600 }}>{ag.name}</span>
                <span style={{ fontSize: "0.58rem", color: ag.color, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  ● {ag.status}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
