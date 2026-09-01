import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { TRANSLATIONS } from "../constants/translations.js";

export default function AgentAssistant({ lang = "en" }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [messages, setMessages] = useState([
    { sender: "user", text: lang === "en" ? "Please focus on indoor places due to rain today." : "오늘 비가 오는데 실내 위주로 부탁해." },
    { sender: "agent", text: lang === "en" ? "Rebuilding itinerary for indoor priority. Science Museum -> Indoor Experience -> Aquarium updated." : "실내 위주로 일정을 재구성하고 있어요. 과학관 ➔ 실내 체험 ➔ 아쿠아리움으로 변경했어요." },
    { sender: "user", text: lang === "en" ? "Change dinner option to seafood." : "저녁은 해산물로 바꿔줘." },
    { sender: "agent", text: lang === "en" ? "Re-searching seafood restaurants and updating itinerary." : "해산물 맛집 3곳을 검색해 일정을 업데이트할게요." }
  ]);

  const [inputMsg, setInputMsg] = useState("");

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMsg("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: lang === "en"
            ? `Executing WebMCP tools (search_places / update_itinerary) for prompt: "${userText}".`
            : `요청하신 "${userText}" 조건으로 WebMCP Tool을 재실행합니다.`
        }
      ]);
    }, 600);
  };

  return (
    <div className="glass-panel" style={{ padding: "0.85rem", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div>
          <h3 style={{ fontSize: "0.85rem", margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <MessageSquare size={14} color="#00f2fe" /> {t.assistantTitle}
          </h3>
          <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>{t.assistantSub}</span>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.45rem", paddingRight: "0.2rem", marginBottom: "0.5rem" }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "0.45rem 0.65rem",
                borderRadius: "8px",
                fontSize: "0.72rem",
                background: m.sender === "user" ? "rgba(127, 86, 217, 0.25)" : "rgba(10, 15, 26, 0.8)",
                border: m.sender === "user" ? "1px solid rgba(127, 86, 217, 0.4)" : "1px solid var(--border)",
                color: m.sender === "user" ? "#ffffff" : "var(--text-main)"
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div style={{ display: "flex", gap: "0.35rem" }}>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={t.typeMsg}
          style={{
            flex: 1,
            background: "rgba(10, 15, 26, 0.9)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "0.35rem 0.6rem",
            color: "#ffffff",
            fontSize: "0.75rem",
            outline: "none"
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "var(--primary-gradient)",
            border: "none",
            borderRadius: "6px",
            padding: "0.35rem 0.6rem",
            color: "#070a13",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Send size={13} />
        </button>
      </div>

    </div>
  );
}
