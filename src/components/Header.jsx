import { useState } from "react";
import { DEMO_PROMPTS } from "../lib/constants.js";

export default function Header({ onSubmitGoal, agentStatus, webmcpSupported }) {
  const [text, setText] = useState(DEMO_PROMPTS[0]);
  const [showExamples, setShowExamples] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!text.trim() || agentStatus === "working") return;
    onSubmitGoal(text.trim());
    setShowExamples(false);
  }

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand__mark" aria-hidden="true">A</div>
        <div>
          <div className="brand__name">AGENTIC BUSAN</div>
          <div className="brand__tagline">The city is your interface.</div>
        </div>
      </div>

      <form className="goal-bar" onSubmit={submit}>
        <span className="goal-bar__label">YOUR GOAL</span>
        <input
          className="goal-bar__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setShowExamples(true)}
          onBlur={() => setTimeout(() => setShowExamples(false), 150)}
          placeholder="오늘 부산에서 하고 싶은 일을 말해보세요..."
        />
        <button
          type="submit"
          className="goal-bar__submit"
          disabled={agentStatus === "working"}
          title="에이전트 실행"
        >
          {agentStatus === "working" ? "…" : "✦"}
        </button>

        {showExamples && (
          <div className="goal-bar__examples">
            {DEMO_PROMPTS.map((p) => (
              <button
                type="button"
                key={p}
                className="goal-bar__example"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setText(p);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="header-status">
        <div className={`safe-mode ${webmcpSupported ? "safe-mode--live" : ""}`}>
          <span className="safe-mode__dot" />
          <div>
            <div className="safe-mode__title">Safe Mode</div>
            <div className="safe-mode__sub">
              {webmcpSupported ? "Human in Control · WebMCP live" : "Human in Control"}
            </div>
          </div>
        </div>
        <div className="user-chip">
          <div className="user-chip__avatar">K</div>
          <div>
            <div className="user-chip__name">Kim Minjun</div>
            <div className="user-chip__plan">Premium Plan</div>
          </div>
        </div>
      </div>
    </header>
  );
}
