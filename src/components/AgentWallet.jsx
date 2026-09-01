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
    <div className="glass-panel" style={{ padding: "0.85rem", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      
      {/* Title Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <div>
          <h2 style={{ fontSize: "0.9rem", margin: 0, letterSpacing: "0.02em", color: "#ffffff" }}>
            {t.walletTitle}
          </h2>
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.walletSub}</span>
        </div>
        <button className="btn-secondary" style={{ padding: "0.2rem 0.45rem", fontSize: "0.65rem" }}>
          {t.edit}
        </button>
      </div>

      {/* Top Banner Box */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(127, 86, 217, 0.15) 100%)",
        border: "1px solid rgba(0, 242, 254, 0.25)",
        borderRadius: "8px",
        padding: "0.65rem 0.75rem",
        marginBottom: "0.6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <strong style={{ fontSize: "0.82rem", color: "#00f2fe", display: "block" }}>
            {t.youStayInControl}
          </strong>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
            {t.youStaySub}
          </span>
        </div>
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "6px",
          background: "rgba(0, 242, 254, 0.2)",
          border: "1px solid rgba(0, 242, 254, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Shield size={16} color="#00f2fe" />
        </div>
      </div>

      {/* Permissions List */}
      <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", marginBottom: "0.3rem", fontWeight: 700 }}>
        {t.aiPermissions} <span style={{ float: "right" }}>{t.permSetting}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1, overflowY: "auto", paddingRight: "0.2rem" }}>
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
                padding: "0.4rem 0.55rem",
                borderRadius: "6px",
                background: "rgba(10, 15, 26, 0.7)",
                border: "1px solid var(--border)",
                cursor: item.key === "payment" || item.key === "profile" ? "not-allowed" : "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", overflow: "hidden" }}>
                <IconComp size={13} color={currentPolicy === "ALLOW" ? "#00f2fe" : currentPolicy === "ASK" ? "#ffb703" : "#ff5252"} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "0.72rem", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.label}
                </span>
              </div>

              {currentPolicy === "ALLOW" && (
                <span className="badge-status badge-allow" style={{ fontSize: "0.58rem", flexShrink: 0 }}>
                  <CheckCircle size={9} /> {t.allow}
                </span>
              )}
              {currentPolicy === "ASK" && (
                <span className="badge-status badge-ask" style={{ fontSize: "0.58rem", flexShrink: 0 }}>
                  <AlertTriangle size={9} /> {t.ask}
                </span>
              )}
              {currentPolicy === "DENY" && (
                <span className="badge-status badge-deny" style={{ fontSize: "0.58rem", flexShrink: 0 }}>
                  <Lock size={9} /> {t.deny}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Daily Limit Bar */}
      <div style={{
        marginTop: "0.5rem",
        paddingTop: "0.5rem",
        borderTop: "1px solid var(--border)",
        fontSize: "0.7rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>{t.dailyLimit}</span>
          <strong style={{ color: "#34d399", fontFamily: "var(--font-mono)" }}>
            ₩{budgetLimit.toLocaleString()} <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>/ ₩50,000</span>
          </strong>
        </div>
        <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #00f2fe, #34d399)", borderRadius: "2px" }}></div>
        </div>
      </div>

    </div>
  );
}
