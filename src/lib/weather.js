/**
 * get_weather is backed by a deterministic simulator rather than a live
 * weather API, so the whole demo runs with zero API keys (see
 * HELLOBUSAN_TODO.md P1 "weather mock/API"). It's clearly labelled as
 * simulated in the UI. When the person's own goal text states a condition
 * ("오늘 비가 오는데...") the agent honors that stated premise instead.
 */

const CONDITIONS = [
  { code: "clear", label: "맑음 (Clear)", rain: false, tempRange: [20, 29] },
  { code: "cloudy", label: "흐림 (Cloudy)", rain: false, tempRange: [18, 25] },
  { code: "rain", label: "비 (Rain)", rain: true, tempRange: [16, 22] },
];

function hashStr(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function getSimulatedWeather(rainyOverride) {
  if (rainyOverride === true) {
    return { ...CONDITIONS[2], tempC: 18, simulated: true, source: "stated in your goal" };
  }
  const seed = hashStr(new Date().toISOString().slice(0, 10) + "hellobusan");
  const pool = rainyOverride === false ? [CONDITIONS[0], CONDITIONS[1]] : CONDITIONS;
  const cond = pool[seed % pool.length];
  const [lo, hi] = cond.tempRange;
  const tempC = lo + (seed % (hi - lo + 1));
  return { ...cond, tempC, simulated: true, source: "simulated for today" };
}
