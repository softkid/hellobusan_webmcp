import { krw } from "../lib/util.js";

export default function ApprovalModal({ pendingApproval, onResolve }) {
  if (!pendingApproval) return null;
  const { id, payload } = pendingApproval;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="approval-modal">
        <div className="approval-modal__badge">⚠ ACTION REQUIRES APPROVAL</div>
        <h3>Reservation Request</h3>
        <div className="approval-modal__row">
          <span className="approval-modal__name">{payload.name}</span>
        </div>
        <div className="approval-modal__meta">
          {payload.time && <span>{payload.time}</span>}
          {payload.partySize && <span>{payload.partySize} people</span>}
          {typeof payload.cost === "number" && <span>{krw(payload.cost)}</span>}
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
