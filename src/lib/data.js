/**
 * Seed-data access layer. In production (see PRD section 7/8) this would be
 * Cloudflare D1 queries behind Worker endpoints; for the hackathon demo the
 * same shapes are served from static JSON so the whole thing runs anywhere
 * (Vercel/Netlify/Cloudflare Pages/localhost) with zero backend setup.
 */

const BASE = import.meta.env.BASE_URL || "./";

let cache = null;

export async function loadCityData() {
  if (cache) return cache;
  const [places, restaurants, events] = await Promise.all([
    fetch(`${BASE}data/places.json`).then((r) => r.json()),
    fetch(`${BASE}data/restaurants.json`).then((r) => r.json()),
    fetch(`${BASE}data/events.json`).then((r) => r.json()),
  ]);
  cache = { places, restaurants, events };
  return cache;
}

export function filterPlaces(places, { rainy, hasChild, district } = {}) {
  return places.filter((p) => {
    if (rainy && !p.rain_ok) return false;
    if (hasChild && !p.kid_friendly) return false;
    if (district && p.district !== district) return false;
    return true;
  });
}

export function filterEvents(events, { rainy, hasChild, district } = {}) {
  return filterPlaces(events, { rainy, hasChild, district });
}

export function filterRestaurants(
  restaurants,
  { budgetPerPerson, hasChild, dietary = [], district } = {},
) {
  return restaurants.filter((r) => {
    if (hasChild && !r.kid_friendly) return false;
    if (district && r.district !== district) return false;
    if (budgetPerPerson && r.price_min > budgetPerPerson) return false;
    if (dietary.length) {
      const ok = dietary.every(
        (d) => r.dietary.includes(d) || r.dietary.includes("halal") === (d === "halal"),
      );
      if (!ok && !dietary.some((d) => r.dietary.includes(d))) return false;
    }
    return true;
  });
}

export function rankBySuitability(items, goal) {
  return [...items].sort((a, b) => {
    // Prefer free/cheap first when budget is tight, otherwise prefer rating
    // for restaurants and tag richness for places.
    const scoreA = scoreItem(a, goal);
    const scoreB = scoreItem(b, goal);
    return scoreB - scoreA;
  });
}

function scoreItem(item, goal) {
  let score = 0;
  if (item.rating) score += item.rating;
  if (goal.rainy && item.indoor) score += 2;
  if (goal.hasChild && item.kid_friendly) score += 1;
  if (item.price_min === 0) score += 1;
  score += (item.tags || []).length * 0.1;
  return score;
}
