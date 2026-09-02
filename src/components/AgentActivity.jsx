import { formatTimestamp } from "../lib/util.js";

const STATUS_ICON = {
  success: "✓",
  blocked: "🔒",
  rejected: "✕",
  pending: "…",
  error: "!",
  start: "▶",
};

export default function AgentActivity({ activity }) {
  return (
    <section className="panel activity-panel">
      <div className="panel__header">
        <h2>AGENT ACTIVITY</h2>
        <span className="panel__subtitle">Live agent activity log</span>
        <span className="pill pill--live">● Live</span>
      </div>

      <div className="activity-list">
        {activity.length === 0 && <div className="activity-empty">No activity yet.</div>}
        {activity.map((a) => (
          <div className={`activity-item activity-item--${a.status}`} key={a.id}>
            <span className="activity-item__icon">{STATUS_ICON[a.status] || "•"}</span>
            <div className="activity-item__body">
              <div className="activity-item__title">
                {a.tool} <span className="activity-item__time">{formatTimestamp(a.ts)}</span>
              </div>
              <div className="activity-item__message">{a.message}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
