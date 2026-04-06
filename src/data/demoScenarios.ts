/**
 * Demo routing + persona list — canonical scenario payloads live in {@link ./scenarios}.
 */

import { withVersion } from "@/core/version";
import { SCENARIOS, SCENARIO_ID_LIST, type ScenarioId } from "@/data/scenarios";
import { getScenarioFlowStart } from "@/data/scenarioFlows";
import { scenarioToPersonaProfile } from "@/engine/scenarioEngine";
import type { PersonaType } from "@/types/participantPersona";
import type { PersonaProfile } from "@/types/participantPersona";

export type { PersonaType, PersonaProfile };
export type DemoScenarioId = ScenarioId;

export const DEMO_USER_KEY = "demoUser";

export const SCENARIO_LABELS: Record<PersonaType, string> = {
  pre_enrollment: "Pre-Enrollment",
  new_enrollee: "New Enrollee",
  young_accumulator: "Young Accumulator",
  mid_career: "Mid-Career",
  pre_retiree: "Pre-Retiree",
  at_risk: "At Risk",
  loan_active: "Loan Active",
  retired: "Retired",
};

export const DEMO_SCENARIO_IDS = SCENARIO_ID_LIST;

export const DEMO_SCENARIO_TITLES: Record<ScenarioId, string> = {
  sarah: "Sarah — Start saving (explore enrollment)",
  alex: "Alex — Roth 401(k), growing balance",
  john: "John — Mid-career, active transactions",
  mike: "Mike — At risk / low contribution",
  linda: "Linda — Retired, withdrawals focus",
};

export function personaFromScenarioId(id: ScenarioId): PersonaProfile {
  return scenarioToPersonaProfile(SCENARIOS[id]);
}

export function entryPathForPersona(persona: PersonaProfile): string {
  const id = persona.id.replace(/^demo_/, "") as ScenarioId;
  if (id in SCENARIOS) {
    return getScenarioFlowStart(id);
  }
  switch (persona.scenario) {
    case "pre_enrollment":
    case "new_enrollee":
      return "/dashboard/pre-enrollment";
    case "mid_career":
    case "pre_retiree":
    case "loan_active":
      return "/dashboard/post-enrollment";
    case "retired":
    case "young_accumulator":
    case "at_risk":
    default:
      return "/dashboard/post-enrollment";
  }
}

export const personas: PersonaProfile[] = DEMO_SCENARIO_IDS.map(personaFromScenarioId);

export function demoNavigateTarget(version: string, entryRoute: string): string {
  if (entryRoute.startsWith("/dashboard")) return entryRoute;
  return withVersion(version, entryRoute);
}

/** @deprecated Use {@link SCENARIOS} from `@/data/scenarios`. */
export const demoScenarios = SCENARIOS;
