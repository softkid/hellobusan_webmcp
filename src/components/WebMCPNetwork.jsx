import { TOOL_DEFINITIONS } from "../lib/constants.js";

const GROUPS = [
  { key: "discovery", label: "Discovery", sub: "검색·조회", icon: "🔎", tools: ["get_weather", "search_places", "search_events", "search_restaurants", "get_place_details"] },
  { key: "planning", label: "Planning", sub: "계산·수정", icon: "🧭", tools: ["estimate_cost", "calculate_route", "get_itinerary", "update_itinerary"] },
  { key: "reservation", label: "Reservation", sub: "승인 필요", icon: "📅", tools: ["request_reservation"] },
  { key: "restricted", label: "Restricted", sub: "항상 차단", icon: "🔒", tools: ["process_payment", "update_profile"] },
];

const TYPE_LABEL = { READ: "READ", WRITE: "WRITE", SENSITIVE: "ASK", FINANCIAL: "DENY", PERSONAL: "DENY" };

export default function WebMCPNetwork({ toolRegistry, webmcpSupported }) {
  const registeredCount = Object.values(toolRegistry).filter((s) => s?.registered).length;

  return (
    <section className="panel network-panel">
      <div className="panel__header">
        <h2>WEBMCP NETWORK</h2>
        <span className="panel__subtitle">연결된 부산 웹 서비스</span>
        <span className="pill pill--accent">{registeredCount}/{TOOL_DEFINITIONS.length} Tools</span>
      </div>

      <div className="network-groups">
        {GROUPS.map((g) => (
          <div className="network-group" key={g.key}>
            <div className="network-group__icon">{g.icon}</div>
            <div className="network-group__label">{g.label}</div>
            <div className="network-group__sub">{g.sub}</div>
            <div className="network-group__count">{g.tools.length} Tools</div>
          </div>
        ))}
      </div>

      <div className="wallet-section-label">ACTIVE TOOLS <span>등록된 WebMCP Tool</span></div>
      <div className="active-tools">
        {TOOL_DEFINITIONS.map((t) => {
          const state = toolRegistry[t.name];
          const live = state?.registered;
          return (
            <div className="active-tools__row" key={t.name}>
              <span className={`active-tools__dot ${live ? "active-tools__dot--on" : ""}`} />
              <span className="active-tools__name">{t.name}</span>
              <span className={`type-pill type-pill--${TYPE_LABEL[t.type]}`}>{TYPE_LABEL[t.type]}</span>
            </div>
          );
        })}
      </div>

      <div className={`network-status ${webmcpSupported ? "network-status--live" : ""}`}>
        {webmcpSupported
          ? "✓ document.modelContext detected — external WebMCP agents can call these tools directly."
          : "이 브라우저는 WebMCP(document.modelContext)를 아직 감지하지 못했습니다. 내장 에이전트는 정상 작동하며, WebMCP 지원 브라우저에서는 동일한 Tool을 외부 에이전트가 직접 호출할 수 있습니다."}
      </div>
    </section>
  );
}
