import { withVersionIfEnrollment } from "@/core/version";
import { findScenarioForRawQuery } from "./executeScenario";
import { getScenarioById } from "./scenarioConfig";

export type SearchResult =
  | { type: "navigation"; route: string }
  | { type: "ai"; prompt: string }
  | { type: "action"; action: string };

/**
 * @deprecated Prefer `submitSearchQuery` / `executeScenario` with `useSearch`.
 * Maps a raw string to a routing result without running side effects (for legacy callers).
 */
export function handleGlobalSearch(query: string, routeVersion: string): SearchResult {
  const raw = query.trim();
  const id = findScenarioForRawQuery(raw);
  if (!id) {
    return { type: "ai", prompt: raw };
  }

  const scenario = getScenarioById(id);
  if (!scenario) {
    return { type: "ai", prompt: raw };
  }

  if (scenario.type === "navigation" && scenario.route) {
    return { type: "navigation", route: withVersionIfEnrollment(routeVersion, scenario.route) };
  }

  if (scenario.type === "action" && scenario.action) {
    return { type: "action", action: scenario.action };
  }

  return { type: "ai", prompt: raw };
}
