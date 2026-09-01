import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Save, Layers } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function AIPlanMap({ itinerary, totalCost, dailyBudgetLimit, lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [mapType, setMapType] = useState("dark"); // dark | satellite

  // Default 6-item English Itinerary Cards
  const defaultItinerary = [
    {
      step: 1,
      time: "10:00",
      title: t.place1Title,
      subtitle: t.place1Sub,
      cost: 0,
      image: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=400",
      lat: 35.0975,
      lng: 129.0106
    },
    {
      step: 2,
      time: "12:00",
      title: t.place2Title,
      subtitle: t.place2Sub,
      cost: 18000,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
      lat: 35.1704,
      lng: 129.1302
    },
    {
      step: 3,
      time: "14:00",
      title: t.place3Title,
      subtitle: t.place3Sub,
      cost: 4000,
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=400",
      lat: 35.2045,
      lng: 129.2132
    },
    {
      step: 4,
      time: "16:30",
      title: t.place4Title,
      subtitle: t.place4Sub,
      cost: 7000,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      lat: 35.1627,
      lng: 129.1764
    },
    {
      step: 5,
      time: "18:30",
      title: t.place5Title,
      subtitle: t.place5Sub,
      cost: 0,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
      lat: 35.1532,
      lng: 129.1189
    },
    {
      step: 6,
      time: "19:30",
      title: t.place6Title,
      subtitle: t.place6Sub,
      cost: 15000,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
      lat: 35.1588,
      lng: 129.1601
    }
  ];

  const activeItems = itinerary && itinerary.length > 0 ? itinerary.map((item, idx) => ({
    step: idx + 1,
    time: item.time ? item.time.split(" - ")[0] : `1${idx + 0}:00`,
    title: item.title,
    subtitle: item.category || "Recommended Venue",
    cost: item.cost || 0,
    image: defaultItinerary[idx % defaultItinerary.length].image,
    lat: item.lat || defaultItinerary[idx % defaultItinerary.length].lat,
    lng: item.lng || defaultItinerary[idx % defaultItinerary.length].lng
  })) : defaultItinerary;

  const currentTotalCost = totalCost || activeItems.reduce((acc, curr) => acc + curr.cost, 0);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [35.150, 129.110],
        zoom: 12,
        zoomControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; CARTO & Busan WebMCP',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const createNumberedIcon = (number) => {
      return L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background: linear-gradient(135deg, #7f56d9 0%, #00f2fe 100%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 15px rgba(0, 242, 254, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 14px;
            font-family: var(--font-heading);
          ">
            ${number}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    activeItems.forEach((item) => {
      if (item.lat && item.lng) {
        const marker = L.marker([item.lat, item.lng], {
          icon: createNumberedIcon(item.step)
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-size: 13px;">
            <strong style="color: #00f2fe;">${item.step}. ${item.title}</strong><br/>
            <span style="color: #94a3b8;">${item.subtitle} · ${item.time}</span><br/>
            <span style="color: #34d399; font-weight: 700;">₩${item.cost.toLocaleString()}</span>
          </div>
        `);
        markersRef.current.push(marker);
      }
    });

    const routeCoords = activeItems
      .filter((item) => item.lat && item.lng)
      .map((item) => [item.lat, item.lng]);

    if (routeCoords.length > 1) {
      const polyline = L.polyline(routeCoords, {
        color: "#00f2fe",
        weight: 4,
        dashArray: "8, 12",
        opacity: 0.9
      }).addTo(map);

      polylineRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [activeItems]);

  return (
    <div className="glass-panel" style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      
      {/* AI Plan Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <h2 style={{ fontSize: "1.05rem", margin: 0, color: "#ffffff", letterSpacing: "0.01em" }}>
              {t.aiPlanTitle}
            </h2>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.aiPlanSub}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ fontSize: "0.78rem" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estCost} </span>
            <strong style={{ color: "#34d399", fontFamily: "var(--font-mono)" }}>₩{currentTotalCost.toLocaleString()}</strong>
          </div>
          <div style={{ fontSize: "0.78rem" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estTime} </span>
            <strong style={{ color: "#ffffff", fontFamily: "var(--font-mono)" }}>6h</strong>
          </div>
          <button className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem", background: "linear-gradient(135deg, #7f56d9 0%, #9e77ed 100%)", color: "#ffffff" }}>
            <Save size={13} /> {t.savePlan}
          </button>
        </div>
      </div>

      {/* Horizontal Itinerary Cards Carousel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}>
        {activeItems.map((item) => (
          <div
            key={item.step}
            style={{
              background: "rgba(10, 15, 26, 0.8)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              position: "relative"
            }}
          >
            <div style={{
              position: "absolute",
              top: "0.3rem",
              left: "0.3rem",
              background: "rgba(0,0,0,0.7)",
              color: "#00f2fe",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              padding: "0.05rem 0.35rem",
              borderRadius: "4px",
              fontWeight: 700,
              zIndex: 2
            }}>
              {item.time}
            </div>

            <div style={{
              width: "100%",
              height: "52px",
              borderRadius: "6px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.05)",
              position: "relative"
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>

            <div>
              <strong style={{ fontSize: "0.75rem", color: "#ffffff", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.title}
              </strong>
              <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", display: "block" }}>
                {item.subtitle}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                ₩{item.cost.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Satellite/Dark Map Section */}
      <div style={{ position: "relative", flex: 1, minHeight: "320px", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          zIndex: 1000,
          background: "rgba(10, 15, 26, 0.85)",
          padding: "0.2rem",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          display: "flex",
          gap: "0.2rem"
        }}>
          <button
            onClick={() => setMapType("dark")}
            style={{
              padding: "0.25rem 0.6rem",
              borderRadius: "4px",
              border: "none",
              background: mapType === "dark" ? "rgba(0, 242, 254, 0.2)" : "transparent",
              color: mapType === "dark" ? "#00f2fe" : "var(--text-muted)",
              fontSize: "0.7rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {t.map}
          </button>
          <button
            onClick={() => setMapType("satellite")}
            style={{
              padding: "0.25rem 0.6rem",
              borderRadius: "4px",
              border: "none",
              background: mapType === "satellite" ? "rgba(0, 242, 254, 0.2)" : "transparent",
              color: mapType === "satellite" ? "#00f2fe" : "var(--text-muted)",
              fontSize: "0.7rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {t.satellite}
          </button>
        </div>

        <div ref={mapContainerRef} style={{ width: "100%", height: "100%", minHeight: "320px" }} />
      </div>

    </div>
  );
}
