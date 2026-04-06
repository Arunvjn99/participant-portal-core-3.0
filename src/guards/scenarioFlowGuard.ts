import type { Scenario } from "@/engine/scenarioEngine";
import { stripRoutingVersionPrefix } from "@/core/version";
import type { ScenarioId } from "@/data/scenarios";
import { scenarioFlows } from "@/data/scenarioFlows";

function normalizePath(pathname: string): string {
  let p = stripRoutingVersionPrefix(pathname);
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

/**
 * `pattern` is either an exact path or `base/*` meaning `base` or any subpath.
 */
export function routeMatchesScenarioPattern(path: string, pattern: string): boolean {
  const p = path;
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2);
    if (p === base) return true;
    return p.startsWith(`${base}/`);
  }
  if (p === pattern) return true;
  return p.startsWith(`${pattern}/`);
}

export function isScenarioFlowPathAllowed(pathname: string, scenario: Scenario): boolean {
  const id = scenario.id as ScenarioId;
  const flow = scenarioFlows[id];
  if (!flow) return true;
  const path = normalizePath(pathname);
  return flow.allowedRoutes.some((pattern) => routeMatchesScenarioPattern(path, pattern));
}

/**
 * @returns `true` if current route is allowed, otherwise the unversioned path to redirect to.
 */
export function enforceScenarioFlow(pathname: string, scenario: Scenario | null): true | string {
  if (!scenario) return true;
  if (isScenarioFlowPathAllowed(pathname, scenario)) return true;
  const id = scenario.id as ScenarioId;
  return scenarioFlows[id]?.redirectIfInvalid ?? "/dashboard/post-enrollment";
}
