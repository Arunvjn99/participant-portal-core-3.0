import type { NavigateFunction } from "react-router-dom";
import { withVersionIfEnrollment } from "@/core/version";
import type { OpenAIModalInput } from "@/stores/aiAssistantStore";
import { buildActionHandlers } from "./actionHandlers";
import { getScenarioById, SEARCH_SCENARIOS } from "./scenarioConfig";

export interface ScenarioExecutionContext {
  navigate: (to: string) => void;
  routeVersion: string;
  openAIModal: (input?: OpenAIModalInput) => void;
  /**
   * When set, `type: "ai"` scenarios that define `quickAnswer` invoke this instead of opening Core AI
   * (e.g. inline toast). If omitted, quick-answer scenarios still open the modal with the user question.
   */
  onQuickAnswer?: (payload: { scenarioId: string; question: string; answer: string }) => void;
}

export interface ScenarioExecutionOptions {
  /** Prefer this text when opening Core AI (e.g. chosen suggestion label). */
  promptOverride?: string;
}

export function executeScenario(
  scenarioId: string,
  ctx: ScenarioExecutionContext,
  options?: ScenarioExecutionOptions,
) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return;

  if (scenario.type === "navigation" && scenario.route) {
    ctx.navigate(withVersionIfEnrollment(ctx.routeVersion, scenario.route));
    return;
  }

  if (scenario.type === "action" && scenario.action) {
    const handlers = buildActionHandlers(ctx.navigate as NavigateFunction, ctx.routeVersion);
    const run = handlers[scenario.action];
    if (run) run();
    return;
  }

  if (scenario.type === "ai") {
    const userQ = options?.promptOverride?.trim() || scenario.queries[0] || "";
    if (scenario.quickAnswer && ctx.onQuickAnswer) {
      ctx.onQuickAnswer({
        scenarioId: scenario.id,
        question: userQ,
        answer: scenario.quickAnswer,
      });
      return;
    }
    ctx.openAIModal(userQ || undefined);
  }
}

/** Best-effort match for raw submit (exact query → keyword contains). */
export function findScenarioForRawQuery(raw: string): string | null {
  const nq = raw.trim().toLowerCase();
  if (!nq) return null;

  for (const s of SEARCH_SCENARIOS) {
    if (s.queries.some((qq) => qq.toLowerCase() === nq)) return s.id;
  }
  for (const s of SEARCH_SCENARIOS) {
    if (s.keywords.some((k) => nq === k.toLowerCase())) return s.id;
  }
  for (const s of SEARCH_SCENARIOS) {
    if (s.keywords.some((k) => nq.includes(k.toLowerCase()))) return s.id;
  }
  return null;
}

/**
 * Submit bar/palette with no explicit list selection: match scenario → else first typeahead row → else Core AI.
 */
export function submitSearchQuery(
  raw: string,
  ctx: ScenarioExecutionContext,
  suggestions: { scenarioId: string; label: string }[],
  activeIndex: number,
) {
  if (activeIndex >= 0 && activeIndex < suggestions.length) {
    const row = suggestions[activeIndex];
    executeScenario(row.scenarioId, ctx, { promptOverride: row.label });
    return;
  }

  const trimmed = raw.trim();
  if (!trimmed) return;

  const hit = findScenarioForRawQuery(trimmed);
  if (hit) {
    executeScenario(hit, ctx, { promptOverride: trimmed });
    return;
  }

  if (suggestions.length > 0) {
    executeScenario(suggestions[0].scenarioId, ctx, { promptOverride: suggestions[0].label });
    return;
  }

  ctx.openAIModal({ prompt: trimmed, autoSend: true });
}
