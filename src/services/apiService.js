/**
 * API Service bridging WebMCP Tool Handlers with Original HelloBusan Backend & D1 Database
 */

const BUSAN_BACKEND_URL = "http://localhost:8787";

export async function fetchPlacesFromWorker(query = {}) {
  try {
    const params = new URLSearchParams();
    if (query.district) params.append("district", query.district);
    if (query.maxPrice) params.append("maxPrice", query.maxPrice);
    if (query.isIndoor) params.append("isIndoor", "true");
    if (query.childFriendly) params.append("childFriendly", "true");

    const res = await fetch(`${BUSAN_BACKEND_URL}/api/webmcp/places?${params.toString()}`).catch(() => fetch(`/api/places?${params.toString()}`));
    if (res.ok) {
      const data = await res.json();
      return data.places || data;
    }
  } catch (err) {
    console.warn("HelloBusan Backend API offline, falling back to dataset:", err);
  }
  return null;
}

export async function fetchRestaurantsFromWorker(query = {}) {
  try {
    const params = new URLSearchParams();
    if (query.district) params.append("district", query.district);
    if (query.maxPriceAvg) params.append("maxPriceAvg", query.maxPriceAvg);
    if (query.childFriendly) params.append("childFriendly", "true");

    const res = await fetch(`${BUSAN_BACKEND_URL}/api/webmcp/restaurants?${params.toString()}`).catch(() => fetch(`/api/restaurants?${params.toString()}`));
    if (res.ok) {
      const data = await res.json();
      return data.restaurants || data;
    }
  } catch (err) {
    console.warn("HelloBusan Backend API offline, falling back to dataset:", err);
  }
  return null;
}

export async function sendReservationToBusanBackend(payload) {
  try {
    const res = await fetch(`${BUSAN_BACKEND_URL}/api/webmcp/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "WebMCP Agent Guest",
        email: "agent@hellobusan.kr",
        country: "KOR",
        experienceId: "jagalchi-market-table",
        date: new Date().toISOString().split("T")[0],
        time: payload.time || "17:30",
        partySize: payload.partySize || 2
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to reach HelloBusan Backend reservation endpoint:", err);
  }
  return null;
}

export async function persistToolCallToD1(logEvent) {
  try {
    await fetch(`${BUSAN_BACKEND_URL}/api/webmcp/tool-calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEvent)
    }).catch(() => fetch("/api/tool-calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEvent)
    }));
  } catch (err) {
    console.warn("Cloudflare D1 Audit Logging Fallback:", err);
  }
}

export async function persistApprovalToD1(approvalData) {
  try {
    await fetch(`${BUSAN_BACKEND_URL}/api/webmcp/approvals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(approvalData)
    }).catch(() => fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(approvalData)
    }));
  } catch (err) {
    console.warn("Cloudflare D1 Approval Recording Fallback:", err);
  }
}
