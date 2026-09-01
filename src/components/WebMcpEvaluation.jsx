import React from "react";
import { Zap } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function WebMcpEvaluation({ lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="glass-panel" style={{ padding: "0.85rem", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Title Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div>
          <h3 style={{ fontSize: "0.85rem", margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Zap size={14} color="#a855f7" /> {t.evalTitle}
          </h3>
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.evalSub}</span>
        </div>
        <button className="btn-secondary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.65rem" }}>
          {t.viewDetails}
        </button>
      </div>

      {/* Comparison Table */}
      <div style={{ flex: 1, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem", textAlign: "center" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-dim)" }}>
              <th style={{ padding: "0.35rem 0.2rem", textAlign: "left" }}>{t.metrics}</th>
              <th style={{ padding: "0.35rem 0.2rem" }}>
                {t.modeA}
              </th>
              <th style={{ padding: "0.35rem 0.2rem" }}>
                {t.modeB}
              </th>
              <th style={{ padding: "0.35rem 0.2rem", background: "rgba(127, 86, 217, 0.15)", borderRadius: "4px 4px 0 0" }}>
                {t.modeC}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "0.4rem 0.2rem", textAlign: "left", color: "var(--text-muted)" }}>{t.steps}</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ffffff", fontWeight: 700 }}>31</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ffb703", fontWeight: 700 }}>17</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#00f2fe", fontWeight: 800, background: "rgba(127, 86, 217, 0.1)" }}>5</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "0.4rem 0.2rem", textAlign: "left", color: "var(--text-muted)" }}>{t.interactions}</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ffffff", fontWeight: 700 }}>41</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ffb703", fontWeight: 700 }}>23</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#00f2fe", fontWeight: 800, background: "rgba(127, 86, 217, 0.1)" }}>7</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "0.4rem 0.2rem", textAlign: "left", color: "var(--text-muted)" }}>{t.errors}</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ff5252", fontWeight: 700 }}>3</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ff5252", fontWeight: 700 }}>1</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#34d399", fontWeight: 800, background: "rgba(127, 86, 217, 0.1)" }}>0</td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.2rem", textAlign: "left", color: "var(--text-muted)" }}>{t.time}</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ffffff", fontFamily: "var(--font-mono)" }}>08:42</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#ffb703", fontFamily: "var(--font-mono)" }}>02:31</td>
              <td style={{ padding: "0.4rem 0.2rem", color: "#34d399", fontWeight: 800, fontFamily: "var(--font-mono)", background: "rgba(127, 86, 217, 0.1)", borderRadius: "0 0 4px 4px" }}>00:41</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Proof Banner */}
      <div style={{
        marginTop: "0.5rem",
        background: "linear-gradient(135deg, rgba(127, 86, 217, 0.2) 0%, rgba(0, 242, 254, 0.15) 100%)",
        border: "1px solid rgba(0, 242, 254, 0.3)",
        borderRadius: "6px",
        padding: "0.45rem",
        textAlign: "center",
        fontSize: "0.72rem",
        color: "#ffffff"
      }}>
        {t.proofBanner}
      </div>

    </div>
  );
}
