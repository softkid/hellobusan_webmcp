/**
 * Cloudflare Worker / Pages Function API: POST /api/tool-calls
 * Persists Agent WebMCP tool executions to Cloudflare D1 database.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { id, sessionId, toolName, input, output, policy, status, latencyMs, impactReason } = body;

    if (env && env.DB) {
      const query = `
        INSERT INTO tool_calls (id, session_id, tool_name, input_json, output_json, permission, status, latency_ms, impact_reason, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await env.DB.prepare(query)
        .bind(
          id || "tc-" + Date.now(),
          sessionId || "session-default",
          toolName,
          JSON.stringify(input || {}),
          JSON.stringify(output || {}),
          policy || "ALLOW",
          status || "COMPLETED",
          latencyMs || 0,
          impactReason || "",
          Date.now()
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, persisted: true }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
