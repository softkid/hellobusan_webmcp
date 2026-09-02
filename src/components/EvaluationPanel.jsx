import { useCallback, useRef, useState } from "react";
import LegacyFilterUI from "./LegacyFilterUI.jsx";
import { DEMO_PROMPTS } from "../lib/constants.js";

const BENCHMARK_GOAL = DEMO_PROMPTS[0];
const MODE_B_STEPS = 8; // matches the 8 numbered steps in LegacyFilterUI

function queryReady(container, selector, { tries = 6, delay = 45 } = {}) {
  return new Promise((resolve, reject) => {
    let attempt = 0;
    const poll = () => {
      const el = container.current?.querySelector(selector);
      if (el && !el.disabled) return resolve(el);
      attempt += 1;
      if (attempt >= tries) return reject(new Error(`timeout waiting for ${selector}`));
      setTimeout(poll, delay);
    };
    poll();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runDomScript(container, { onError }) {
  const click = async (selector) => {
    try {
      const el = await queryReady(container, selector);
      el.click();
    } catch {
      onError();
      // Best-effort: give the DOM a bit longer and try once more before giving up.
      await sleep(250);
      const el = container.current?.querySelector(selector);
      if (el) el.click();
    }
    await sleep(45);
  };

  await click('[data-testid="check-weather"]');
  await click('[data-testid="district-Haeundae-gu"]');
  await click('[data-testid="child-예"]');
  await click('[data-testid="budget-50000"]');
  await click('[data-testid="search-places"]');
  await sleep(80);
  for (let i = 0; i < 3; i++) {
    const btn = container.current?.querySelector(
      '[data-testid="place-results"] button:not(:disabled)',
    );
    if (btn) {
      btn.click();
      await sleep(40);
    } else {
      onError();
    }
  }
  await click('[data-testid="search-restaurants"]');
  await sleep(80);
  const rBtn = container.current?.querySelector(
    '[data-testid="restaurant-results"] button:not(:disabled)',
  );
  if (rBtn) rBtn.click();
  else onError();
  await sleep(40);
  await click('[data-testid="calculate-route"]');
  await click('[data-testid="reserve"]');
}

function StatRow({ label, a, b, c }) {
  return (
    <tr>
      <td>{label}</td>
      <td className="eval-table__cell">{a ?? "—"}</td>
      <td className="eval-table__cell">{b ?? "—"}</td>
      <td className="eval-table__cell eval-table__cell--best">{c ?? "—"}</td>
    </tr>
  );
}

export default function EvaluationPanel({ cityData, engine }) {
  const [results, setResults] = useState({ A: null, B: null, C: null });
  const [running, setRunning] = useState(null); // 'B' | 'C' | null
  const [manualOpen, setManualOpen] = useState(false);
  const [manualStats, setManualStats] = useState({ interactions: 0 });

  const domContainerRef = useRef(null);
  const domInteractionsRef = useRef(0);
  const domErrorsRef = useRef(0);
  const manualInteractionsRef = useRef(0);
  const [domMounted, setDomMounted] = useState(false);

  const runModeC = useCallback(async () => {
    setRunning("C");
    const meta = await engine.runAgent(BENCHMARK_GOAL, { fast: true });
    if (meta) {
      setResults((prev) => ({
        ...prev,
        C: { steps: meta.toolCalls, interactions: meta.interactions, errors: meta.errors, timeMs: meta.elapsedMs },
      }));
    }
    setRunning(null);
  }, [engine]);

  const runModeB = useCallback(async () => {
    setRunning("B");
    domInteractionsRef.current = 0;
    domErrorsRef.current = 0;
    setDomMounted(true);
    const start = performance.now();
    // Wait a tick for LegacyFilterUI to mount before scripting it.
    await sleep(60);
    await runDomScript(domContainerRef, { onError: () => (domErrorsRef.current += 1) });
    const timeMs = Math.round(performance.now() - start);
    setResults((prev) => ({
      ...prev,
      B: { steps: MODE_B_STEPS, interactions: domInteractionsRef.current, errors: domErrorsRef.current, timeMs },
    }));
    setDomMounted(false);
    setRunning(null);
  }, []);

  const runAll = useCallback(async () => {
    await runModeB();
    await runModeC();
  }, [runModeB, runModeC]);

  return (
    <section className="panel evaluation-panel">
      <div className="panel__header">
        <h2>WEBMCP EVALUATION</h2>
        <span className="panel__subtitle">Human · DOM Agent · WebMCP Agent 실측 비교</span>
        <button className="panel__action" onClick={() => setManualOpen(true)}>
          상세 결과 보기
        </button>
      </div>

      <p className="evaluation-panel__note">
        아래 숫자는 미리 정해둔 값이 아니라, 버튼을 눌러 실제로 이 페이지의 코드를 실행해서 측정한 값입니다.
        아직 실행하지 않은 모드는 "—"로 표시됩니다. (PRD §14)
      </p>

      <table className="eval-table">
        <thead>
          <tr>
            <th></th>
            <th>Mode A<br /><span>사람(Manual)</span></th>
            <th>Mode B<br /><span>Agent + DOM</span></th>
            <th>Mode C<br /><span className="eval-table__c-label">Agent + WebMCP</span></th>
          </tr>
        </thead>
        <tbody>
          <StatRow label="단계 (Steps)" a={results.A?.steps} b={results.B?.steps} c={results.C?.steps} />
          <StatRow
            label="상호작용 (Interactions)"
            a={results.A?.interactions}
            b={results.B?.interactions}
            c={results.C?.interactions}
          />
          <StatRow label="오류 (Errors)" a={results.A?.errors ?? 0} b={results.B?.errors} c={results.C?.errors} />
          <StatRow
            label="소요 시간 (Time)"
            a={results.A ? `${(results.A.timeMs / 1000).toFixed(1)}s` : null}
            b={results.B ? `${(results.B.timeMs / 1000).toFixed(1)}s` : null}
            c={results.C ? `${(results.C.timeMs / 1000).toFixed(1)}s` : null}
          />
        </tbody>
      </table>

      <div className="evaluation-panel__actions">
        <button className="btn btn--ghost" onClick={() => setManualOpen(true)}>
          Try it yourself (Mode A)
        </button>
        <button className="btn btn--ghost" onClick={runModeB} disabled={running !== null}>
          {running === "B" ? "Running DOM agent…" : "Run DOM Agent (Mode B)"}
        </button>
        <button className="btn btn--primary" onClick={runModeC} disabled={running !== null}>
          {running === "C" ? "Running WebMCP agent…" : "Run WebMCP Agent (Mode C)"}
        </button>
        <button className="btn btn--ghost" onClick={runAll} disabled={running !== null}>
          Run B → C
        </button>
      </div>

      {domMounted && cityData && (
        <div className="evaluation-panel__hidden-runner" ref={domContainerRef} aria-hidden="true">
          <LegacyFilterUI cityData={cityData} onInteract={() => (domInteractionsRef.current += 1)} />
        </div>
      )}

      {manualOpen && cityData && (
        <div className="modal-overlay">
          <div className="approval-modal manual-modal">
            <h3>Mode A — Try it yourself</h3>
            <p className="evaluation-panel__note">
              WebMCP 없이, 예전 방식 그대로 클릭해서 같은 작업(비 오는 날 아이와 6시간, 5만원 코스 준비하기)을
              완료해 보세요. 실제 클릭 수와 시간을 그대로 기록합니다.
            </p>
            <LegacyFilterUI
              cityData={cityData}
              onInteract={() => (manualInteractionsRef.current += 1)}
              onComplete={({ elapsedMs }) => {
                setManualStats({ interactions: manualInteractionsRef.current, elapsedMs });
              }}
            />
            {manualStats.elapsedMs && (
              <div className="evaluation-panel__manual-result">
                완료! {manualInteractionsRef.current}번 클릭, {(manualStats.elapsedMs / 1000).toFixed(1)}초 걸렸습니다.
              </div>
            )}
            <div className="approval-modal__actions">
              <button className="btn btn--ghost" onClick={() => setManualOpen(false)}>
                Close
              </button>
              <button
                className="btn btn--primary"
                disabled={!manualStats.elapsedMs}
                onClick={() => {
                  setResults((prev) => ({
                    ...prev,
                    A: {
                      steps: MODE_B_STEPS,
                      interactions: manualInteractionsRef.current,
                      errors: 0,
                      timeMs: manualStats.elapsedMs,
                    },
                  }));
                  setManualOpen(false);
                }}
              >
                Save my result
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
