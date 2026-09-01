/**
 * Cloudflare Worker / Pages Function API: POST /api/approvals
 * Records Human Approval decisions (APPROVED / REJECTED) in D1.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { id, userId, toolName, payload, status } = body;

    if (env && env.DB) {
      const query = `
        INSERT INTO approvals (id, user_id, tool_name, payload_json, status, created_at, resolved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await env.DB.prepare(query)
        .bind(
          id || "appr-" + Date.now(),
          userId || "user-hackathon",
          toolName || "request_reservation",
          JSON.stringify(payload || {}),
          status || "APPROVED",
          Date.now(),
          Date.now()
        )
        .run();
    }

    return new Response(JSON.stringify({ success: true, approvalId: id, status }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
