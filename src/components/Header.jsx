import React from "react";
import { ShieldCheck, Cpu, Sparkles, BookOpen, User, CheckCircle2 } from "lucide-react";

export default function Header({ goalPrompt, setGoalPrompt, isWorking, onRunAgent, activeTab, setActiveTab }) {
  return (
    <header style={{ marginBottom: "1rem" }}>
      {/* Top Main Navigation Header */}
      <div className="glass-panel" style={{ padding: "0.85rem 1.25rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 15px rgba(0, 242, 254, 0.4)",
            fontWeight: 900,
            color: "#070a13",
            fontSize: "1.2rem",
            fontFamily: "var(--font-heading)"
          }}>
            A
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <h1 style={{ fontSize: "1.25rem", margin: 0, letterSpacing: "0.02em", color: "#ffffff" }}>
                AGENTIC BUSAN
              </h1>
              <span className="badge-status badge-allow" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>
                WEBMCP ENABLED
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
              The city is your interface.
            </p>
          </div>
        </div>

        {/* Center Goal Bar in Header */}
        <div style={{
          flex: 1,
          maxWidth: "520px",
          background: "rgba(10, 15, 26, 0.9)",
          border: "1px solid var(--border-active)",
          borderRadius: "10px",
          padding: "0.4rem 0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem"
        }}>
          <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontWeight: 700, flexShrink: 0 }}>
            YOUR GOAL
          </div>
          <input
            type="text"
            value={goalPrompt}
            onChange={(e) => setGoalPrompt(e.target.value)}
            placeholder="오늘 아이와 5만원으로 부산에서 6시간 즐길 수 있는 코스를 만들어줘."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "0.82rem",
              fontFamily: "var(--font-sans)"
            }}
          />
          <button
            onClick={onRunAgent}
            disabled={isWorking}
            style={{
              background: "linear-gradient(135deg, #7f56d9 0%, #9e77ed 100%)",
              border: "none",
              borderRadius: "8px",
              padding: "0.35rem 0.6rem",
              color: "#ffffff",
              cursor: isWorking ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Execute Agent Planner"
          >
            <Sparkles size={15} />
          </button>
        </div>

        {/* Right Controls: Safe Mode, Profile & Tab Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          
          {/* Safe Mode Badge */}
          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "0.35rem 0.7rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem"
          }}>
            <ShieldCheck size={16} color="#34d399" />
            <div>
              <strong style={{ color: "#34d399", display: "block", lineHeight: 1 }}>Safe Mode</strong>
              <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Human in Control</span>
            </div>
          </div>

          {/* User Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <User size={16} color="#94a3b8" />
            </div>
            <div style={{ fontSize: "0.75rem" }}>
              <strong style={{ color: "#ffffff", display: "block", lineHeight: 1.1 }}>Kim Minjun</strong>
              <span style={{ fontSize: "0.65rem", color: "#00f2fe" }}>Premium Plan</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", padding: "0.2rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <button
              onClick={() => setActiveTab("workspace")}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                background: activeTab === "workspace" ? "rgba(0, 242, 254, 0.15)" : "transparent",
                color: activeTab === "workspace" ? "#00f2fe" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              Workspace & Map
            </button>
            <button
              onClick={() => setActiveTab("doc")}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                background: activeTab === "doc" ? "rgba(52, 211, 153, 0.15)" : "transparent",
                color: activeTab === "doc" ? "#34d399" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              WebMCP Docs
            </button>
            <button
              onClick={() => setActiveTab("benchmark")}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: "6px",
                border: "none",
                background: activeTab === "benchmark" ? "rgba(127, 86, 217, 0.2)" : "transparent",
                color: activeTab === "benchmark" ? "#a855f7" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer"
              }}
            >
              Benchmark
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
