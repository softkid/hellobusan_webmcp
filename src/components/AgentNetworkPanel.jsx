import React from "react";
import { Network, Server, Layers, Cpu, ShieldCheck } from "lucide-react";
import { DEFAULT_PERMISSIONS } from "../constants/webmcpConfig.js";

export default function AgentNetworkPanel() {
  return (
    <div className="glass-panel" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Network size={20} color="#00f2fe" />
          <h2 style={{ fontSize: "1.05rem", margin: 0 }}>Busan WebMCP Tool Network</h2>
        </div>
        <span className="badge badge-allow">10 Schema Tools Connected</span>
      </div>

      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
        부산의 장소, 식당, 문화, 교통, 예약 서비스가 브라우저 WebMCP 프로토콜을 통해 AI Agent에게 개방된 10개 도구 네트워크입니다.
      </p>

      {/* Grid of WebMCP Registered Services */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.6rem" }}>
        {Object.entries(DEFAULT_PERMISSIONS).map(([toolName, meta]) => (
          <div
            key={toolName}
            style={{
              background: "rgba(10, 15, 30, 0.7)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.6rem 0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-main)" }}>
                {meta.label.split(" (")[0]}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                {toolName}
              </div>
            </div>

            <span
              className={`badge ${
                meta.type === "READ" ? "badge-allow" : meta.type === "WRITE" ? "badge-ask" : "badge-deny"
              }`}
              style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}
            >
              {meta.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
