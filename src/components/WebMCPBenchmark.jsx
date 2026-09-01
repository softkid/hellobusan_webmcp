import React from "react";
import { Zap, ShieldCheck, AlertOctagon, CheckCircle2, TrendingUp, Layers } from "lucide-react";
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
              WebMCP Battle & Empirical Benchmark (실측 성능 평가 대시보드)
            </h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            동일한 부산 시나리오("우천 시 5만원 이하 아이동반 6시간 동선 구성")에 대해 3가지 방식으로 실측한 성능 지표
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
            {human.completionTimeSec}초 <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--text-dim)" }}>(~4.7분)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>총 수행 단계 (Steps):</span> <strong style={{ color: "#ffffff" }}>{human.steps}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>화면 상호작용 (Interactions):</span> <strong style={{ color: "#ffffff" }}>{human.interactions}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>실수 및 검색 실패 (Errors):</span> <strong style={{ color: "#ff6b6b" }}>{human.errors}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>과제 완료율 (Completion):</span> <strong style={{ color: "#ffb703" }}>{human.successRate}</strong>
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
            {domAgent.completionTimeSec}초
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DOM 클릭 단계 (Steps):</span> <strong style={{ color: "#ffffff" }}>{domAgent.steps}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>화면 상호작용 (Interactions):</span> <strong style={{ color: "#ffffff" }}>{domAgent.interactions}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>DOM 파싱 오류 (Errors):</span> <strong style={{ color: "#ff6b6b" }}>{domAgent.errors}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>과제 완료율 (Completion):</span> <strong style={{ color: "#ffb703" }}>{domAgent.successRate}</strong>
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
            {webMcp.completionTimeSec}초 <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#34d399" }}>(84% 소요시간 절감)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tool 호출 수 (Tool Calls):</span> <strong style={{ color: "#00f2fe" }}>{webMcp.steps}회</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>인간 승인 개입 (Interactions):</span> <strong style={{ color: "#34d399" }}>{webMcp.interactions}회 (1 Approval)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>실행 오류 (Errors):</span> <strong style={{ color: "#34d399" }}>0회 (Zero DOM errors)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>과제 완료율 (Completion):</span> <strong style={{ color: "#34d399" }}>{webMcp.successRate}</strong>
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
            DOM 추측 기반 Agent는 버튼 위치나 class명이 변경되면 즉시 오작동하지만, WebMCP는 웹사이트가 명시한 <strong>JSON Schema Tool, 입력 파라미터 타입, 읽기/쓰기 권한</strong>을 브라우저가 원자적으로 중재하므로 오류율 0%와 극단적인 상호작용 절감을 달성합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
