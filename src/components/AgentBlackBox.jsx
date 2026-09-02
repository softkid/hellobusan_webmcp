import { formatTimestamp } from "../lib/util.js";
import BusanMap from "./BusanMap.jsx";

const STATUS_CLASS = {
  SUCCESS: "ok",
  APPROVED: "ok",
  BLOCKED: "blocked",
  REJECTED: "blocked",
  ERROR: "blocked",
};

export default function AgentBlackBox({ blackbox, selectedId, onSelect }) {
  const selected = blackbox.find((b) => b.id === selectedId) || blackbox[0];
  const resultLocations = Array.isArray(selected?.rawData)
    ? selected.rawData.filter((d) => typeof d.lat === "number")
    : [];

  return (
    <section className="panel blackbox-panel">
      <div className="panel__header">
        <h2>AGENT BLACK BOX</h2>
        <span className="panel__subtitle">Every decision, inspectable</span>
      </div>

      <div className="blackbox-body">
        <div className="blackbox-list">
          {blackbox.length === 0 && <div className="activity-empty">No tool calls recorded yet.</div>}
          {blackbox.map((b) => (
            <button
              key={b.id}
              className={`blackbox-list__item ${b.id === selected?.id ? "blackbox-list__item--active" : ""}`}
              onClick={() => onSelect(b.id)}
            >
              <span className="blackbox-list__time">{formatTimestamp(b.ts)}</span>
              <span className="blackbox-list__tool">{b.tool}</span>
              <span className={`blackbox-list__status blackbox-list__status--${STATUS_CLASS[b.status] || "ok"}`}>
                {b.status}
              </span>
            </button>
          ))}
        </div>

        <div className="blackbox-detail">
          {selected ? (
            <>
              <div className="blackbox-detail__title">
                {formatTimestamp(selected.ts)} <strong>{selected.tool}</strong>
              </div>
              <div className="blackbox-detail__grid">
                <div>
                  <div className="blackbox-detail__label">INPUT</div>
                  <pre className="blackbox-detail__pre">{JSON.stringify(selected.input ?? {}, null, 2)}</pre>
                </div>
                <div>
                  <div className="blackbox-detail__label">OUTPUT</div>
                  <pre className="blackbox-detail__pre">{String(selected.output)}</pre>
                </div>
              </div>
              <div className="blackbox-detail__row">
                <div>
                  <div className="blackbox-detail__label">PERMISSION</div>
                  <div>{selected.permission?.toUpperCase()}</div>
                </div>
                <div>
                  <div className="blackbox-detail__label">STATUS</div>
                  <div>{selected.status}</div>
                </div>
                <div>
                  <div className="blackbox-detail__label">LATENCY</div>
                  <div>{selected.latencyMs} ms</div>
                </div>
              </div>
              <div>
                <div className="blackbox-detail__label">IMPACT</div>
                <div>{selected.impact}</div>
              </div>
              {resultLocations.length > 0 && (
                <div className="blackbox-detail__mini-map">
                  <BusanMap items={resultLocations} />
                </div>
              )}
            </>
          ) : (
            <div className="activity-empty">Select a tool call on the left.</div>
          )}
        </div>
      </div>
    </section>
  );
}
