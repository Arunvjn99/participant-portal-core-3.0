/**
 * @deprecated Use `useScenarioStore` from `@/store/scenarioStore`.
 * Alias preserved for incremental migration.
 */
export {
  useScenarioStore as useDemoStore,
  useScenarioStore,
  selectScenarioPermissions,
  selectScenarioUi,
} from "./scenarioStore";

export type { ScenarioId } from "@/data/scenarios";
