import BusanMap from "./BusanMap.jsx";
import { krw } from "../lib/util.js";

const KIND_EMOJI = { place: "📍", event: "🎪", restaurant: "🍽" };

export default function PlanPanel({ itinerary, agentStatus }) {
  const { items, totalCost, totalMinutes, reservation, removed } = itinerary;
  const hours = totalMinutes ? Math.round((totalMinutes / 60) * 10) / 10 : 0;

  return (
    <section className="panel plan-panel">
      <div className="panel__header">
        <h2>AI PLAN</h2>
        <span className="panel__subtitle">Busan itinerary, built by your agent {agentStatus === "working" && "(planning…)"}</span>
        <div className="plan-panel__meta">
          {items.length > 0 && (
            <>
              <span>Est. cost <strong>{krw(totalCost)}</strong></span>
              <span>Est. time <strong>{hours}h</strong></span>
            </>
          )}
        </div>
      </div>

      {agentStatus === "working" && (
        <div className="plan-panel__working">
          <span className="spinner" /> Agent is working…
        </div>
      )}

      {items.length === 0 && agentStatus !== "working" ? (
        <div className="plan-panel__empty">
          Type a goal in <strong>YOUR GOAL</strong> above and press ✦.
          <br />
          e.g. "It's raining today. Plan 6 hours in Busan with my kid for under ₩50,000."
        </div>
      ) : (
        <div className="plan-cards">
          {items.map((item, i) => (
            <div className="plan-card" key={item.id || i}>
              <div className="plan-card__time">{item.time}</div>
              <div className="plan-card__emoji">{KIND_EMOJI[item.kind] || "📍"}</div>
              <div className="plan-card__name">{item.name}</div>
              <div className="plan-card__tag">{(item.tags && item.tags[0]) || item.cuisine || item.category}</div>
              <div className="plan-card__price">{item.estCost ? krw(item.estCost) : "₩0"}</div>
            </div>
          ))}
        </div>
      )}

      {removed && removed.length > 0 && (
        <div className="plan-panel__note">
          Dropped {removed.length} stop{removed.length > 1 ? "s" : ""} to fit your time/budget: {removed.map((r) => r.name).join(", ")}
        </div>
      )}

      {reservation && (
        <div className={`plan-panel__reservation plan-panel__reservation--${reservation.status}`}>
          {reservation.status === "confirmed" ? "✓" : "⚠"} {reservation.name} reservation{" "}
          {reservation.status === "confirmed" ? "confirmed" : reservation.status}
        </div>
      )}

      <BusanMap items={items} />
    </section>
  );
}
