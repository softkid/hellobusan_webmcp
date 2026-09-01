import React from "react";
import { Shield, Lock, AlertTriangle, CheckCircle, Wallet } from "lucide-react";
import { TOOL_NAMES } from "../constants/webmcpConfig.js";

export default function AgentWallet({ permissions, setPermissions, budgetLimit, setBudgetLimit }) {
  const togglePolicy = (toolName) => {
    setPermissions((prev) => {
      const current = prev[toolName]?.policy || "ALLOW";
      let next = "ALLOW";
      if (current === "ALLOW") next = "ASK";
      else if (current === "ASK") next = "DENY";
      else next = "ALLOW";

      return {
        ...prev,
        [toolName]: {
          ...prev[toolName],
          policy: next
        }
      };
    });
  };

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", height: "100%" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={20} color="#00f2fe" />
          <h2 style={{ fontSize: "1.05rem", margin: 0 }}>Agent Wallet (권한 지갑)</h2>
        </div>
        <span className="badge badge-allow">Human Control</span>
      </div>

      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.4 }}>
        사람이 AI에게 허용할 권한의 범위를 직접 설정합니다. 권한 제약은 웹 및 브라우저 Execution Engine에서 엄격히 검증됩니다.
      </p>

      {/* Daily Budget Slider */}
      <div style={{
        background: "rgba(0,0,0,0.3)",
        padding: "0.85rem 1rem",
        borderRadius: "10px",
        border: "1px solid var(--border)",
        marginBottom: "1rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Wallet size={14} color="#00f2fe" /> Daily Spending Limit (일일 한도)
          </span>
          <strong style={{ fontSize: "0.95rem", color: "#00f2fe", fontFamily: "var(--font-mono)" }}>
            ₩{budgetLimit.toLocaleString()}
          </strong>
        </div>
        <input
          type="range"
          min="10000"
          max="200000"
          step="5000"
          value={budgetLimit}
          onChange={(e) => setBudgetLimit(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#00f2fe", cursor: "pointer" }}
        />
      </div>

      {/* Permission Tool List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "380px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {Object.entries(permissions).map(([toolName, def]) => {
          const policy = def.policy;
          return (
            <div
              key={toolName}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>
                  {def.label}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  {toolName}
                </div>
              </div>

              <button
                onClick={() => togglePolicy(toolName)}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                title="Click to toggle: ALLOW -> ASK -> DENY"
              >
                {policy === "ALLOW" && (
                  <span className="badge badge-allow" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <CheckCircle size={11} /> ALLOW
                  </span>
                )}
                {policy === "ASK" && (
                  <span className="badge badge-ask" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <AlertTriangle size={11} /> ASK
                  </span>
                )}
                {policy === "DENY" && (
                  <span className="badge badge-deny" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <Lock size={11} /> DENY
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Safety Guarantee */}
      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Lock size={13} color="#10b981" />
        <span>Direct Payment & Personal Data Mutations are hard-locked in MVP.</span>
      </div>
    </div>
  );
}
