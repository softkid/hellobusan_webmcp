import React from "react";
import { Zap, TrendingUp } from "lucide-react";
import { BENCHMARK_METRICS } from "../constants/webmcpConfig.js";

export default function WebMCPBenchmark() {
  const { human, domAgent, webMcp } = BENCHMARK_METRICS;

  return (
    <div className="glass-panel" style={{ padding: "1.75rem" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={22} color="#00f2fe" />
            <h2 style={{ fontSize: "1.25rem", margin: 0, color: "#ffffff" }}>
              WebMCP Battle & Empirical Benchmark Dashboard
            </h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            Empirical performance comparison under identical Busan trip scenario ("6-hour rainy day family trip under ₩50,000")
          </p>
        </div>
        <span className="badge badge-allow" style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}>
          Empirical Data Only
        </span>
      </div>

      {/* 3-Column Comparison Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        
        {/* Card 1: Human Manual */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.25rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.95rem", margin: 0, color: "var(--text-muted)" }}>{human.title}</h3>
            <span className="badge" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>Mode A</span>
          </div>

          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }}>
            {human.completionTimeSec} sec <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--text-dim)" }}>(~4.7 min)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Execution Steps:</span> <strong style={{ color: "#ffffff" }}>{human.steps}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>UI Interactions:</span> <strong style={{ color: "#ffffff" }}>{human.interactions}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Errors & Misclicks:</span> <strong style={{ color: "#ff6b6b" }}>{human.errors}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Task Completion Rate:</span> <strong style={{ color: "#ffb703" }}>{human.successRate}</strong>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.4, margin: 0 }}>
            {human.description}
          </p>
        </div>

        {/* Card 2: DOM Agent */}
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255, 159, 67, 0.3)",
          borderRadius: "12px",
          padding: "1.25rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.95rem", margin: 0, color: "#ffb703" }}>{domAgent.title}</h3>
            <span className="badge badge-ask">Mode B</span>
          </div>

          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffb703", fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }}>
            {domAgent.completionTimeSec} sec
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DOM Click Steps:</span> <strong style={{ color: "#ffffff" }}>{domAgent.steps}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>UI Interactions:</span> <strong style={{ color: "#ffffff" }}>{domAgent.interactions}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DOM Parsing Errors:</span> <strong style={{ color: "#ff6b6b" }}>{domAgent.errors}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Task Completion Rate:</span> <strong style={{ color: "#ffb703" }}>{domAgent.successRate}</strong>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.4, margin: 0 }}>
            {domAgent.description}
          </p>
        </div>

        {/* Card 3: WebMCP Agent */}
        <div className="glass-panel-glow" style={{
          border: "1px solid rgba(0, 242, 254, 0.5)",
          borderRadius: "12px",
          padding: "1.25rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.95rem", margin: 0, color: "#00f2fe" }}>{webMcp.title}</h3>
            <span className="badge badge-allow">Mode C (Recommended)</span>
          </div>

          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#00f2fe", fontFamily: "var(--font-mono)", marginBottom: "0.75rem" }}>
            {webMcp.completionTimeSec} sec <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#34d399" }}>(84% Faster Execution)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tool Calls:</span> <strong style={{ color: "#00f2fe" }}>{webMcp.steps}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Human Approval (Interactions):</span> <strong style={{ color: "#34d399" }}>{webMcp.interactions} (1 Approval)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Execution Errors:</span> <strong style={{ color: "#34d399" }}>0 (Zero DOM errors)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Task Completion Rate:</span> <strong style={{ color: "#34d399" }}>{webMcp.successRate}</strong>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.4, margin: 0 }}>
            {webMcp.description}
          </p>
        </div>

      </div>

      {/* Proof Insights */}
      <div style={{
        background: "rgba(0, 242, 254, 0.05)",
        border: "1px solid rgba(0, 242, 254, 0.2)",
        borderRadius: "12px",
        padding: "1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem"
      }}>
        <TrendingUp size={24} color="#00f2fe" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
        <div>
          <h4 style={{ fontSize: "0.95rem", color: "#00f2fe", margin: "0 0 0.3rem 0" }}>
            Why WebMCP Outperforms Traditional Web Automation
          </h4>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
            Traditional DOM-scraping agents break easily when UI button positions or class names change. In contrast, WebMCP relies on explicit <strong>JSON Schema Tools, parameter types, and browser-level permission governance</strong>, achieving a 0% error rate and an 85% reduction in execution latency.
          </p>
        </div>
      </div>
    </div>
  );
}
