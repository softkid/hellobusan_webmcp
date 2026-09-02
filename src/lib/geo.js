/**
 * Lightweight geo helpers for the stylized Busan map (SVG, not a real map
 * tile provider — no external maps API key is required to run the demo).
 */

// Rough bounding box around central Busan used to project lat/lng onto the
// map's SVG viewBox.
const BOUNDS = {
  latMin: 35.03,
  latMax: 35.2,
  lngMin: 128.99,
  lngMax: 129.23,
};

export const MAP_VIEWBOX = { width: 800, height: 460 };

export function project(lat, lng) {
  const x =
    ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * MAP_VIEWBOX.width;
  // Latitude increases upward; SVG y increases downward.
  const y =
    (1 - (lat - BOUNDS.latMin) / (BOUNDS.latMax - BOUNDS.latMin)) *
    MAP_VIEWBOX.height;
  return { x, y };
}

// Haversine distance in km.
export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Very rough transit-time estimate for an in-city agent demo: ~22 km/h
// average incl. walking + transit, minimum 8 minutes between stops.
export function estimateTravelMinutes(a, b) {
  const km = distanceKm(a, b);
  return Math.max(8, Math.round((km / 22) * 60));
}

export function buildRoutePath(stops) {
  if (!stops.length) return "";
  return stops
    .map((s, i) => {
      const { x, y } = project(s.lat, s.lng);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export const DISTRICT_LABELS = [
  { name: "Saha", lat: 35.104, lng: 128.995 },
  { name: "Seo-gu", lat: 35.098, lng: 129.017 },
  { name: "Jung-gu", lat: 35.1, lng: 129.033 },
  { name: "Yeongdo", lat: 35.07, lng: 129.07 },
  { name: "Busanjin", lat: 35.163, lng: 129.06 },
  { name: "Dong-gu", lat: 35.13, lng: 129.045 },
  { name: "Nam-gu", lat: 35.13, lng: 129.1 },
  { name: "Suyeong", lat: 35.165, lng: 129.115 },
  { name: "Haeundae", lat: 35.19, lng: 129.165 },
];
