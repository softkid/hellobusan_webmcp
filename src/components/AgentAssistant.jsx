import { useState } from "react";
import { krw } from "../lib/util.js";

const SUGGESTIONS = ["실내 위주로 바꿔줘", "얼마가 들었어?", "왜 이렇게 짰어?", "다시 추천해줘"];

function reply(text, { itinerary, onSubmitGoal, lastGoalText }) {
  const t = text.toLowerCase();

  if (itinerary.items.length === 0) {
    onSubmitGoal(text);
    return "네, 그 목표로 부산 서비스를 조합해볼게요. 상단 Agent Activity에서 진행 상황을 확인하세요.";
  }

  if (t.includes("실내") || t.includes("비") || t.includes("indoor") || t.includes("rain")) {
    onSubmitGoal(`${lastGoalText} (실내 위주로, 비가 온다고 가정)`);
    return "실내 위주 일정으로 다시 계산하고 있어요. Weather → Places 순서로 다시 검색합니다.";
  }

  if (t.includes("얼마") || t.includes("cost") || t.includes("budget") || t.includes("비용")) {
    return `현재 일정의 예상 비용은 ${krw(itinerary.totalCost)}이고, ${itinerary.partySize}인 기준입니다.`;
  }

  if (t.includes("왜") || t.includes("why")) {
    return "Agent Black Box에서 각 Tool Call의 INPUT/OUTPUT/PERMISSION/IMPACT를 확인할 수 있어요. 예산과 날씨, 아이 동반 여부를 기준으로 후보를 좁혔습니다.";
  }

  if (t.includes("다시") || t.includes("추천") || t.includes("regenerate") || t.includes("again")) {
    onSubmitGoal(lastGoalText || text);
    return "같은 목표로 다시 계획을 세워볼게요.";
  }

  return `현재 ${itinerary.items.length}개 항목, ${krw(itinerary.totalCost)} 일정이 준비되어 있어요. 예약은 승인이 필요합니다.`;
}

export default function AgentAssistant({ itinerary, onSubmitGoal, lastGoalText }) {
  const [messages, setMessages] = useState([
    { id: "m0", from: "agent", text: "안녕하세요! 오늘 부산에서 무엇을 하고 싶으신가요?" },
  ]);
  const [text, setText] = useState("");

  function send(value) {
    const v = (value ?? text).trim();
    if (!v) return;
    const userMsg = { id: `u_${Date.now()}`, from: "user", text: v };
    const agentText = reply(v, { itinerary, onSubmitGoal, lastGoalText });
    const agentMsg = { id: `a_${Date.now()}`, from: "agent", text: agentText };
    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setText("");
  }

  return (
    <section className="panel assistant-panel">
      <div className="panel__header">
        <h2>AGENT ASSISTANT</h2>
        <span className="panel__subtitle">AI 어시스턴트</span>
      </div>

      <div className="assistant-messages">
        {messages.map((m) => (
          <div key={m.id} className={`assistant-message assistant-message--${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="assistant-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="chip" onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>

      <form
        className="assistant-input"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="메시지를 입력하세요..." />
        <button type="submit">➤</button>
      </form>
    </section>
  );
}
