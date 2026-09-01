import React from "react";
import { Shield, Lock, AlertTriangle, CheckCircle, Search, Scale, MapPin, Calendar, Ticket, Bell, CreditCard, UserCheck } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function AgentWallet({ permissions, setPermissions, budgetLimit, setBudgetLimit, lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const permissionItems = [
    { key: "search_places", label: t.search, icon: Search, defaultPolicy: "ALLOW" },
    { key: "compare", label: t.compare, icon: Scale, defaultPolicy: "ALLOW" },
    { key: "calculate_route", label: t.route, icon: MapPin, defaultPolicy: "ALLOW" },
    { key: "update_itinerary", label: t.schedule, icon: Calendar, defaultPolicy: "ALLOW" },
    { key: "check_availability", label: t.check, icon: Ticket, defaultPolicy: "ALLOW" },
    { key: "request_reservation", label: t.reservation, icon: Bell, defaultPolicy: "ASK" },
    { key: "payment", label: t.payment, icon: CreditCard, defaultPolicy: "DENY" },
    { key: "profile", label: t.profile, icon: UserCheck, defaultPolicy: "DENY" }
  ];

  const togglePolicy = (key) => {
    setPermissions((prev) => {
      const current = prev[key]?.policy || "ALLOW";
      let next = "ALLOW";
      if (current === "ALLOW") next = "ASK";
      else if (current === "ASK") next = "DENY";
      else next = "ALLOW";

      return {
        ...prev,
        [key]: {
          ...prev[key],
          policy: next
        }
      };
    });
  };

  return (
    <div className="glass-panel" style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Title Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "0.95rem", margin: 0, letterSpacing: "0.02em", color: "#ffffff" }}>
            {t.walletTitle}
          </h2>
          <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{t.walletSub}</span>
        </div>
        <button className="btn-secondary" style={{ padding: "0.25rem 0.55rem", fontSize: "0.7rem" }}>
          {t.edit}
        </button>
      </div>

      {/* Top Banner Box */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(127, 86, 217, 0.15) 100%)",
        border: "1px solid rgba(0, 242, 254, 0.25)",
        borderRadius: "10px",
        padding: "0.85rem",
        marginBottom: "0.85rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <strong style={{ fontSize: "0.9rem", color: "#00f2fe", display: "block" }}>
            {t.youStayInControl}
          </strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {t.youStaySub}
          </span>
        </div>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "rgba(0, 242, 254, 0.2)",
          border: "1px solid rgba(0, 242, 254, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Shield size={20} color="#00f2fe" />
        </div>
      </div>

      {/* Permissions List */}
      <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginBottom: "0.4rem", fontWeight: 700 }}>
        {t.aiPermissions} <span style={{ float: "right" }}>{t.permSetting}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1, overflowY: "auto", paddingRight: "0.2rem" }}>
        {permissionItems.map((item) => {
          const IconComp = item.icon;
          const currentPolicy = permissions[item.key]?.policy || item.defaultPolicy;

          return (
            <div
              key={item.key}
              onClick={() => item.key !== "payment" && item.key !== "profile" && togglePolicy(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.65rem",
                borderRadius: "8px",
                background: "rgba(10, 15, 26, 0.7)",
                border: "1px solid var(--border)",
                cursor: item.key === "payment" || item.key === "profile" ? "not-allowed" : "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <IconComp size={14} color={currentPolicy === "ALLOW" ? "#00f2fe" : currentPolicy === "ASK" ? "#ffb703" : "#ff5252"} />
                <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
                  {item.label}
                </span>
              </div>

              {currentPolicy === "ALLOW" && (
                <span className="badge-status badge-allow">
                  <CheckCircle size={10} /> {t.allow}
                </span>
              )}
              {currentPolicy === "ASK" && (
                <span className="badge-status badge-ask">
                  <AlertTriangle size={10} /> {t.ask}
                </span>
              )}
              {currentPolicy === "DENY" && (
                <span className="badge-status badge-deny">
                  <Lock size={10} /> {t.deny}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Daily Limit Bar */}
      <div style={{
        marginTop: "0.85rem",
        paddingTop: "0.75rem",
        borderTop: "1px solid var(--border)",
        fontSize: "0.75rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{t.dailyLimit}</span>
          <strong style={{ color: "#34d399", fontFamily: "var(--font-mono)" }}>
            ₩{budgetLimit.toLocaleString()} <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>/ ₩50,000</span>
          </strong>
        </div>
        <div style={{ width: "100%", height: "5px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #00f2fe, #34d399)", borderRadius: "3px" }}></div>
        </div>
      </div>

    </div>
  );
}
