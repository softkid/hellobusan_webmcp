import { PERMISSION_ROWS, POLICY_LABEL } from "../lib/constants.js";

const CYCLE = { allow: "ask", ask: "deny", deny: "allow" };

export default function AgentWallet({ wallet, onSetRowPolicy, onSetDailyLimit, onReset }) {
  return (
    <section className="panel wallet-panel">
      <div className="panel__header">
        <h2>AGENT WALLET</h2>
        <span className="panel__subtitle">Your AI permission wallet</span>
        <button className="panel__action" onClick={onReset} title="Reset to defaults">
          Reset
        </button>
      </div>

      <div className="wallet-banner">
        <div className="wallet-banner__icon">🛡</div>
        <div>
          <div className="wallet-banner__title">You stay in control.</div>
          <div className="wallet-banner__sub">Decide exactly what the AI is allowed to do.</div>
        </div>
      </div>

      <div className="wallet-section-label">AI PERMISSIONS <span>권한 설정</span></div>

      <div className="wallet-rows">
        {PERMISSION_ROWS.map((row) => {
          const currentPolicy = row.locked ? "deny" : wallet.toolPolicy[row.tools[0]] || "allow";
          return (
            <button
              key={row.key}
              type="button"
              className={`wallet-row wallet-row--${currentPolicy} ${row.locked ? "wallet-row--locked" : ""}`}
              disabled={row.locked}
              onClick={() => onSetRowPolicy(row.key, CYCLE[currentPolicy])}
              title={row.locked ? "This permission is always blocked in this MVP" : "Click to cycle: Allow → Ask first → Blocked"}
            >
              <span className="wallet-row__label">
                {row.locked && "🔒 "}
                {row.label} <span className="wallet-row__sub">{row.sub}</span>
              </span>
              <span className={`policy-pill policy-pill--${currentPolicy}`}>{POLICY_LABEL[currentPolicy]}</span>
            </button>
          );
        })}
      </div>

      <div className="wallet-limit">
        <div className="wallet-limit__row">
          <span>DAILY LIMIT <span className="wallet-limit__sub">일일 사용 한도</span></span>
          <span className="wallet-limit__value">₩{wallet.dailyLimit.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={10000}
          max={200000}
          step={5000}
          value={wallet.dailyLimit}
          onChange={(e) => onSetDailyLimit(Number(e.target.value))}
          className="wallet-limit__slider"
        />
      </div>
    </section>
  );
}
