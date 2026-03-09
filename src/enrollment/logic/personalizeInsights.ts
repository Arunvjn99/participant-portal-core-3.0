/**
 * Insight helpers for the Personalize Plan wizard.
 * Return title/message i18n keys and optional tone for age, location, and savings steps.
 */

export type InsightTone = "positive" | "warning" | "neutral";

export interface AgeInsight {
  titleKey: string;
  messageKey: string;
  tone: InsightTone;
}

export interface LocationInsight {
  titleKey: string;
  messageKey: string;
  tone?: InsightTone;
}

export interface SavingsInsight {
  titleKey: string;
  messageKey: string;
  tone: InsightTone;
}

/** State-like shape from findStateByName (e.g. from US_STATES_DATA). */
export interface StateOption {
  name: string;
  abbreviation?: string;
  costIndex?: "low" | "medium" | "high";
}

const AGE_INSIGHT_KEYS = {
  popular: {
    titleKey: "enrollment.personalizePlan.step1PopularTitle",
    messageKey: "enrollment.personalizePlan.step1PopularSub",
  },
  early: {
    titleKey: "enrollment.personalizePlan.step1PopularTitle",
    messageKey: "enrollment.personalizePlan.step1PopularSub",
  },
  late: {
    titleKey: "enrollment.personalizePlan.step1PopularTitle",
    messageKey: "enrollment.personalizePlan.step1PopularSub",
  },
} as const;

/**
 * Insight for the retirement age step. Uses current age and selected retirement age.
 */
export function getAgeInsight(currentAge: number, retirementAge: number): AgeInsight {
  const yearsToRetire = Math.max(0, retirementAge - currentAge);
  if (retirementAge <= currentAge) {
    return {
      ...AGE_INSIGHT_KEYS.popular,
      tone: "neutral",
    };
  }
  if (retirementAge < 55) {
    return {
      ...AGE_INSIGHT_KEYS.early,
      tone: "warning",
    };
  }
  if (retirementAge > 68) {
    return {
      ...AGE_INSIGHT_KEYS.late,
      tone: "warning",
    };
  }
  return {
    ...AGE_INSIGHT_KEYS.popular,
    tone: "positive",
  };
}

/**
 * Insight for the location step when a state is selected. Returns null if none selected.
 */
export function getLocationInsight(selectedState: StateOption | null): LocationInsight | null {
  if (!selectedState?.name) return null;
  const isHighCost = selectedState.costIndex === "high";
  return {
    titleKey: "enrollment.personalizePlan.step2SmartChoiceTitle",
    messageKey: "enrollment.personalizePlan.step2SmartChoiceFlorida",
    tone: isHighCost ? "warning" : "neutral",
  };
}

/**
 * Insight for the savings step.
 */
export function getSavingsInsight(params: {
  age: number;
  retirementAge: number;
  savings: number;
}): SavingsInsight {
  const { savings } = params;
  if (savings <= 0) {
    return {
      titleKey: "enrollment.personalizePlan.step3GreatStartTitle",
      messageKey: "enrollment.personalizePlan.step3GreatStartGeneric",
      tone: "neutral",
    };
  }
  return {
    titleKey: "enrollment.personalizePlan.step3GreatStartTitle",
    messageKey: "enrollment.personalizePlan.step3GreatStartWithValue",
    tone: "positive",
  };
}
