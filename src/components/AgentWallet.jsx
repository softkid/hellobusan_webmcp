import { PERMISSION_ROWS, POLICY_LABEL } from "../lib/constants.js";

const CYCLE = { allow: "ask", ask: "deny", deny: "allow" };

export default function AgentWallet({ wallet, onSetRowPolicy, onSetDailyLimit, onReset }) {
  return (
    <section className="panel wallet-panel">
      <div className="panel__header">
        <h2>AGENT WALLET</h2>
        <span className="panel__subtitle">AI 권한 지갑</span>
        <button className="panel__action" onClick={onReset} title="기본값으로 초기화">
          Reset
        </button>
      </div>

      <div className="wallet-banner">
        <div className="wallet-banner__icon">🛡</div>
        <div>
          <div className="wallet-banner__title">You stay in control.</div>
          <div className="wallet-banner__sub">AI가 사용할 수 있는 권한을 직접 설정하세요.</div>
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
              title={row.locked ? "이 권한은 이 MVP에서 항상 차단됩니다" : "클릭하여 정책 변경 (허용 → 승인 필요 → 차단)"}
            >
              <span className="wallet-row__label">
                {row.locked && "🔒 "}
                {row.label}
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
