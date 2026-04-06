/**
 * @deprecated Import from `@/data/demoScenarios` for new code.
 * Re-exports preserve existing `@/mock/personas` import paths.
 */
export type { PersonaType, PersonaProfile, DemoScenarioId } from "@/data/demoScenarios";
export type { Scenario, ScenarioStage } from "@/engine/scenarioEngine";
export {
  personas,
  SCENARIO_LABELS,
  DEMO_USER_KEY,
  demoScenarios,
  DEMO_SCENARIO_IDS,
  DEMO_SCENARIO_TITLES,
  personaFromScenarioId,
  demoNavigateTarget,
  entryPathForPersona,
} from "@/data/demoScenarios";
