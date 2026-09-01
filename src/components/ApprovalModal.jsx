import React from "react";
import { AlertTriangle, ShieldCheck, Check, X, Building2, Users, Clock, DollarSign } from "lucide-react";

export default function ApprovalModal({ payload, onApprove, onReject }) {
  if (!payload) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(12px)",
      zIndex: 3000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div
        className="glass-panel-glow"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "1.75rem",
          borderRadius: "18px",
          border: "1px solid rgba(255, 159, 67, 0.5)",
          boxShadow: "0 0 35px rgba(255, 159, 67, 0.2)",
          animation: "pulse-glow 2s infinite ease-in-out"
        }}
      >
        {/* Header Alert */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(255, 159, 67, 0.15)",
            border: "1px solid rgba(255, 159, 67, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <AlertTriangle size={26} color="#ff9f43" />
          </div>
          <div>
            <span className="badge badge-ask" style={{ marginBottom: "0.2rem" }}>
              Human Approval Required (인간 승인 요청)
            </span>
            <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#ffffff" }}>
              Agent Sensitive Action Confirmation
            </h3>
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          Agent가 권한 지갑 정책(<strong style={{ color: "#ff9f43" }}>POLICY = ASK</strong>)에 따라 아래 민감한 예약 행동을 수행하기 전 인간 최종 결정을 요청합니다.
        </p>

        {/* Detailed Reservation Card */}
        <div style={{
          background: "rgba(10, 15, 30, 0.9)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Building2 size={18} color="#00f2fe" />
            <strong style={{ fontSize: "1.05rem", color: "#00f2fe" }}>
              {payload.targetName}
            </strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={14} color="#ffb703" /> 시간: <strong style={{ color: "#ffffff" }}>{payload.time}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Users size={14} color="#ffb703" /> 인원: <strong style={{ color: "#ffffff" }}>{payload.partySize}명</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", gridColumn: "span 2" }}>
              <DollarSign size={14} color="#34d399" /> 예상 금액: <strong style={{ color: "#34d399", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>₩{payload.estimatedCost?.toLocaleString()}</strong>
            </div>
          </div>

          {payload.details && (
            <div style={{ marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
              📝 {payload.details}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={onReject}
            className="btn-secondary"
            style={{
              flex: 1,
              justifyContent: "center",
              borderColor: "rgba(255, 82, 82, 0.4)",
              color: "#ff6b6b"
            }}
          >
            <X size={18} /> Reject Action (거절)
          </button>
          <button
            onClick={onApprove}
            className="btn-primary"
            style={{
              flex: 1.3,
              justifyContent: "center",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff"
            }}
          >
            <Check size={18} /> Approve & Execute (승인)
          </button>
        </div>
      </div>
    </div>
  );
}
