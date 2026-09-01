import React, { useState } from "react";
import { Terminal, CheckCircle2, AlertTriangle, ShieldAlert, ChevronRight, Eye } from "lucide-react";

export default function BlackBoxLog({ logs }) {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", height: "100%" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Terminal size={20} color="#00f2fe" />
          <h2 style={{ fontSize: "1.05rem", margin: 0 }}>Agent Black Box (AI 행동 블랙박스)</h2>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          {logs.length} Tool Executions Recorded
        </span>
      </div>

      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
        AI Agent가 수행한 모든 WebMCP Tool 호출 과정, 파라미터, 권한 검증 및 판단 사유가 투명하게 기록됩니다.
      </p>

      {/* Audit Log Stream */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "350px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {logs.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-dim)", fontSize: "0.82rem" }}>
            [Standby] Agent execution logs will appear here when you run a goal...
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              style={{
                background: "rgba(10, 15, 30, 0.8)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                    [{log.timestamp}]
                  </span>
                  <strong style={{ fontSize: "0.85rem", color: "#00f2fe", fontFamily: "var(--font-mono)" }}>
                    {log.toolName}
                  </strong>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {log.status === "COMPLETED" && (
                    <span className="badge badge-allow" style={{ fontSize: "0.65rem" }}>
                      <CheckCircle2 size={10} /> COMPLETED ({log.latencyMs}ms)
                    </span>
                  )}
                  {log.status === "ASK_APPROVAL" && (
                    <span className="badge badge-ask" style={{ fontSize: "0.65rem" }}>
                      <AlertTriangle size={10} /> ASK APPROVAL
                    </span>
                  )}
                  {log.status === "BLOCKED" && (
                    <span className="badge badge-deny" style={{ fontSize: "0.65rem" }}>
                      <ShieldAlert size={10} /> BLOCKED
                    </span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                💡 <em>{log.impactReason}</em>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspect Modal Drawer */}
      {selectedLog && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(5px)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "600px", padding: "1.5rem", borderRadius: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", margin: 0, color: "#00f2fe", fontFamily: "var(--font-mono)" }}>
                Tool Execution Audit: {selectedLog.toolName}
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem" }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              <strong>Execution Rationale:</strong>
              <p style={{ color: "var(--text-muted)", marginTop: "0.2rem" }}>{selectedLog.impactReason}</p>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <strong style={{ fontSize: "0.8rem", color: "#34d399" }}>INPUT PARAMETERS (JSON Schema):</strong>
              <pre style={{
                background: "#070913",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                color: "#00f2fe",
                fontFamily: "var(--font-mono)",
                maxHeight: "120px",
                overflow: "auto",
                marginTop: "0.3rem"
              }}>
                {JSON.stringify(selectedLog.input, null, 2)}
              </pre>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ fontSize: "0.8rem", color: "#ffb703" }}>OUTPUT / RESULT:</strong>
              <pre style={{
                background: "#070913",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                color: "#e2e8f0",
                fontFamily: "var(--font-mono)",
                maxHeight: "140px",
                overflow: "auto",
                marginTop: "0.3rem"
              }}>
                {JSON.stringify(selectedLog.output, null, 2)}
              </pre>
            </div>

            <button onClick={() => setSelectedLog(null)} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
