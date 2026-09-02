import { MAP_VIEWBOX, project, buildRoutePath, DISTRICT_LABELS } from "../lib/geo.js";

const PIN_COLORS = ["#22c55e", "#f59e0b", "#38bdf8", "#a78bfa", "#f472b6", "#fb7185"];

export default function BusanMap({ items }) {
  const routeD = buildRoutePath(items);

  return (
    <div className="busan-map">
      <svg viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} className="busan-map__svg" role="img" aria-label="Busan itinerary map">
        <rect x="0" y="0" width={MAP_VIEWBOX.width} height={MAP_VIEWBOX.height} fill="var(--map-bg)" />
        {/* stylized coastline / water */}
        <path
          d={`M ${MAP_VIEWBOX.width * 0.62} 0
              C ${MAP_VIEWBOX.width * 0.7} ${MAP_VIEWBOX.height * 0.25},
                ${MAP_VIEWBOX.width * 0.55} ${MAP_VIEWBOX.height * 0.4},
                ${MAP_VIEWBOX.width * 0.72} ${MAP_VIEWBOX.height * 0.55}
              C ${MAP_VIEWBOX.width * 0.85} ${MAP_VIEWBOX.height * 0.68},
                ${MAP_VIEWBOX.width * 0.78} ${MAP_VIEWBOX.height * 0.85},
                ${MAP_VIEWBOX.width * 0.95} ${MAP_VIEWBOX.height}
              L ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height} L ${MAP_VIEWBOX.width} 0 Z`}
          fill="var(--map-water)"
        />

        {DISTRICT_LABELS.map((d) => {
          const p = project(d.lat, d.lng);
          return (
            <text key={d.name} x={p.x} y={p.y} textAnchor="middle" className="busan-map__district">
              {d.name}
            </text>
          );
        })}

        {routeD && (
          <path d={routeD} className="busan-map__route" fill="none" strokeDasharray="6 6" />
        )}

        {items.map((item, i) => {
          const p = project(item.lat, item.lng);
          const color = PIN_COLORS[i % PIN_COLORS.length];
          return (
            <g key={item.id || i} transform={`translate(${p.x}, ${p.y})`}>
              <circle r="11" fill={color} stroke="#0b0d14" strokeWidth="2" />
              <text textAnchor="middle" dy="4" className="busan-map__pin-label">
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {items.length === 0 && (
        <div className="busan-map__empty">Type a goal above and your agent will draw the plan on this map.</div>
      )}
    </div>
  );
}
