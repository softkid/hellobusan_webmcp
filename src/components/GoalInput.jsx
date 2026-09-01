import React from "react";
import { Play, Sparkles, CloudRain, Utensils, Rocket } from "lucide-react";
import { PRESET_GOALS } from "../constants/webmcpConfig.js";

export default function GoalInput({ goalPrompt, setGoalPrompt, isWorking, onRunAgent }) {
  return (
    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={18} color="#00f2fe" />
          <h2 style={{ fontSize: "1rem", margin: 0, color: "var(--text-main)" }}>
            Human Goal Specification (자연어 목표 정의)
          </h2>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
          AI Planner parses intent, constraints & spending policy
        </span>
      </div>

      {/* Preset Scenario Pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {PRESET_GOALS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setGoalPrompt(preset.prompt)}
            style={{
              background: goalPrompt === preset.prompt ? "rgba(0, 242, 254, 0.15)" : "rgba(255, 255, 255, 0.04)",
              border: goalPrompt === preset.prompt ? "1px solid rgba(0, 242, 254, 0.4)" : "1px solid var(--border)",
              color: goalPrompt === preset.prompt ? "#00f2fe" : "var(--text-muted)",
              padding: "0.4rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Input Box & Action */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
        <textarea
          value={goalPrompt}
          onChange={(e) => setGoalPrompt(e.target.value)}
          placeholder="부산에서 달성하고 싶은 목표를 자연어로 입력하세요..."
          rows={2}
          style={{
            flex: 1,
            background: "rgba(10, 15, 30, 0.9)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            color: "var(--text-main)",
            fontSize: "0.9rem",
            resize: "none",
            outline: "none",
            fontFamily: "var(--font-sans)"
          }}
        />
        <button
          onClick={onRunAgent}
          disabled={isWorking || !goalPrompt.trim()}
          className="btn-primary"
          style={{
            padding: "0 1.5rem",
            fontSize: "0.95rem",
            opacity: isWorking || !goalPrompt.trim() ? 0.6 : 1,
            cursor: isWorking ? "not-allowed" : "pointer"
          }}
        >
          {isWorking ? (
            <>
              <div className="spin-icon">⏳</div> Agent Working...
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" /> LET MY AGENT WORK
            </>
          )}
        </button>
      </div>
    </div>
  );
}
