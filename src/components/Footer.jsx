import React from "react";
import { UserCheck, Bot, Building2 } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function Footer({ lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <footer style={{
      marginTop: "1rem",
      padding: "0.75rem 1rem",
      borderTop: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      fontSize: "0.85rem",
      color: "var(--text-muted)",
      fontFamily: "var(--font-heading)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <UserCheck size={16} color="#00f2fe" />
        <strong style={{ color: "#ffffff" }}>{t.youDecide}</strong>
      </div>

      <span style={{ color: "var(--text-dim)" }}>+</span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Bot size={16} color="#9e77ed" />
        <strong style={{ color: "#ffffff" }}>{t.yourAgentActs}</strong>
      </div>

      <span style={{ color: "var(--text-dim)" }}>+</span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Building2 size={16} color="#34d399" />
        <strong style={{ color: "#ffffff" }}>{t.busanResponds}</strong>
      </div>
    </footer>
  );
}
