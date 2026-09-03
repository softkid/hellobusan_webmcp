import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Save, MapPin, Map as MapIcon, Layers } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

const PIN_COLORS = ["#22c55e", "#f59e0b", "#38bdf8", "#a78bfa", "#f472b6", "#fb7185"];

export default function AIPlanMap({ itinerary, totalCost, dailyBudgetLimit, lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  const [mapStyle, setMapStyle] = useState("osm"); // "osm" | "voyager" | "dark"
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activePlace, setActivePlace] = useState(null);

  // Default 6-item English Itinerary Cards
  const defaultItinerary = [
    {
      step: 1,
      time: "10:00 AM",
      title: t.place1Title || "SEA LIFE Busan Aquarium",
      subtitle: t.place1Sub || "Indoor Marine Life Tunnel",
      category: "Attractions",
      cost: 21000,
      image: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=400",
      lat: 35.1593,
      lng: 129.1623,
      address: "Haeundae Beach Road 266, Busan"
    },
    {
      step: 2,
      time: "12:00 PM",
      title: t.place2Title || "Subyeon Pork Soup Centum",
      subtitle: t.place2Sub || "Local Korean Dining & Kid Menu",
      category: "Dining",
      cost: 10000,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
      lat: 35.1704,
      lng: 129.1302,
      address: "Centum 1-ro 14, Centum City, Busan"
    },
    {
      step: 3,
      time: "02:00 PM",
      title: t.place3Title || "National Busan Science Museum",
      subtitle: t.place3Sub || "Interactive Physics & Robot Lab",
      category: "Culture",
      cost: 4000,
      image: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=400",
      lat: 35.2045,
      lng: 129.2132,
      address: "Dongbusan-ro 110, Gijang, Busan"
    },
    {
      step: 4,
      time: "04:30 PM",
      title: t.place4Title || "Museum 1 Media Art Gallery",
      subtitle: t.place4Sub || "LED Light Show & Digital Art",
      category: "Exhibition",
      cost: 13000,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      lat: 35.1627,
      lng: 129.1764,
      address: "Centum seo-ro 20, Haeundae, Busan"
    },
    {
      step: 5,
      time: "06:30 PM",
      title: t.place5Title || "Busan Cinema Center Walk",
      subtitle: t.place5Sub || "Guinness Roof LED & Architecture",
      category: "Walk",
      cost: 0,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
      lat: 35.1711,
      lng: 129.1272,
      address: "Centum 5-ro 120, Centum City, Busan"
    },
    {
      step: 6,
      time: "07:30 PM",
      title: t.place6Title || "Ocean View Buffet & Aqua Dining",
      subtitle: t.place6Sub || "Aquarium View Family Buffet",
      category: "Dining",
      cost: 24000,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
      lat: 35.1588,
      lng: 129.1601,
      address: "Haeundae-haebyeon-ro 298, Busan"
    }
  ];

  const activeItems = itinerary && itinerary.length > 0 ? itinerary.map((item, idx) => ({
    step: idx + 1,
    time: item.time ? item.time.split(" - ")[0] : defaultItinerary[idx % defaultItinerary.length].time,
    title: item.title || item.name || `Stop ${idx + 1}`,
    subtitle: item.category || item.subtitle || "Recommended Venue",
    category: item.category || "General",
    cost: item.cost || item.estCost || 0,
    image: defaultItinerary[idx % defaultItinerary.length].image,
    lat: item.lat || defaultItinerary[idx % defaultItinerary.length].lat,
    lng: item.lng || defaultItinerary[idx % defaultItinerary.length].lng,
    address: item.location || item.address || "Busan"
  })) : defaultItinerary;

  const currentTotalCost = totalCost || activeItems.reduce((acc, curr) => acc + curr.cost, 0);

  // Default active place for floating card
  useEffect(() => {
    if (activeItems.length > 0 && !activePlace) {
      setActivePlace(activeItems[0]);
    }
  }, [activeItems, activePlace]);

  // Tile URL Map
  const tileUrls = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    },
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [35.160, 129.150],
        zoom: 12,
        zoomControl: true
      });

      const selectedTile = tileUrls[mapStyle] || tileUrls.osm;
      const layer = L.tileLayer(selectedTile.url, {
        attribution: selectedTile.attribution,
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = layer;
      leafletMapRef.current = map;
    } else {
      const map = leafletMapRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const selectedTile = tileUrls[mapStyle] || tileUrls.osm;
      const newLayer = L.tileLayer(selectedTile.url, {
        attribution: selectedTile.attribution,
        maxZoom: 19
      }).addTo(map);
      tileLayerRef.current = newLayer;
    }

    const map = leafletMapRef.current;
    
    // Multiple invalidateSize calls to fix tile calculation
    const timer1 = setTimeout(() => { map.invalidateSize(); }, 50);
    const timer2 = setTimeout(() => { map.invalidateSize(); }, 300);
    const timer3 = setTimeout(() => { map.invalidateSize(); }, 800);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleResize);

    // Clear old markers & polyline
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Filter items
    const filteredItems = selectedFilter === "all" ? activeItems : activeItems.filter((i) => i.step.toString() === selectedFilter || i.category.toLowerCase().includes(selectedFilter.toLowerCase()));

    // Create WanderNote style colored circle pins
    const createNumberedIcon = (number, color) => {
      return L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 14px;
            font-family: var(--font-heading);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${number}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    filteredItems.forEach((item) => {
      if (item.lat && item.lng) {
        const pinColor = PIN_COLORS[(item.step - 1) % PIN_COLORS.length];
        const marker = L.marker([item.lat, item.lng], {
          icon: createNumberedIcon(item.step, pinColor)
        }).addTo(map);

        marker.on("click", () => {
          setActivePlace(item);
        });

        markersRef.current.push(marker);
      }
    });

    const routeCoords = filteredItems
      .filter((item) => item.lat && item.lng)
      .map((item) => [item.lat, item.lng]);

    if (routeCoords.length > 1) {
      const polyline = L.polyline(routeCoords, {
        color: mapStyle === "dark" ? "#00f2fe" : "#3b82f6",
        weight: 4,
        dashArray: "6, 10",
        opacity: 0.85
      }).addTo(map);

      polylineRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeItems, mapStyle, selectedFilter]);

  return (
    <div className="glass-panel" style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", gap: "0.75rem", overflow: "hidden" }}>
      
      {/* Title Header (WanderNote Aesthetics) */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.08em", color: "#00f2fe", textTransform: "uppercase", display: "block" }}>
            A LITTLE SENSE OF DIRECTION
          </span>
          <h2 style={{ fontSize: "1.3rem", margin: "0.1rem 0 0 0", color: "#ffffff", letterSpacing: "-0.01em", fontFamily: "var(--font-heading)" }}>
            Your trip, <em style={{ fontStyle: "italic", color: "#00f2fe" }}>on the map.</em>
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.15rem 0 0 0" }}>
            Every stop, calculated and verified by your WebMCP Agent.
          </p>
        </div>

        {/* Right Stats & Save */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ fontSize: "0.8rem", textAlign: "right" }}>
            <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.68rem" }}>Estimated Cost</span>
            <strong style={{ color: "#34d399", fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>₩{currentTotalCost.toLocaleString()}</strong>
          </div>
          <button className="btn-primary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.78rem", background: "linear-gradient(135deg, #7f56d9 0%, #9e77ed 100%)", color: "#ffffff", borderRadius: "10px" }}>
            <Save size={14} /> Save Trip
          </button>
        </div>
      </div>

      {/* Filter Pills Bar (Matching WanderNote Day 1 / Day 2 / Day 3 pills) */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", overflowX: "auto", paddingBottom: "0.2rem" }}>
        <button
          onClick={() => setSelectedFilter("all")}
          style={{
            padding: "0.3rem 0.75rem",
            borderRadius: "20px",
            border: selectedFilter === "all" ? "1px solid #22c55e" : "1px solid var(--border)",
            background: selectedFilter === "all" ? "rgba(34, 197, 94, 0.15)" : "rgba(10, 15, 26, 0.6)",
            color: selectedFilter === "all" ? "#22c55e" : "var(--text-muted)",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            whiteSpace: "nowrap"
          }}
        >
          <MapIcon size={13} /> All Stops ({activeItems.length})
        </button>

        {activeItems.map((item, idx) => {
          const isSelected = selectedFilter === item.step.toString();
          const color = PIN_COLORS[idx % PIN_COLORS.length];
          return (
            <button
              key={item.step}
              onClick={() => {
                setSelectedFilter(item.step.toString());
                setActivePlace(item);
              }}
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "20px",
                border: isSelected ? `1px solid ${color}` : "1px solid var(--border)",
                background: isSelected ? `${color}25` : "rgba(10, 15, 26, 0.6)",
                color: isSelected ? color : "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap"
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
              Stop {item.step} ({item.time})
            </button>
          );
        })}
      </div>

      {/* Main OpenStreetMap Map Container with Rounded Corners & Floating Card */}
      <div style={{ position: "relative", flex: 1, width: "100%", borderRadius: "16px", overflow: "hidden", minHeight: "320px", border: "1px solid rgba(255,255,255,0.12)" }}>
        
        {/* Top-Right Tile Style Switcher */}
        <div style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          zIndex: 1000,
          background: "rgba(10, 15, 26, 0.85)",
          backdropFilter: "blur(8px)",
          padding: "0.2rem 0.3rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem"
        }}>
          <Layers size={13} color="#00f2fe" style={{ marginLeft: "0.2rem" }} />
          <button
            onClick={() => setMapStyle("osm")}
            style={{
              padding: "0.25rem 0.55rem",
              borderRadius: "5px",
              border: "none",
              background: mapStyle === "osm" ? "rgba(0, 242, 254, 0.2)" : "transparent",
              color: mapStyle === "osm" ? "#00f2fe" : "var(--text-muted)",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => setMapStyle("voyager")}
            style={{
              padding: "0.25rem 0.55rem",
              borderRadius: "5px",
              border: "none",
              background: mapStyle === "voyager" ? "rgba(0, 242, 254, 0.2)" : "transparent",
              color: mapStyle === "voyager" ? "#00f2fe" : "var(--text-muted)",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Voyager
          </button>
          <button
            onClick={() => setMapStyle("dark")}
            style={{
              padding: "0.25rem 0.55rem",
              borderRadius: "5px",
              border: "none",
              background: mapStyle === "dark" ? "rgba(0, 242, 254, 0.2)" : "transparent",
              color: mapStyle === "dark" ? "#00f2fe" : "var(--text-muted)",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Dark Mode
          </button>
        </div>

        {/* Absolute Positioned OpenStreetMap Container */}
        <div
          ref={mapContainerRef}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%", height: "100%"
          }}
        />

        {/* Floating Glass Overlay Card at Bottom-Left (Exact WanderNote Style!) */}
        {activePlace && (
          <div style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            zIndex: 1000,
            width: "calc(100% - 2rem)",
            maxWidth: "420px",
            background: mapStyle === "dark" ? "rgba(10, 15, 26, 0.9)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            border: mapStyle === "dark" ? "1px solid rgba(0, 242, 254, 0.3)" : "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "14px",
            padding: "0.85rem 1rem",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            transition: "all 0.3s ease"
          }}>
            {/* Color Number Badge */}
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: PIN_COLORS[(activePlace.step - 1) % PIN_COLORS.length],
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              flexShrink: 0
            }}>
              {activePlace.step}
            </div>

            {/* Text Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: mapStyle === "dark" ? "#00f2fe" : "#2563eb",
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}>
                STOP {activePlace.step} · {activePlace.time}
              </div>
              <h4 style={{
                fontSize: "0.95rem",
                margin: "0.15rem 0",
                color: mapStyle === "dark" ? "#ffffff" : "#0f172a",
                fontWeight: 800,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {activePlace.title}
              </h4>
              <div style={{
                fontSize: "0.75rem",
                color: mapStyle === "dark" ? "var(--text-muted)" : "#64748b",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                <MapPin size={12} color="#00f2fe" />
                <span>{activePlace.address}</span>
              </div>
            </div>

            {/* Price Badge */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#34d399",
                fontFamily: "var(--font-mono)"
              }}>
                ₩{activePlace.cost.toLocaleString()}
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
