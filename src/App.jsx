import { useState } from "react";
import { useAgentEngine } from "./hooks/useAgentEngine.js";
import { TOOL_SCHEMAS } from "./lib/toolSchemas.js";
import WebMCPToolBinding from "./components/WebMCPToolBinding.jsx";
import Header from "./components/Header.jsx";
import AgentWallet from "./components/AgentWallet.jsx";
import PlanPanel from "./components/PlanPanel.jsx";
import WebMCPNetwork from "./components/WebMCPNetwork.jsx";
import AgentActivity from "./components/AgentActivity.jsx";
import AgentBlackBox from "./components/AgentBlackBox.jsx";
import EvaluationPanel from "./components/EvaluationPanel.jsx";
import AgentAssistant from "./components/AgentAssistant.jsx";
import ApprovalModal from "./components/ApprovalModal.jsx";

export default function App() {
  const engine = useAgentEngine();
  const [lastGoalText, setLastGoalText] = useState("");

  function handleSubmitGoal(text) {
    setLastGoalText(text);
    engine.runAgent(text);
  }

  return (
    <div className="app-shell">
      {engine.toolDefinitions.map((t) => (
        <WebMCPToolBinding
          key={t.name}
          name={t.name}
          description={TOOL_SCHEMAS[t.name].description}
          inputSchema={TOOL_SCHEMAS[t.name].inputSchema}
          annotations={TOOL_SCHEMAS[t.name].annotations}
          execute={engine.callTool}
          onState={engine.markToolRegistration}
        />
      ))}

      <Header
        onSubmitGoal={handleSubmitGoal}
        agentStatus={engine.agentStatus}
        webmcpSupported={engine.webmcpSupported}
      />

      <main className="layout-main">
        <AgentWallet
          wallet={engine.wallet}
          onSetRowPolicy={engine.setPermissionRow}
          onSetDailyLimit={engine.setDailyLimit}
          onReset={engine.resetWallet}
        />
        <PlanPanel itinerary={engine.itinerary} agentStatus={engine.agentStatus} />
        <WebMCPNetwork toolRegistry={engine.toolRegistry} webmcpSupported={engine.webmcpSupported} />
      </main>

      <section className="layout-secondary">
        <AgentActivity activity={engine.activity} />
        <AgentBlackBox
          blackbox={engine.blackbox}
          selectedId={engine.selectedBlackboxId}
          onSelect={engine.setSelectedBlackboxId}
        />
        <EvaluationPanel cityData={engine.cityData} engine={engine} />
        <AgentAssistant itinerary={engine.itinerary} onSubmitGoal={handleSubmitGoal} lastGoalText={lastGoalText} />
      </section>

      <footer className="app-footer">
        <span>You decide.</span>
        <span className="app-footer__plus">+</span>
        <span>Your agent acts.</span>
        <span className="app-footer__plus">+</span>
        <span>Busan responds.</span>
      </footer>

      <ApprovalModal pendingApproval={engine.pendingApproval} onResolve={engine.resolveApproval} />
    </div>
  );
}
