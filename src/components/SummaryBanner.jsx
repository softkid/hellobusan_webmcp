import React from "react";
import { CheckCircle2, Lock, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";

export default function SummaryBanner({ currentStep, onReset }) {
  return (
    <div className="glass-panel-glow" style={{
      padding: "1.5rem 1.75rem",
      marginBottom: "1.25rem",
      borderRadius: "16px",
      background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 25, 48, 0.95) 100%)",
      border: "1px solid rgba(0, 242, 254, 0.4)",
      boxShadow: "0 0 30px rgba(0, 242, 254, 0.15)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={20} color="#00f2fe" />
            <h2 style={{ fontSize: "1.2rem", margin: 0, color: "#ffffff", letterSpacing: "0.02em" }}>
              YOUR AGENT USED 7 BUSAN SERVICES
            </h2>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {currentStep}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-allow" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
            <ShieldCheck size={14} /> YOU STAYED IN CONTROL
          </span>
        </div>
      </div>

      {/* Proof Checklist Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", fontSize: "0.82rem", color: "var(--text-main)", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <CheckCircle2 size={16} color="#34d399" /> Weather Checked (80% Precip)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <CheckCircle2 size={16} color="#34d399" /> 12 Places Searched
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <CheckCircle2 size={16} color="#34d399" /> 8 Restaurants Compared
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <CheckCircle2 size={16} color="#34d399" /> 4 Routes Calculated
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <CheckCircle2 size={16} color="#34d399" /> Budget Optimized (₩50,000 limit)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <CheckCircle2 size={16} color="#34d399" /> 6h Itinerary Created
        </div>
      </div>

      {/* Safety Badges */}
      <div style={{
        padding: "0.75rem 1rem",
        borderRadius: "10px",
        background: "rgba(0,0,0,0.4)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "0.8rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#ffb703", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <AlertTriangle size={14} /> Reservation requires human approval
          </span>
          <span style={{ color: "#ff6b6b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Lock size={14} /> Payment was never accessible
          </span>
        </div>

        <button onClick={onReset} className="btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}>
          Try Another Goal
        </button>
      </div>
    </div>
  );
}
