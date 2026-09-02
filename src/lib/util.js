let counter = 0;

export function nextId(prefix = "id") {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

export function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString("ko-KR", { hour12: false });
}

export function krw(n) {
  return `₩${Math.round(n).toLocaleString()}`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
