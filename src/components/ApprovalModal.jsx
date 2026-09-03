import React from "react";
import { krw } from "../lib/util.js";

export default function ApprovalModal({ pendingApproval, onResolve }) {
  if (!pendingApproval) return null;
  const { id, payload = {} } = pendingApproval;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(3, 7, 18, 0.82)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
    >
      <div
        className="approval-modal"
        style={{
          zIndex: 100000,
          position: "relative",
          background: "var(--panel-2)",
          border: "1px solid rgba(255, 183, 3, 0.4)",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.75)"
        }}
      >
        <div className="approval-modal__badge">⚠ ACTION REQUIRES APPROVAL</div>
        <h3 style={{ marginTop: "0.5rem" }}>Reservation Request</h3>
        <div className="approval-modal__row">
          <span className="approval-modal__name">{payload.name || payload.targetName || "Busan Venue Reservation"}</span>
        </div>
        <div className="approval-modal__meta">
          {payload.time && <span>{payload.time}</span>}
          {payload.partySize && <span>{payload.partySize} people</span>}
          {(typeof payload.cost === "number" || typeof payload.estCost === "number") && (
            <span>{krw(payload.cost || payload.estCost)}</span>
          )}
        </div>
        <p className="approval-modal__note">
          This reservation is confirmed only once a human approves it here. No payment is processed in this MVP.
        </p>
        <div className="approval-modal__actions">
          <button className="btn btn--ghost" onClick={() => onResolve(id, false)}>
            Reject
          </button>
          <button className="btn btn--primary" onClick={() => onResolve(id, true)}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
