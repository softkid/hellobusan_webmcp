import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { BUSAN_PLACES, BUSAN_RESTAURANTS, BUSAN_WEATHER } from "../data/mockBusanData.js";
import { MapPin, CloudRain } from "lucide-react";

export default function BusanMap({ itinerary, selectedItem }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Initialize map centered at Haeundae / Centum City area
      const map = L.map(mapContainerRef.current, {
        center: [35.164, 129.145],
        zoom: 13,
        zoomControl: true
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & Busan WebMCP',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Custom Icon Creators
    const createCustomIcon = (color, symbol) => {
      return L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px ${color};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #070913;
            font-weight: bold;
            font-size: 12px;
          ">
            ${symbol}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
    };

    // Render Busan Places Pins
    BUSAN_PLACES.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon("#00f2fe", "📍")
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-size: 13px;">
          <strong style="color: #00f2fe;">${place.name}</strong><br/>
          <span style="color: #94a3b8;">${place.category} · ${place.district}</span><br/>
          <span style="font-weight: 600; color: #10b981;">₩${place.priceMin.toLocaleString()}~</span>
          ${place.isIndoor ? '<span style="color: #ffb703; margin-left: 4px;">☔ 실내</span>' : ''}
        </div>
      `);
      markersRef.current.push(marker);
    });

    // Render Busan Restaurants Pins
    BUSAN_RESTAURANTS.forEach((rest) => {
      const marker = L.marker([rest.lat, rest.lng], {
        icon: createCustomIcon("#ff9f43", "🍜")
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-size: 13px;">
          <strong style="color: #ff9f43;">${rest.name}</strong><br/>
          <span style="color: #94a3b8;">${rest.cuisine}</span><br/>
          <span style="color: #10b981; font-weight: 600;">평균 ₩${rest.priceAvg.toLocaleString()}</span>
        </div>
      `);
      markersRef.current.push(marker);
    });

    // Draw active itinerary route line if itinerary exists
    if (itinerary && itinerary.length > 0) {
      const routeCoords = itinerary
        .filter((item) => item.lat && item.lng)
        .map((item) => [item.lat, item.lng]);

      if (routeCoords.length > 1) {
        const polyline = L.polyline(routeCoords, {
          color: "#00f2fe",
          weight: 4,
          dashArray: "6, 10",
          opacity: 0.95
        }).addTo(map);

        polylineRef.current = polyline;
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      }
    }
  }, [itinerary]);

  return (
    <div className="glass-panel" style={{ padding: "1rem", height: "100%", position: "relative" }}>
      {/* Header Overlay */}
      <div style={{
        position: "absolute",
        top: "1.5rem",
        left: "1.5rem",
        zIndex: 1000,
        background: "rgba(13, 19, 34, 0.85)",
        backdropFilter: "blur(10px)",
        padding: "0.5rem 1rem",
        borderRadius: "10px",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
      }}>
        <MapPin size={18} color="#00f2fe" />
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
          Agentic Busan Interactive Map
        </span>
        <span className="badge badge-allow" style={{ fontSize: "0.65rem" }}>
          Real-time Tool Sync
        </span>
      </div>

      {/* Weather Overlay */}
      <div style={{
        position: "absolute",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "0.5rem 0.9rem",
        borderRadius: "10px",
        border: "1px solid rgba(255, 159, 67, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.78rem"
      }}>
        <CloudRain size={16} color="#ff9f43" />
        <div>
          <strong style={{ color: "#ff9f43" }}>Busan Weather: {BUSAN_WEATHER.condition}</strong>
          <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Indoor Venues Auto-Prioritized</div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "420px", borderRadius: "10px" }} />
    </div>
  );
}
