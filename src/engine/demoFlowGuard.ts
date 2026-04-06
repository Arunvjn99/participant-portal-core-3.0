/**
 * Demo routing helpers — delegates to {@link scenarioFlows} / {@link enforceScenarioFlow}.
 */

import { getRoutingVersion, withVersion } from "@/core/version";
import type { Scenario } from "@/engine/scenarioEngine";
import {
  enforceScenarioFlow,
  isScenarioFlowPathAllowed,
} from "@/guards/scenarioFlowGuard";

export function isDemoScenarioPathAllowed(pathname: string, scenario: Scenario): boolean {
  return isScenarioFlowPathAllowed(pathname, scenario);
}

/** Unversioned redirect target when the current path is outside the scenario flow. */
export function resolveDemoScenarioRedirect(pathname: string, scenario: Scenario): string {
  const r = enforceScenarioFlow(pathname, scenario);
  return typeof r === "string" ? r : "/dashboard/post-enrollment";
}

/**
 * Full navigation target: dashboard routes stay unversioned; other app areas use the current route version.
 */
export function resolveDemoScenarioRedirectResolved(pathname: string, scenario: Scenario): string {
  const to = resolveDemoScenarioRedirect(pathname, scenario);
  if (to.startsWith("/dashboard")) return to;
  return withVersion(getRoutingVersion(pathname), to);
}
