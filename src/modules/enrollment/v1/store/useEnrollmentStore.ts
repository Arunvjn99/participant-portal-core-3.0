import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ENROLLMENT_STEP_COUNT,
  ENROLLMENT_STEPS,
} from "../flow/steps";

export type SelectedPlanOption = "traditional" | "roth";

/** Matches figma `EnrollmentData.riskLevel` / personalization comfort. */
export type RiskLevel = "conservative" | "balanced" | "growth" | "aggressive";

export type ContributionSources = {
  preTax: number;
  roth: number;
  afterTax: number;
};

export type IncrementCycle = "calendar" | "participant" | "plan";

export type EnrollmentV1Snapshot = {
  currentStep: number;
  selectedPlan: SelectedPlanOption | null;
  /** Deferral % of salary (figma uses 1–25). */
  contribution: number;
  salary: number;
  contributionSources: ContributionSources;
  supportsAfterTax: boolean;
  companyPlans: SelectedPlanOption[];
  autoIncrease: boolean;
  /** True after user completes this step (Skip or Save setup). */
  autoIncreaseStepResolved: boolean;
  /** Per-year step increase (% points), figma slider 0–3. */
  autoIncreaseRate: number;
  /** Cap when auto increases stop (10–15 in figma setup). */
  autoIncreaseMax: number;
  incrementCycle: IncrementCycle;
  riskLevel: RiskLevel | null;
  useRecommendedPortfolio: boolean;
  agreedToTerms: boolean;
  retirementAge: number;
  currentAge: number;
  currentSavings: number;
  retirementProjection: {
    estimatedValue: number;
    monthlyIncome: number;
  };
};

type EnrollmentV1Actions = {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepIndex: number) => void;
  updateField: <K extends keyof EnrollmentV1Snapshot>(
    key: K,
    value: EnrollmentV1Snapshot[K],
  ) => void;
};

const initialSnapshot: EnrollmentV1Snapshot = {
  currentStep: 0,
  selectedPlan: null,
  contribution: 6,
  salary: 85000,
  contributionSources: { preTax: 60, roth: 40, afterTax: 0 },
  supportsAfterTax: true,
  companyPlans: ["traditional", "roth"],
  autoIncrease: false,
  autoIncreaseStepResolved: false,
  autoIncreaseRate: 1,
  autoIncreaseMax: 15,
  incrementCycle: "calendar",
  riskLevel: null,
  useRecommendedPortfolio: true,
  agreedToTerms: false,
  retirementAge: 65,
  currentAge: 30,
  currentSavings: 0,
  retirementProjection: {
    estimatedValue: 0,
    monthlyIncome: 0,
  },
};

export type EnrollmentV1Store = EnrollmentV1Snapshot & EnrollmentV1Actions;

const maxIndex = ENROLLMENT_STEP_COUNT - 1;

export const useEnrollmentStore = create<EnrollmentV1Store>()(
  persist(
    (set, get) => ({
      ...initialSnapshot,

      nextStep: () => {
        const { currentStep } = get();
        set({
          currentStep: Math.min(currentStep + 1, maxIndex),
        });
      },

      prevStep: () => {
        const { currentStep } = get();
        set({
          currentStep: Math.max(currentStep - 1, 0),
        });
      },

      goToStep: (stepIndex: number) => {
        if (stepIndex < 0 || stepIndex > maxIndex) return;
        set({ currentStep: stepIndex });
      },

      updateField: (key, value) => {
        set({ [key]: value } as Partial<EnrollmentV1Snapshot>);
      },
    }),
    {
      name: "enrollment-v1-engine",
      partialize: (s) => ({
        currentStep: s.currentStep,
        selectedPlan: s.selectedPlan,
        contribution: s.contribution,
        salary: s.salary,
        contributionSources: s.contributionSources,
        supportsAfterTax: s.supportsAfterTax,
        companyPlans: s.companyPlans,
        autoIncrease: s.autoIncrease,
        autoIncreaseStepResolved: s.autoIncreaseStepResolved,
        autoIncreaseRate: s.autoIncreaseRate,
        autoIncreaseMax: s.autoIncreaseMax,
        incrementCycle: s.incrementCycle,
        riskLevel: s.riskLevel,
        useRecommendedPortfolio: s.useRecommendedPortfolio,
        agreedToTerms: s.agreedToTerms,
        retirementAge: s.retirementAge,
        currentAge: s.currentAge,
        currentSavings: s.currentSavings,
        retirementProjection: s.retirementProjection,
      }),
    },
  ),
);

export function enrollmentStepIdAt(index: number) {
  return ENROLLMENT_STEPS[index];
}
