import { useCallback, useEffect, useRef, useState } from "react";
import { TOOL_DEFINITIONS, AGENT_STEP_SEQUENCE } from "../lib/constants.js";
import { loadCityData, filterPlaces, filterEvents, filterRestaurants } from "../lib/data.js";
import { parseGoal } from "../lib/nlu.js";
import { buildItinerary } from "../lib/planner.js";
import { getSimulatedWeather } from "../lib/weather.js";
import { createDefaultWallet, loadWallet, saveWallet, resolvePolicy, setRowPolicy } from "../lib/permissions.js";
import { nextId, krw, sleep } from "../lib/util.js";
import { estimateTravelMinutes, distanceKm } from "../lib/geo.js";

const STEP_DELAY_MS = 550;

function denyMessage(name) {
  if (name === "process_payment") {
    return "🔒 Payment is never executed in this MVP — locked until a Human Approval architecture ships.";
  }
  if (name === "update_profile") {
    return "🔒 Profile mutation is blocked in this MVP.";
  }
  return `🔒 "${name}" is currently blocked by policy.`;
}

export function useAgentEngine() {
  const [wallet, setWallet] = useState(() => loadWallet());
  const [cityData, setCityData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [itinerary, setItinerary] = useState({
    items: [],
    removed: [],
    totalCost: 0,
    totalMinutes: 0,
    partySize: 1,
    routeLegs: [],
    reservation: null,
    goal: null,
  });
  const [activity, setActivity] = useState([]);
  const [blackbox, setBlackbox] = useState([]);
  const [selectedBlackboxId, setSelectedBlackboxId] = useState(null);
  const [pendingApproval, setPendingApproval] = useState(null);
  const [agentStatus, setAgentStatus] = useState("idle"); // idle | working | done | error
  const [lastRunMeta, setLastRunMeta] = useState(null);
  const [toolRegistry, setToolRegistry] = useState({}); // name -> {supported, registered}
  const [webmcpSupported, setWebmcpSupported] = useState(
    typeof document !== "undefined" && Boolean(document.modelContext),
  );

  const ctxRef = useRef({ wallet, cityData, itinerary, weather });
  useEffect(() => {
    ctxRef.current = { wallet, cityData, itinerary, weather };
  }, [wallet, cityData, itinerary, weather]);

  const approvalResolvers = useRef(new Map());
  const runMetaRef = useRef(null);

  useEffect(() => {
    loadCityData().then(setCityData);
  }, []);

  useEffect(() => {
    saveWallet(wallet);
  }, [wallet]);

  const pushActivity = useCallback((entry) => {
    setActivity((prev) => [{ id: nextId("act"), ts: new Date(), ...entry }, ...prev].slice(0, 60));
  }, []);

  const pushBlackbox = useCallback((entry) => {
    const id = nextId("call");
    setBlackbox((prev) => [{ id, ts: new Date(), ...entry }, ...prev].slice(0, 80));
    setSelectedBlackboxId(id);
    return id;
  }, []);

  const requestApproval = useCallback((entry) => {
    return new Promise((resolve, reject) => {
      const id = nextId("appr");
      approvalResolvers.current.set(id, { resolve, reject });
      setPendingApproval({ id, ...entry });
    });
  }, []);

  const resolveApproval = useCallback((id, approved) => {
    const r = approvalResolvers.current.get(id);
    if (!r) return;
    approvalResolvers.current.delete(id);
    setPendingApproval(null);
    if (approved) r.resolve();
    else r.reject(new Error("REJECTED_BY_USER"));
  }, []);

  // ---- Tool business logic (pure-ish; reads ctxRef, writes via setters) ----

  const impl = useRef({
    async get_weather() {
      const ctx = ctxRef.current;
      const w = getSimulatedWeather(ctx.rainyOverride);
      setWeather(w);
      return {
        content: [{ type: "text", text: `${w.label}, ${w.tempC}°C (${w.source})` }],
        summary: `${w.label} · ${w.tempC}°C`,
        data: w,
      };
    },

    async search_places(input = {}) {
      const ctx = ctxRef.current;
      if (!ctx.cityData) throw new Error("City data is still loading.");
      const results = filterPlaces(ctx.cityData.places, {
        rainy: input.rainy,
        hasChild: input.hasChild,
        district: input.district || undefined,
      }).slice(0, input.limit ?? 12);
      return {
        content: [{ type: "text", text: `Found ${results.length} places.` }],
        summary: `${results.length} results`,
        data: results,
      };
    },

    async search_events(input = {}) {
      const ctx = ctxRef.current;
      if (!ctx.cityData) throw new Error("City data is still loading.");
      const results = filterEvents(ctx.cityData.events, {
        rainy: input.rainy,
        hasChild: input.hasChild,
        district: input.district || undefined,
      }).slice(0, input.limit ?? 8);
      return {
        content: [{ type: "text", text: `Found ${results.length} events.` }],
        summary: `${results.length} results`,
        data: results,
      };
    },

    async search_restaurants(input = {}) {
      const ctx = ctxRef.current;
      if (!ctx.cityData) throw new Error("City data is still loading.");
      const results = filterRestaurants(ctx.cityData.restaurants, {
        budgetPerPerson: input.budgetPerPerson,
        hasChild: input.hasChild,
        dietary: input.dietary || [],
        district: input.district || undefined,
      }).slice(0, input.limit ?? 8);
      return {
        content: [{ type: "text", text: `Found ${results.length} restaurants.` }],
        summary: `${results.length} results`,
        data: results,
      };
    },

    async get_place_details(input = {}) {
      const ctx = ctxRef.current;
      if (!ctx.cityData) throw new Error("City data is still loading.");
      const all = [...ctx.cityData.places, ...ctx.cityData.restaurants, ...ctx.cityData.events];
      const found = all.find((p) => p.id === input.id || p.name === input.name);
      if (!found) throw new Error(`No place found for "${input.id || input.name}".`);
      return {
        content: [{ type: "text", text: `${found.name} — ${found.district}` }],
        summary: found.name,
        data: found,
      };
    },

    async estimate_cost(input = {}) {
      const ctx = ctxRef.current;
      const items = input.items ?? ctx.itinerary.items;
      const partySize = input.partySize ?? ctx.itinerary.partySize ?? 1;
      const total = items.reduce((s, it) => s + (it.estCost ?? (it.price_min ?? 0) * partySize), 0);
      return {
        content: [{ type: "text", text: `Estimated cost ${krw(total)} (for ${partySize} ${partySize === 1 ? "person" : "people"})` }],
        summary: krw(total),
        data: { total, partySize },
      };
    },

    async calculate_route(input = {}) {
      const ctx = ctxRef.current;
      const stops = input.stops ?? ctx.itinerary.items;
      const legs = [];
      let totalMin = 0;
      let totalKm = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        const minutes = estimateTravelMinutes(stops[i], stops[i + 1]);
        const km = distanceKm(stops[i], stops[i + 1]);
        legs.push({ from: stops[i].name, to: stops[i + 1].name, minutes, km: Math.round(km * 10) / 10 });
        totalMin += minutes;
        totalKm += km;
      }
      return {
        content: [{ type: "text", text: `${legs.length} legs, ${totalMin}min total travel` }],
        summary: `${legs.length} routes · ${totalMin}min`,
        data: { legs, totalMin, totalKm: Math.round(totalKm * 10) / 10 },
      };
    },

    async get_itinerary() {
      const ctx = ctxRef.current;
      return {
        content: [{ type: "text", text: `Current itinerary: ${ctx.itinerary.items.length} items` }],
        summary: `${ctx.itinerary.items.length} items`,
        data: ctx.itinerary,
      };
    },

    async update_itinerary(input = {}) {
      const before = ctxRef.current.itinerary.items.length;
      setItinerary((prev) => {
        if (input.action === "replace_all") {
          return { ...prev, ...input.payload };
        }
        if (input.action === "remove" && input.itemId) {
          return { ...prev, items: prev.items.filter((i) => i.id !== input.itemId) };
        }
        if (input.action === "add" && input.item) {
          return { ...prev, items: [...prev.items, input.item] };
        }
        return prev;
      });
      await sleep(10);
      const after = input.payload?.items?.length ?? before;
      return {
        content: [{ type: "text", text: `Itinerary updated (${after} items).` }],
        summary: `${after} items`,
        data: input,
      };
    },

    async request_reservation(input = {}) {
      // NOTE: this only ever runs after the permission gate in callTool has
      // resolved the ASK approval (or been explicitly ALLOWed by the
      // wallet). It never touches a real payment provider.
      setItinerary((prev) => ({
        ...prev,
        reservation: { ...input, status: "confirmed", confirmedAt: new Date().toISOString() },
      }));
      return {
        content: [{ type: "text", text: `${input.name} reservation confirmed (no payment was processed).` }],
        summary: `Reserved: ${input.name}`,
        data: input,
      };
    },

    async process_payment() {
      throw new Error(denyMessage("process_payment"));
    },

    async update_profile() {
      throw new Error(denyMessage("update_profile"));
    },
  });

  function buildApprovalPayload(name, input) {
    if (name === "request_reservation") return input;
    return input;
  }

  const callTool = useCallback(
    async (name, input) => {
      const wallet0 = ctxRef.current.wallet;
      const policy = resolvePolicy(wallet0, name);
      const startedAt = performance.now();

      if (policy === "deny") {
        const msg = denyMessage(name);
        pushBlackbox({ tool: name, input, output: msg, permission: policy, status: "BLOCKED", latencyMs: 0, impact: "Execution blocked" });
        pushActivity({ tool: name, status: "blocked", message: msg });
        if (runMetaRef.current) runMetaRef.current.errors += 1;
        throw new Error(msg);
      }

      if (policy === "ask") {
        pushActivity({ tool: name, status: "pending", message: "Waiting for your approval" });
        try {
          await requestApproval({ toolName: name, input, payload: buildApprovalPayload(name, input) });
        } catch (err) {
          const latencyMs = Math.round(performance.now() - startedAt);
          pushBlackbox({ tool: name, input, output: "REJECTED", permission: policy, status: "REJECTED", latencyMs, impact: "Rejected by user" });
          pushActivity({ tool: name, status: "rejected", message: "You rejected the approval request." });
          if (runMetaRef.current) runMetaRef.current.errors += 1;
          throw err;
        }
      }

      try {
        const fn = impl.current[name];
        if (!fn) throw new Error(`Unknown tool: ${name}`);
        const result = await fn(input);
        const latencyMs = Math.round(performance.now() - startedAt);
        pushBlackbox({
          tool: name,
          input,
          output: result.summary,
          permission: policy,
          status: policy === "ask" ? "APPROVED" : "SUCCESS",
          latencyMs,
          impact: result.summary,
          rawData: Array.isArray(result.data) ? result.data : undefined,
        });
        pushActivity({ tool: name, status: "success", message: result.summary });
        if (runMetaRef.current) runMetaRef.current.toolCalls += 1;
        return result;
      } catch (err) {
        const latencyMs = Math.round(performance.now() - startedAt);
        pushBlackbox({ tool: name, input, output: String(err.message || err), permission: policy, status: "ERROR", latencyMs, impact: "Error" });
        pushActivity({ tool: name, status: "error", message: String(err.message || err) });
        if (runMetaRef.current) runMetaRef.current.errors += 1;
        throw err;
      }
    },
    [pushActivity, pushBlackbox, requestApproval],
  );

  const runAgent = useCallback(
    async (goalText, options = {}) => {
      if (!ctxRef.current.cityData) return;
      const stepDelay = options.fast ? 30 : STEP_DELAY_MS;
      const goal = parseGoal(goalText);
      ctxRef.current.rainyOverride = goal.rainy || undefined;

      setAgentStatus("working");
      setItinerary((prev) => ({ ...prev, items: [], removed: [], reservation: null, goal }));
      runMetaRef.current = { toolCalls: 0, errors: 0, startedAt: performance.now() };
      pushActivity({ tool: "agent", status: "start", message: `Goal received: "${goal.raw}"` });
      let finalMeta = null;

      try {
        const weatherRes = await callTool("get_weather", {});
        await sleep(stepDelay);

        const placesRes = await callTool("search_places", {
          rainy: weatherRes.data.rain,
          hasChild: goal.hasChild,
          district: goal.district,
        });
        await sleep(stepDelay);

        const eventsRes = await callTool("search_events", {
          rainy: weatherRes.data.rain,
          hasChild: goal.hasChild,
          district: goal.district,
        });
        await sleep(stepDelay);

        const partySizeGuess = goal.hasChild ? 2 : 1;
        const perMealBudget = goal.mealsNeeded
          ? Math.round(goal.budget / partySizeGuess / (goal.mealsNeeded + 1))
          : undefined;
        const restaurantsRes = await callTool("search_restaurants", {
          budgetPerPerson: perMealBudget,
          hasChild: goal.hasChild,
          dietary: goal.dietary,
          district: goal.district,
        });
        await sleep(stepDelay);

        const plan = buildItinerary(goal, {
          places: placesRes.data,
          events: eventsRes.data,
          restaurants: restaurantsRes.data,
        });

        const costRes = await callTool("estimate_cost", { items: plan.items, partySize: plan.partySize });
        await sleep(stepDelay);

        const routeRes = await callTool("calculate_route", { stops: plan.items });
        await sleep(stepDelay);

        await callTool("update_itinerary", {
          action: "replace_all",
          payload: {
            items: plan.items,
            removed: plan.removed,
            totalCost: costRes.data.total,
            totalMinutes: plan.totalMinutes,
            partySize: plan.partySize,
            routeLegs: routeRes.data.legs,
            goal,
          },
        });
        // The plan itself is ready at this point. Anything after this is a
        // human-approval wait for the reservation, which can take an
        // arbitrary amount of real-world time — it would be unfair (and
        // misleading) to fold that open-ended wait into a "how fast is the
        // agent" benchmark, so we snapshot elapsed time here.
        if (runMetaRef.current) {
          runMetaRef.current.planReadyElapsedMs = Math.round(performance.now() - runMetaRef.current.startedAt);
        }
        await sleep(stepDelay);

        const mealStop = [...plan.items].reverse().find((i) => i.kind === "restaurant");
        if (mealStop) {
          try {
            await callTool("request_reservation", {
              name: mealStop.name,
              time: mealStop.time,
              partySize: plan.partySize,
              cost: mealStop.estCost,
            });
          } catch {
            // Rejection/denial is a valid, logged outcome — not a crash.
          }
        }

        setAgentStatus("done");
      } catch (err) {
        setAgentStatus("error");
        pushActivity({ tool: "agent", status: "error", message: String(err.message || err) });
      } finally {
        if (runMetaRef.current) {
          const elapsedMs =
            runMetaRef.current.planReadyElapsedMs ?? Math.round(performance.now() - runMetaRef.current.startedAt);
          finalMeta = { ...runMetaRef.current, elapsedMs, interactions: runMetaRef.current.toolCalls };
          setLastRunMeta(finalMeta);
        }
      }
      return finalMeta;
    },
    [callTool, pushActivity],
  );

  const setPermissionRow = useCallback((rowKey, policy) => {
    setWallet((prev) => setRowPolicy(prev, rowKey, policy));
  }, []);

  const setDailyLimit = useCallback((value) => {
    setWallet((prev) => ({ ...prev, dailyLimit: value }));
  }, []);

  const resetWallet = useCallback(() => {
    setWallet(createDefaultWallet());
  }, []);

  const markToolRegistration = useCallback((name, state) => {
    setToolRegistry((prev) => ({ ...prev, [name]: state }));
    setWebmcpSupported((prev) => prev || state.supported);
  }, []);

  return {
    wallet,
    setPermissionRow,
    setDailyLimit,
    resetWallet,
    cityData,
    weather,
    itinerary,
    activity,
    blackbox,
    selectedBlackboxId,
    setSelectedBlackboxId,
    pendingApproval,
    resolveApproval,
    agentStatus,
    lastRunMeta,
    runAgent,
    callTool,
    toolRegistry,
    markToolRegistration,
    webmcpSupported,
    toolDefinitions: TOOL_DEFINITIONS,
    agentStepSequence: AGENT_STEP_SEQUENCE,
  };
}
