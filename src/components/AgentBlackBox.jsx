import React from "react";
import { Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function AgentBlackBox({ lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="glass-panel" style={{ padding: "0.85rem", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div>
          <h3 style={{ fontSize: "0.85rem", margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Terminal size={14} color="#00f2fe" /> {t.blackBoxTitle}
          </h3>
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.blackBoxSub}</span>
        </div>
        
        <div style={{ display: "flex", gap: "0.2rem" }}>
          <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-muted)", padding: "0.15rem 0.35rem", cursor: "pointer" }}>
            <ChevronLeft size={12} />
          </button>
          <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-muted)", padding: "0.15rem 0.35rem", cursor: "pointer" }}>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Main Split Inspector View */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "0.6rem", flex: 1 }}>
        
        {/* Left Side: Decision Details */}
        <div style={{ background: "rgba(10, 15, 26, 0.8)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.6rem", fontSize: "0.7rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.3rem" }}>
            <span style={{ color: "#00f2fe", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              ⏱ 14:02:13 search_restaurants
            </span>
            <span style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: "0.62rem" }}>
              busanfood.go.kr
            </span>
          </div>

          <div>
            <span style={{ color: "var(--text-dim)", display: "block", fontSize: "0.62rem" }}>INPUT</span>
            <strong style={{ color: "#ffffff" }}>Budget ₩50,000, Child Friendly, Rating 4.0+, Korean/Japanese/Western</strong>
          </div>

          <div>
            <span style={{ color: "var(--text-dim)", display: "block", fontSize: "0.62rem" }}>OUTPUT</span>
            <span style={{ color: "#34d399", fontWeight: 700, fontFamily: "var(--font-mono)" }}>8 restaurants found</span>
          </div>

          <div>
            <span style={{ color: "var(--text-dim)", display: "block", fontSize: "0.62rem" }}>REASON</span>
            <span style={{ color: "var(--text-muted)" }}>Child friendly + high rating + budget filter applied</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <div>
              <span style={{ color: "var(--text-dim)", display: "block", fontSize: "0.62rem" }}>PERMISSION</span>
              <span className="badge-status badge-allow" style={{ fontSize: "0.6rem" }}>READ ({t.allow})</span>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", display: "block", fontSize: "0.62rem" }}>IMPACT</span>
              <span style={{ color: "#9e77ed", fontSize: "0.65rem" }}>Used to generate candidate itinerary</span>
            </div>
          </div>

        </div>

        {/* Right Side: Mini Map Preview */}
        <div style={{ background: "#080c16", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: "0.3rem", left: "0.3rem", fontSize: "0.6rem", color: "var(--text-dim)", zIndex: 2 }}>
            {t.selectedLocation}
          </div>

          <div style={{
            width: "100%", height: "100%",
            backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
            backgroundSize: "12px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{ position: "absolute", top: "35%", left: "40%", color: "#ffb703" }}>📍</div>
            <div style={{ position: "absolute", top: "55%", left: "60%", color: "#00f2fe" }}>📍</div>
            <div style={{ position: "absolute", top: "25%", left: "70%", color: "#00f2fe" }}>📍</div>
            <div style={{ position: "absolute", top: "65%", left: "30%", color: "#ffb703" }}>📍</div>
          </div>
        </div>

      </div>

    </div>
  );
}
