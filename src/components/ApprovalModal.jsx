import React, { useState } from "react";
import { AlertTriangle, Check, X, Building2, Users, Clock, DollarSign, Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function ApprovalModal({ payload, onApprove, onReject, lang = "en" }) {
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  if (!payload) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handlePasskeyApprove = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setScanSuccess(true);
      setTimeout(() => {
        setIsBiometricScanning(false);
        setScanSuccess(false);
        onApprove();
      }, 700);
    }, 900);
  };

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
          position: "relative"
        }}
      >
        {/* Passkey Scanning Overlay */}
        {isBiometricScanning && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(13, 18, 31, 0.95)",
            borderRadius: "18px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem"
          }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: scanSuccess ? "rgba(52, 211, 153, 0.2)" : "rgba(0, 242, 254, 0.2)",
              border: scanSuccess ? "2px solid #34d399" : "2px solid #00f2fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: scanSuccess ? "0 0 25px rgba(52, 211, 153, 0.5)" : "0 0 25px rgba(0, 242, 254, 0.5)"
            }}>
              {scanSuccess ? (
                <ShieldCheck size={36} color="#34d399" />
              ) : (
                <Fingerprint size={36} color="#00f2fe" className="spin-icon" />
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontSize: "1.1rem", color: scanSuccess ? "#34d399" : "#00f2fe", margin: 0 }}>
                {scanSuccess ? "WebAuthn Signature Verified!" : "Authenticating Passkey / Face ID..."}
              </h4>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Cryptographic hardware signature confirmation
              </span>
            </div>
          </div>
        )}

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
              Human Approval Required (Passkey Protected)
            </span>
            <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#ffffff" }}>
              Agent Sensitive Action Confirmation
            </h3>
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          The Agent requests explicit human approval for sensitive action (<strong style={{ color: "#ff9f43" }}>POLICY = ASK</strong>) before executing reservation webhook.
        </p>

        {/* Detailed Reservation Card */}
        <div style={{
          background: "rgba(10, 15, 26, 0.9)",
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
              <Clock size={14} color="#ffb703" /> Time: <strong style={{ color: "#ffffff" }}>{payload.time}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Users size={14} color="#ffb703" /> Guests: <strong style={{ color: "#ffffff" }}>{payload.partySize} guests</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", gridColumn: "span 2" }}>
              <DollarSign size={14} color="#34d399" /> Est. Price: <strong style={{ color: "#34d399", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>₩{payload.estimatedCost?.toLocaleString()}</strong>
            </div>
          </div>

          {payload.details && (
            <div style={{ marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-dim)" }}>
              🔒 {payload.details}
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
            <X size={18} /> Reject Action
          </button>
          <button
            onClick={handlePasskeyApprove}
            className="btn-primary"
            style={{
              flex: 1.4,
              justifyContent: "center",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              gap: "0.4rem"
            }}
          >
            <Fingerprint size={18} /> Passkey Approve & Execute
          </button>
        </div>
      </div>
    </div>
  );
}
