import { useEffect } from "react";
import { useWebMCP } from "use-webmcp-tool";

/**
 * Registers a single WebMCP tool via document.modelContext.registerTool()
 * (through the use-webmcp-tool hook) and reports {supported, registered}
 * back up so the WebMCP Network panel can show real, live status per tool
 * — not a decorative list.
 *
 * `execute` is the same engine.callTool(name, input) used by the built-in
 * agent, so a human typing a goal and an external WebMCP agent calling this
 * tool directly go through identical permission checks and logging.
 */
export default function WebMCPToolBinding({ name, description, inputSchema, annotations, execute, onState }) {
  const state = useWebMCP({
    name,
    description,
    inputSchema,
    annotations,
    execute: (args) => execute(name, args),
  });

  useEffect(() => {
    onState(name, state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.supported, state.registered, state.error]);

  return null;
}
