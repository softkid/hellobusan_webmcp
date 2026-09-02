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
        <span className="panel__subtitle">AI가 만든 부산 일정 {agentStatus === "working" && "(생성 중...)"}</span>
        <div className="plan-panel__meta">
          {items.length > 0 && (
            <>
              <span>예상 비용 <strong>{krw(totalCost)}</strong></span>
              <span>예상 시간 <strong>{hours}시간</strong></span>
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
          상단의 <strong>YOUR GOAL</strong>에 목표를 입력하고 ✦ 버튼을 눌러보세요.
          <br />
          예: "오늘 비가 오는데 5만원 안에서 아이와 6시간 동안 부산에서 할 일을 만들어줘."
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
          시간/예산 제약에 맞추기 위해 {removed.length}개 항목을 제외했습니다: {removed.map((r) => r.name).join(", ")}
        </div>
      )}

      {reservation && (
        <div className={`plan-panel__reservation plan-panel__reservation--${reservation.status}`}>
          {reservation.status === "confirmed" ? "✓" : "⚠"} {reservation.name} 예약{" "}
          {reservation.status === "confirmed" ? "확정됨" : reservation.status}
        </div>
      )}

      <BusanMap items={items} />
    </section>
  );
}
