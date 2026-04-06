import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SCENARIOS, type ScenarioId } from "@/data/scenarios";
import type { Scenario } from "@/engine/scenarioEngine";
import { logActiveScenario, scenarioToPersonaProfile } from "@/engine/scenarioEngine";
import { clearDemoUser, setDemoUser } from "@/hooks/useDemoUser";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "@/enrollment/enrollmentDraftStore";
import { applyScenarioToPostEnrollmentDashboard } from "@/lib/demoPostEnrollmentHydration";

function seedEnrollmentDraftFromScenario(scenario: Scenario): void {
  if (scenario.account.isEnrolled) return;
  const cur = loadEnrollmentDraft() ?? {};
  const ra = scenario.financial.retirementAgeDefault ?? 65;
  saveEnrollmentDraft({
    ...cur,
    currentAge: scenario.user.age,
    retirementAge: ra,
    yearsToRetire: Math.max(1, ra - scenario.user.age),
    investmentComfort: scenario.financial.investmentComfort ?? cur.investmentComfort,
    annualSalary: scenario.financial.annualSalaryForEnrollment ?? cur.annualSalary ?? 45_000,
    retirementLocation: cur.retirementLocation ?? "United States",
  });
}

type ScenarioStoreState = {
  activeScenarioId: ScenarioId | null;
  isDemoMode: boolean;
  scenarioData: Scenario | null;
  setScenario: (id: ScenarioId) => void;
  clearScenario: () => void;
};

export const useScenarioStore = create<ScenarioStoreState>()(
  persist(
    (set) => ({
      activeScenarioId: null,
      isDemoMode: false,
      scenarioData: null,
      setScenario: (id: ScenarioId) => {
        const scenario = SCENARIOS[id];
        if (!scenario) return;
        const persona = scenarioToPersonaProfile(scenario);
        setDemoUser(persona);
        seedEnrollmentDraftFromScenario(scenario);
        applyScenarioToPostEnrollmentDashboard(scenario);
        logActiveScenario(scenario);
        set({ activeScenarioId: id, isDemoMode: true, scenarioData: scenario });
      },
      clearScenario: () => {
        clearDemoUser();
        applyScenarioToPostEnrollmentDashboard(null);
        set({ activeScenarioId: null, isDemoMode: false, scenarioData: null });
      },
    }),
    {
      name: "participant-scenario-session-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        activeScenarioId: s.activeScenarioId,
        isDemoMode: s.isDemoMode,
        scenarioData: s.scenarioData,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.activeScenarioId || !state.isDemoMode) return;
        const id = state.activeScenarioId;
        const scenario = SCENARIOS[id];
        if (!scenario) return;
        const persona = scenarioToPersonaProfile(scenario);
        setDemoUser(persona);
        seedEnrollmentDraftFromScenario(scenario);
        applyScenarioToPostEnrollmentDashboard(scenario);
        logActiveScenario(scenario);
        useScenarioStore.setState({ scenarioData: scenario });
      },
    },
  ),
);

/** Permissions + UI flags for the active scenario (no-op when not in demo mode). */
export function selectScenarioPermissions(s: ScenarioStoreState): Scenario["permissions"] | null {
  return s.scenarioData?.permissions ?? null;
}

export function selectScenarioUi(s: ScenarioStoreState): Scenario["ui"] | null {
  return s.scenarioData?.ui ?? null;
}
