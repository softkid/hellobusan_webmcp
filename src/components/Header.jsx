import React from "react";
import { ShieldCheck, Cpu, RotateCcw, Sparkles, BookOpen } from "lucide-react";

export default function Header({ toolCount, activeTab, setActiveTab, onReset }) {
  return (
    <header className="glass-panel" style={{ padding: "1rem 1.5rem", marginBottom: "1rem", borderRadius: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "42px",
            height: "42px",
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(0, 242, 254, 0.4)"
          }}>
            <Cpu size={24} color="#070913" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "1.35rem", margin: 0, background: "linear-gradient(to right, #ffffff, #00f2fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                HELLOBUSAN
              </h1>
              <span className="badge badge-allow" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                WebMCP Enabled
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              Human-Controlled Agentic City Interface · <strong style={{ color: "#00f2fe" }}>You decide. Your agent acts. Busan responds.</strong>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", padding: "0.25rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveTab("workspace")}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "workspace" ? "rgba(0, 242, 254, 0.15)" : "transparent",
              color: activeTab === "workspace" ? "#00f2fe" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Sparkles size={16} /> Workspace & Map
          </button>
          
          <button
            onClick={() => setActiveTab("doc")}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "doc" ? "rgba(52, 211, 153, 0.15)" : "transparent",
              color: activeTab === "doc" ? "#34d399" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <BookOpen size={16} /> Docs & Tool Inspector
          </button>

          <button
            onClick={() => setActiveTab("benchmark")}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "benchmark" ? "rgba(127, 86, 217, 0.2)" : "transparent",
              color: activeTab === "benchmark" ? "#a855f7" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <ShieldCheck size={16} /> WebMCP Benchmark
          </button>
        </div>

        {/* Controls & Tools Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            padding: "0.4rem 0.8rem",
            borderRadius: "8px",
            border: "1px solid rgba(0, 242, 254, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8rem"
          }}>
            <span className="pulse-dot"></span>
            <span style={{ color: "var(--text-muted)" }}>Registered Tools:</span>
            <strong style={{ color: "#00f2fe", fontFamily: "var(--font-mono)" }}>{toolCount} Tools</strong>
          </div>

          <button onClick={onReset} className="btn-secondary" style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}>
            <RotateCcw size={14} /> Reset Demo
          </button>
        </div>

      </div>
    </header>
  );
}
