/**
 * API Service bridging WebMCP Tool Handlers with Cloudflare Worker / D1 Endpoints
 */

export async function fetchPlacesFromWorker(query = {}) {
  try {
    const params = new URLSearchParams();
    if (query.district) params.append("district", query.district);
    if (query.maxPrice) params.append("maxPrice", query.maxPrice);
    if (query.isIndoor) params.append("isIndoor", "true");
    if (query.childFriendly) params.append("childFriendly", "true");

    const res = await fetch(`/api/places?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Cloudflare Worker API Offline, fallback to local dataset:", err);
  }
  return null;
}

export async function fetchRestaurantsFromWorker(query = {}) {
  try {
    const params = new URLSearchParams();
    if (query.district) params.append("district", query.district);
    if (query.maxPriceAvg) params.append("maxPriceAvg", query.maxPriceAvg);
    if (query.childFriendly) params.append("childFriendly", "true");

    const res = await fetch(`/api/restaurants?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Cloudflare Worker API Offline, fallback to local dataset:", err);
  }
  return null;
}

export async function persistToolCallToD1(logEvent) {
  try {
    await fetch("/api/tool-calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEvent)
    });
  } catch (err) {
    console.warn("Cloudflare D1 Audit Logging Fallback:", err);
  }
}

export async function persistApprovalToD1(approvalData) {
  try {
    await fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(approvalData)
    });
  } catch (err) {
    console.warn("Cloudflare D1 Approval Recording Fallback:", err);
  }
}
