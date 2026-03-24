import type { SearchScenario } from "@/core/search/scenarioConfig";
import { SEARCH_SCENARIOS } from "@/core/search/scenarioConfig";
import type { LocalFlowType, ResolvedIntent } from "./types";

/**
 * Scenario ids that start a conversational flow (not an immediate navigation).
 */
const FLOW_START_BY_SCENARIO_ID: Partial<Record<string, LocalFlowType>> = {
  apply_loan: "loan",
  withdraw_money: "withdrawal",
  full_withdrawal: "withdrawal",
  start_enrollment: "enrollment",
  resume_enrollment: "enrollment",
  vested_balance: "vesting",
};

/** Pick the scenario whose longest matching keyword is contained in the query (deterministic). */
export function findBestScenario(input: string): SearchScenario | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;

  let best: { scenario: SearchScenario; score: number } | null = null;

  for (const s of SEARCH_SCENARIOS) {
    for (const k of s.keywords) {
      const kk = k.toLowerCase().trim();
      if (!kk || !q.includes(kk)) continue;
      const score = kk.length;
      if (!best || score > best.score) {
        best = { scenario: s, score };
      }
    }
  }

  return best?.scenario ?? null;
}

/**
 * Map search / command scenarios to a resolved intent for the local AI engine.
 */
export function resolveIntent(input: string): ResolvedIntent {
  const match = findBestScenario(input);
  if (!match) return { kind: "fallback" };

  const flowType = FLOW_START_BY_SCENARIO_ID[match.id];
  if (flowType) {
    return { kind: "flow", flow: flowType };
  }

  if (match.type === "navigation" && match.route) {
    return { kind: "navigate", route: match.route };
  }

  if (match.type === "action" && match.action) {
    return { kind: "action", action: match.action };
  }

  if (match.type === "ai" && match.quickAnswer) {
    return {
      kind: "answer",
      content: match.quickAnswer,
      title: match.queries[0],
    };
  }

  if (match.type === "ai") {
    const hint = match.queries[0] ?? "that topic";
    return {
      kind: "answer",
      content: `I don’t have a detailed scripted answer for “${hint}” yet. Rules vary by employer—check your summary plan description or HR. You can also try loans, withdrawals, enrollment, or the suggestion chips below.`,
    };
  }

  return { kind: "fallback" };
}
