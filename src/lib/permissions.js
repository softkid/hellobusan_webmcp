import { TOOL_DEFINITIONS, PERMISSION_ROWS, DEFAULT_DAILY_LIMIT } from "./constants.js";

const STORAGE_KEY = "hellobusan.wallet.v1";

export function createDefaultWallet() {
  const toolPolicy = {};
  for (const t of TOOL_DEFINITIONS) toolPolicy[t.name] = t.defaultPolicy;
  return { toolPolicy, dailyLimit: DEFAULT_DAILY_LIMIT, spentToday: 0 };
}

export function loadWallet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultWallet();
    const parsed = JSON.parse(raw);
    // Merge with defaults so newly-added tools always have a policy.
    return { ...createDefaultWallet(), ...parsed, toolPolicy: { ...createDefaultWallet().toolPolicy, ...parsed.toolPolicy } };
  } catch {
    return createDefaultWallet();
  }
}

export function saveWallet(wallet) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.) — the wallet
    // still works in-memory for the session.
  }
}

/**
 * Resolves the effective policy for a tool: 'allow' | 'ask' | 'deny'.
 * process_payment and update_profile are hard-locked to 'deny' — the
 * PRD treats these as out of scope for the MVP no matter what the wallet
 * UI says, so we enforce it here too (never trust the client, and never
 * trust a single toggle for financial/personal-data actions).
 */
export function resolvePolicy(wallet, toolName) {
  const row = PERMISSION_ROWS.find((r) => r.tools.includes(toolName));
  if (row?.locked) return "deny";
  return wallet.toolPolicy[toolName] || "allow";
}

export function setRowPolicy(wallet, rowKey, policy) {
  const row = PERMISSION_ROWS.find((r) => r.key === rowKey);
  if (!row || row.locked) return wallet;
  const toolPolicy = { ...wallet.toolPolicy };
  for (const t of row.tools) toolPolicy[t] = policy;
  return { ...wallet, toolPolicy };
}
