/**
 * A small, deterministic rule-based parser that turns a natural-language
 * goal (Korean or English) into structured constraints the planner can use.
 *
 * This is intentionally NOT a call to a hosted LLM: HelloBusan should run
 * fully client-side with zero API keys so hackathon judges can try it
 * instantly. It only needs to reliably parse the handful of constraint
 * types the demo scenario cares about (budget, duration, weather, child,
 * dietary, district) — see HELLOBUSAN_PRD.md section 4 and 15.
 */

const DISTRICT_ALIASES = [
  { match: ["해운대"], district: "Haeundae-gu" },
  { match: ["광안리", "광안"], district: "Suyeong-gu" },
  { match: ["남포동", "남포", "자갈치", "biff"], district: "Jung-gu" },
  { match: ["감천", "감천문화마을"], district: "Saha-gu" },
  { match: ["영도", "태종대", "흰여울"], district: "Yeongdo-gu" },
  { match: ["동래"], district: "Dongnae-gu" },
  { match: ["기장", "용궁사"], district: "Gijang-gun" },
  { match: ["haeundae"], district: "Haeundae-gu" },
  { match: ["gwangalli"], district: "Suyeong-gu" },
  { match: ["nampo", "jagalchi"], district: "Jung-gu" },
];

const KRW_PER_USD = 1350;

function parseBudget(text) {
  // "5만원", "5.5만원"
  const manwon = text.match(/(\d+(?:\.\d+)?)\s*만\s*원/);
  if (manwon) return Math.round(parseFloat(manwon[1]) * 10000);

  // "50000원" / "50,000원"
  const won = text.match(/([\d,]+)\s*원/);
  if (won) return parseInt(won[1].replace(/,/g, ""), 10);

  // "₩50,000" / "KRW 50000"
  const wonSign = text.match(/₩\s*([\d,]+)/);
  if (wonSign) return parseInt(wonSign[1].replace(/,/g, ""), 10);

  // "$40" / "40 dollars" / "under $40"
  const usd = text.match(/\$\s*([\d,]+)/) || text.match(/([\d,]+)\s*dollars?/i);
  if (usd) return Math.round(parseInt(usd[1].replace(/,/g, ""), 10) * KRW_PER_USD);

  return null;
}

function parseDurationHours(text) {
  const ko = text.match(/(\d+(?:\.\d+)?)\s*시간/);
  if (ko) return parseFloat(ko[1]);

  const en = text.match(/(\d+(?:\.\d+)?)\s*(?:hours|hrs|hr)/i);
  if (en) return parseFloat(en[1]);

  return null;
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

/**
 * @param {string} rawText
 * @returns {{
 *   raw: string,
 *   budget: number,
 *   durationHours: number,
 *   hasChild: boolean,
 *   rainy: boolean,
 *   dietary: string[],
 *   district: string|null,
 *   mealsNeeded: number,
 * }}
 */
export function parseGoal(rawText) {
  const text = (rawText || "").trim();
  const lower = text.toLowerCase();

  const budget = parseBudget(text) ?? 50000;
  const durationHours = parseDurationHours(text) ?? 4;

  const hasChild = includesAny(text, ["아이", "아이와", "아이랑", "자녀", "kid", "kids", "child", "children", "family"]);
  const rainy = includesAny(text, ["비", "비가", "우천", "rain", "rainy"]);

  const dietary = [];
  if (includesAny(lower, ["채식", "비건", "vegetarian", "vegan"])) dietary.push("vegetarian_option");
  if (includesAny(lower, ["할랄", "halal"])) dietary.push("halal");

  let district = null;
  for (const entry of DISTRICT_ALIASES) {
    if (includesAny(lower, entry.match)) {
      district = entry.district;
      break;
    }
  }

  const mealsNeeded = durationHours >= 5 ? 2 : durationHours >= 2.5 ? 1 : 0;

  return { raw: text, budget, durationHours, hasChild, rainy, dietary, district, mealsNeeded };
}

export function describeGoal(goal) {
  const parts = [];
  parts.push(`Budget ₩${goal.budget.toLocaleString()}`);
  parts.push(`${goal.durationHours}h`);
  if (goal.hasChild) parts.push("with kid");
  if (goal.rainy) parts.push("rainy");
  if (goal.district) parts.push(goal.district);
  if (goal.dietary.length) parts.push(goal.dietary.join(", "));
  return parts.join(" · ");
}
