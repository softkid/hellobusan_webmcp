import { useState } from "react";
import { krw } from "../lib/util.js";

const SUGGESTIONS = ["Switch to indoor plans", "How much did this cost?", "Why did you pick this?", "Try again"];

function reply(text, { itinerary, onSubmitGoal, lastGoalText }) {
  const t = text.toLowerCase();

  if (itinerary.items.length === 0) {
    onSubmitGoal(text);
    return "On it — I'll line up Busan services for that goal. Watch Agent Activity above for progress.";
  }

  if (t.includes("indoor") || t.includes("rain") || t.includes("실내") || t.includes("비")) {
    onSubmitGoal(`${lastGoalText} (indoor-focused, assume rain)`);
    return "Re-planning with an indoor focus. Re-running Weather → Places now.";
  }

  if (t.includes("cost") || t.includes("budget") || t.includes("얼마") || t.includes("비용")) {
    return `The current plan costs about ${krw(itinerary.totalCost)}, for a party of ${itinerary.partySize}.`;
  }

  if (t.includes("why") || t.includes("왜")) {
    return "Check the Agent Black Box for each tool call's INPUT/OUTPUT/PERMISSION/IMPACT — I narrowed candidates by budget, weather, and whether a kid is coming along.";
  }

  if (t.includes("again") || t.includes("regenerate") || t.includes("recommend") || t.includes("다시") || t.includes("추천")) {
    onSubmitGoal(lastGoalText || text);
    return "Re-planning with the same goal.";
  }

  return `Right now you have ${itinerary.items.length} stops totaling ${krw(itinerary.totalCost)}. The reservation still needs your approval.`;
}

export default function AgentAssistant({ itinerary, onSubmitGoal, lastGoalText }) {
  const [messages, setMessages] = useState([
    { id: "m0", from: "agent", text: "Hi! What would you like to do in Busan today?" },
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
        <span className="panel__subtitle">Chat with your agent</span>
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
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button type="submit">➤</button>
      </form>
    </section>
  );
}
