import React from "react";
import AIPlanMap from "./AIPlanMap.jsx";
import { krw } from "../lib/util.js";

const KIND_EMOJI = { place: "📍", event: "🎪", restaurant: "🍽" };

export default function PlanPanel({ itinerary, agentStatus }) {
  const { items = [], totalCost = 0, totalMinutes = 0, reservation, removed } = itinerary || {};
  const hours = totalMinutes ? Math.round((totalMinutes / 60) * 10) / 10 : 0;

  // Convert engine items format to AIPlanMap format
  const mappedItinerary = items.map((item, i) => ({
    step: i + 1,
    id: item.id || `item-${i}`,
    time: item.time || `Stop ${i + 1}`,
    title: item.name || item.title || `Stop ${i + 1}`,
    subtitle: (item.tags && item.tags[0]) || item.cuisine || item.category || "Busan Venue",
    category: item.kind || item.category || "Attraction",
    cost: item.estCost || item.cost || 0,
    lat: item.lat,
    lng: item.lng,
    location: item.address || item.district || "Busan"
  }));

  return (
    <section className="panel plan-panel" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      
      {/* Upper AI PLAN Cards & Info */}
      <div>
        <div className="panel__header" style={{ marginBottom: "0.5rem" }}>
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
          <div className="plan-panel__working" style={{ marginBottom: "0.5rem" }}>
            <span className="spinner" /> Agent is working…
          </div>
        )}

        {items.length === 0 && agentStatus !== "working" ? (
          <div className="plan-panel__empty" style={{ marginBottom: "0.5rem" }}>
            Type a goal in <strong>YOUR GOAL</strong> above and press ✦.
            <br />
            e.g. "It's raining today. Plan 6 hours in Busan with my kid for under ₩50,000."
          </div>
        ) : (
          <div className="plan-cards" style={{ marginBottom: "0.5rem" }}>
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
          <div className="plan-panel__note" style={{ marginBottom: "0.5rem" }}>
            Dropped {removed.length} stop{removed.length > 1 ? "s" : ""} to fit your time/budget: {removed.map((r) => r.name).join(", ")}
          </div>
        )}

        {reservation && (
          <div className={`plan-panel__reservation plan-panel__reservation--${reservation.status}`} style={{ marginBottom: "0.5rem" }}>
            {reservation.status === "confirmed" ? "✓" : "⚠"} {reservation.name} reservation{" "}
            {reservation.status === "confirmed" ? "confirmed" : reservation.status}
          </div>
        )}
      </div>

      {/* WanderNote Style Leaflet OpenStreetMap Interactive Map */}
      <div style={{ flex: 1, minHeight: "340px" }}>
        <AIPlanMap itinerary={mappedItinerary} totalCost={totalCost} lang="en" />
      </div>

    </section>
  );
}
