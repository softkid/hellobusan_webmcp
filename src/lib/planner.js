import { estimateTravelMinutes } from "./geo.js";
import { rankBySuitability } from "./data.js";

const DAY_START_MIN = 10 * 60; // 10:00
const MAX_ACTIVITIES = 4;
const TIME_SLACK = 1.15; // allow a little slack for travel between stops

function formatTime(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function itemCost(item, partySize) {
  const per = item.price_min ?? 0;
  return per * partySize;
}

/**
 * Lays a chosen, ordered set of stops onto a timeline, computing real
 * travel time between every consecutive pair (see lib/geo.js). Returns the
 * same items with `time` assigned, plus totals — used both to preview a
 * candidate itinerary and to re-check it after trimming a stop.
 */
function layoutTimeline(orderedItems) {
  let cursor = DAY_START_MIN;
  const routeLegs = [];
  const items = orderedItems.map((item, idx) => {
    const start = cursor;
    cursor += item.duration_min;
    if (idx < orderedItems.length - 1) {
      const next = orderedItems[idx + 1];
      const travel = estimateTravelMinutes(item, next);
      routeLegs.push({ from: item.name, to: next.name, minutes: travel });
      cursor += travel;
    }
    return { ...item, time: formatTime(start) };
  });
  const totalCost = items.reduce((s, i) => s + i.estCost, 0);
  const totalMinutes = cursor - DAY_START_MIN;
  return { items, totalCost, totalMinutes, routeLegs };
}

/**
 * Greedily selects activities (places + events) and restaurant meal stops
 * that plausibly fit the time and budget the person asked for, then
 * verifies the *real* laid-out plan (including travel time between stops)
 * against those same limits and trims until it actually fits. All numbers
 * here are computed from the seed dataset — nothing is hardcoded per
 * prompt.
 */
export function buildItinerary(goal, { places, events, restaurants }) {
  const partySize = goal.hasChild ? 2 : 1;
  const totalMinutesBudget = goal.durationHours * 60;

  const activityPool = rankBySuitability([...places, ...events], goal);
  const restaurantPool = rankBySuitability(restaurants, goal);

  const chosen = [];
  let usedMinutes = 0;
  let usedCost = 0;

  for (const item of activityPool) {
    if (chosen.length >= MAX_ACTIVITIES) break;
    const cost = itemCost(item, partySize);
    const duration = item.duration_min ?? 60;
    if (usedMinutes + duration > totalMinutesBudget) continue;
    if (usedCost + cost > goal.budget) continue;
    chosen.push({
      ...item,
      kind: events.includes(item) ? "event" : "place",
      estCost: cost,
      duration_min: duration,
    });
    usedMinutes += duration;
    usedCost += cost;
  }

  const meals = [];
  for (let i = 0; i < goal.mealsNeeded; i++) {
    const meal = restaurantPool.find(
      (r) => !meals.some((m) => m.id === r.id) && usedCost + itemCost(r, partySize) <= goal.budget,
    );
    if (meal) {
      const cost = itemCost(meal, partySize);
      meals.push({ ...meal, kind: "restaurant", estCost: cost, duration_min: 60 });
      usedCost += cost;
    }
  }

  // Interleave: lunch after ~half the activities, dinner at the very end.
  let timeline = [...chosen];
  if (meals[0]) timeline.splice(Math.max(1, Math.floor(timeline.length * 0.5)), 0, meals[0]);
  if (meals[1]) timeline.push(meals[1]);

  const removed = [];

  function worstNonMealIndex(byField) {
    let idx = -1;
    let worst = -1;
    timeline.forEach((item, i) => {
      if (item.kind === "restaurant") return;
      const v = byField(item);
      if (v > worst) {
        worst = v;
        idx = i;
      }
    });
    return idx;
  }

  // Re-check the REAL laid-out plan (travel time included) against both
  // budget and duration, trimming the least essential non-meal stop until
  // it genuinely fits — or only meal stop(s) remain.
  let laid = layoutTimeline(timeline);
  let guard = 0;
  while (
    (laid.totalCost > goal.budget || laid.totalMinutes > totalMinutesBudget * TIME_SLACK) &&
    timeline.some((i) => i.kind !== "restaurant") &&
    guard < 10
  ) {
    guard += 1;
    const idx =
      laid.totalCost > goal.budget
        ? worstNonMealIndex((i) => i.estCost)
        : worstNonMealIndex((i) => i.duration_min);
    if (idx === -1) break;
    removed.push(timeline[idx]);
    timeline.splice(idx, 1);
    laid = layoutTimeline(timeline);
  }

  return {
    items: laid.items,
    removed,
    totalCost: laid.totalCost,
    totalMinutes: laid.totalMinutes,
    partySize,
    routeLegs: laid.routeLegs,
  };
}
