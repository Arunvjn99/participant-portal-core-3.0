/**
 * Plan Enrollment Agent
 *
 * A deterministic, state-driven enrollment flow for Voice Assistant.
 */

export type EnrollmentStep =
  | 'INTENT'
  | 'ELIGIBILITY'
  | 'CURRENT_AGE'
  | 'RETIREMENT_AGE'
  | 'LOCATION'
  | 'PLAN_RECOMMENDATION'
  | 'CONTRIBUTION'
  | 'MONEY_HANDLING'
  | 'MANUAL_RISK'
  | 'MANUAL_FUNDS'
  | 'MANUAL_ALLOCATION'
  | 'REVIEW'
  | 'INELIGIBLE'
  | 'CONFIRMED';

export type ManualRiskLevel = 'conservative' | 'moderate' | 'growth' | 'aggressive';

export type PlanChoice = 'PAY_TAX_LATER' | 'PAY_TAX_NOW';

export type InvestmentStrategy = 'DEFAULT' | 'MANUAL' | 'ADVISOR';

export interface EnrollmentState {
  step: EnrollmentStep;
  isEligible?: boolean;
  currentAge?: number;
  retirementAge?: number;
  yearsToRetirement?: number;
  workCountry?: string;
  recommendedPlanChoice?: PlanChoice;
  selectedPlanChoice?: PlanChoice;
  planType?: '401(k)' | 'Roth 401(k)';
  contributionPercentage?: number;
  investmentStrategy?: InvestmentStrategy;
  manualRiskLevel?: ManualRiskLevel;
  manualSelectedFundIds?: string[];
  manualAllocations?: Record<string, number>;
  collectedData: {
    planType?: string;
    contributionPercentage?: number;
    investmentStrategy?: string;
    manualRiskLevel?: string;
    manualFundNames?: string[];
    manualAllocations?: Record<string, number>;
    currentAge?: number;
    retirementAge?: number;
    yearsToRetirement?: number;
    workCountry?: string;
    recommendedPlanChoice?: PlanChoice;
    selectedPlanChoice?: PlanChoice;
  };
}

export interface EnrollmentResponse {
  nextState: EnrollmentState;
  message: string;
  isComplete: boolean;
}

export function createInitialEnrollmentState(options?: { isEligible?: boolean }): EnrollmentState {
  return {
    step: 'INTENT',
    isEligible: options?.isEligible,
    currentAge: (options as any)?.currentAge,
    collectedData: typeof (options as any)?.currentAge === "number" ? { currentAge: (options as any).currentAge } : {},
  };
}

export function getEnrollmentResponse(
  state: EnrollmentState,
  userInput: string
): EnrollmentResponse {
  const input = userInput.trim().toLowerCase();

  if (state.step === "REVIEW") {
    if (input.includes("change plan") || input.includes("edit plan")) {
      return {
        nextState: { ...state, step: "PLAN_RECOMMENDATION" },
        message: "Choose your plan below.",
        isComplete: false,
      };
    }
    if (input.includes("edit retirement age") || input.includes("change retirement age") || input.includes("edit retire age") || input.includes("edit retirement")) {
      return {
        nextState: { ...state, step: "RETIREMENT_AGE" },
        message: "At what age do you plan to retire?",
        isComplete: false,
      };
    }
    if (input.includes("edit location") || input.includes("change location") || input.includes("edit country") || input.includes("change country")) {
      return {
        nextState: { ...state, step: "LOCATION" },
        message: "Which country do you expect to retire in?",
        isComplete: false,
      };
    }
  }

  switch (state.step) {
    case 'INTENT':
      return handleIntentStep(state, input);
    case 'ELIGIBILITY':
      return handleEligibilityStep(state);
    case 'CURRENT_AGE':
      return handleCurrentAgeStep(state, input);
    case 'RETIREMENT_AGE':
      return handleRetirementAgeStep(state, input);
    case 'LOCATION':
      return handleLocationStep(state, input);
    case 'PLAN_RECOMMENDATION':
      return handlePlanRecommendationStep(state, input);
    case 'CONTRIBUTION':
      return handleContributionStep(state, input);
    case 'MONEY_HANDLING':
      return handleMoneyHandlingStep(state, input);
    case 'MANUAL_RISK':
      return handleManualRiskStep(state, input);
    case 'MANUAL_FUNDS':
      return handleManualFundsStep(state, input);
    case 'MANUAL_ALLOCATION':
      return handleManualAllocationStep(state, input);
    case 'REVIEW':
      return handleReviewStep(state, input);
    case 'INELIGIBLE':
      return {
        nextState: state,
        message: "You cannot enroll in this plan right now. If you think this is a mistake, contact your HR team.",
        isComplete: true,
      };
    case 'CONFIRMED':
      return {
        nextState: state,
        message: "All set. Your enrollment has been submitted.",
        isComplete: true,
      };
    default:
      return {
        nextState: state,
        message: "To get started, say or select: \"I want to enroll.\"",
        isComplete: false,
      };
  }
}

function handleIntentStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const wantsEnroll =
    input.includes("enroll") ||
    input.includes("enrollment") ||
    input.includes("start retirement") ||
    input.includes("start my retirement") ||
    input.includes("start plan") ||
    input.includes("retirement plan") ||
    input.includes("sign up");

  if (!wantsEnroll) {
    return {
      nextState: state,
      message: "To get started, say or select: \"I want to enroll.\"",
      isComplete: false,
    };
  }

  const eligible = state.isEligible ?? true;
  if (!eligible) {
    return {
      nextState: { ...state, step: "INELIGIBLE", isEligible: false },
      message: "I checked your account. You cannot enroll in this plan right now.",
      isComplete: true,
    };
  }

  const currentAge = typeof state.currentAge === "number" ? state.currentAge : 34;

  return {
    nextState: {
      ...state,
      step: "RETIREMENT_AGE",
      isEligible: true,
      currentAge,
      collectedData: { ...state.collectedData, currentAge },
    },
    message:
      "Let's start your enrollment. I'll use your account information to guide you through the available plan options. " +
      "At what age do you plan to retire?",
    isComplete: false,
  };
}

function handleEligibilityStep(state: EnrollmentState): EnrollmentResponse {
  const eligible = state.isEligible ?? true;
  if (!eligible) {
    return {
      nextState: { ...state, step: "INELIGIBLE", isEligible: false },
      message: "I checked your account. You cannot enroll in this plan right now.",
      isComplete: true,
    };
  }
  const currentAge = typeof state.currentAge === "number" ? state.currentAge : 34;
  return {
    nextState: { ...state, step: "RETIREMENT_AGE", isEligible: true, currentAge, collectedData: { ...state.collectedData, currentAge } },
    message:
      "Let's start your enrollment. I'll use your account information to guide you through the available plan options. " +
      "At what age do you plan to retire?",
    isComplete: false,
  };
}

function handleCurrentAgeStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const age = extractNumber(input);
  if (age !== null && age >= 14 && age <= 100) {
    return {
      nextState: {
        ...state,
        step: "RETIREMENT_AGE",
        currentAge: age,
        collectedData: { ...state.collectedData, currentAge: age },
      },
      message: "At what age do you want to stop working?",
      isComplete: false,
    };
  }

  if (age !== null && age < 14) {
    return {
      nextState: state,
      message: "That seems a bit low for retirement enrollment. Please enter your current age.",
      isComplete: false,
    };
  }

  if (age !== null && age > 100) {
    return {
      nextState: state,
      message: "That age looks higher than expected. Please enter your current age.",
      isComplete: false,
    };
  }

  return {
    nextState: state,
    message: "I didn't catch a valid age. Please enter your current age in years.",
    isComplete: false,
  };
}

function handleRetirementAgeStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const currentAge = typeof state.currentAge === "number" ? state.currentAge : 34;
  const retireAge = extractNumber(input);

  if (retireAge !== null && retireAge >= currentAge + 1 && retireAge <= 100) {
    const years = retireAge - currentAge;
    return {
      nextState: {
        ...state,
        step: "LOCATION",
        currentAge,
        retirementAge: retireAge,
        yearsToRetirement: years,
        collectedData: {
          ...state.collectedData,
          currentAge,
          retirementAge: retireAge,
          yearsToRetirement: years,
        },
      },
      message: "Which country do you expect to retire in?",
      isComplete: false,
    };
  }

  if (retireAge !== null && retireAge <= currentAge) {
    return {
      nextState: state,
      message: "That retirement age should be higher than your current age. Please enter the age you plan to retire.",
      isComplete: false,
    };
  }

  if (retireAge !== null && retireAge > 100) {
    return {
      nextState: state,
      message: "That age looks higher than expected. Please enter the age you plan to retire.",
      isComplete: false,
    };
  }

  return {
    nextState: state,
    message: "I didn't catch a valid age. Please enter the age you plan to retire in years.",
    isComplete: false,
  };
}

function handleLocationStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const country = input.trim();
  if (country.length >= 2) {
    const currentAge = state.currentAge ?? 0;
    const years = state.yearsToRetirement ?? 0;
    const recommend: PlanChoice =
      currentAge <= 35 || years >= 25 ? "PAY_TAX_NOW" : "PAY_TAX_LATER";

    const suggestedTitle = recommend === "PAY_TAX_NOW" ? "Pay tax now" : "Pay tax later";

    return {
      nextState: {
        ...state,
        step: "PLAN_RECOMMENDATION",
        workCountry: country,
        recommendedPlanChoice: recommend,
        collectedData: {
          ...state.collectedData,
          workCountry: country,
          recommendedPlanChoice: recommend,
        },
      },
      message:
        "Based on your age, expected retirement timeline, and location, here are the plans available to you. " +
        `I suggest: ${suggestedTitle}. ` +
        "You can choose the other one if you want. " +
        "Which one do you want: Pay tax later, or Pay tax now?",
      isComplete: false,
    };
  }
  return {
    nextState: state,
    message: "Which country do you expect to retire in?",
    isComplete: false,
  };
}

function handlePlanRecommendationStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const recommend = state.recommendedPlanChoice ?? "PAY_TAX_LATER";
  const wantsLater =
    input.includes("pay tax later") || input === "later" || input.includes("later") || input.includes("traditional") || input.includes("401");
  const wantsNow =
    input.includes("pay tax now") || input === "now" || input.includes("now") || input.includes("roth");

  if (!wantsLater && !wantsNow) {
    const suggestedTitle = recommend === "PAY_TAX_NOW" ? "Pay tax now" : "Pay tax later";
    return {
      nextState: state,
      message:
        "Based on your age, expected retirement timeline, and location, here are the plans available to you. " +
        `I suggest: ${suggestedTitle}. ` +
        "You can choose the other one if you want. " +
        "Choose one: Pay tax later, or Pay tax now.",
      isComplete: false,
    };
  }

  const choice: PlanChoice = wantsNow ? "PAY_TAX_NOW" : "PAY_TAX_LATER";
  const planType = choice === "PAY_TAX_NOW" ? "Roth 401(k)" : "401(k)";

  return {
    nextState: {
      ...state,
      step: "CONTRIBUTION",
      selectedPlanChoice: choice,
      planType,
      collectedData: {
        ...state.collectedData,
        selectedPlanChoice: choice,
        planType: choice === "PAY_TAX_NOW" ? "Pay tax now" : "Pay tax later",
      },
    },
    message:
      "How much of your salary do you want to save each month? " +
      "Many people start with 6%. You can change this later.",
    isComplete: false,
  };
}

function handleContributionStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const unsure =
    input.includes("don't know") ||
    input.includes("dont know") ||
    input.includes("not sure") ||
    input.includes("no idea") ||
    input.includes("you pick") ||
    input.includes("whatever");

  const pctFromPercent = (() => {
    const m = input.match(/(\d+(?:\.\d+)?)\s*%/);
    if (!m) return null;
    const v = parseFloat(m[1]);
    return Number.isFinite(v) ? v : null;
  })();

  const pctFromNumber = pctFromPercent === null ? extractNumber(input) : null;
  const pct = unsure ? 6 : pctFromPercent ?? pctFromNumber;

  if (pct !== null && pct >= 1 && pct <= 100) {
    return {
      nextState: {
        ...state,
        step: "MONEY_HANDLING",
        contributionPercentage: pct,
        collectedData: { ...state.collectedData, contributionPercentage: pct },
      },
      message:
        "Got it — I've saved your contribution rate. You can review or change it below. " +
        "How do you want your money handled? Say: Let the system handle it. Or: I want to choose myself. Or: Talk to an advisor later.",
      isComplete: false,
    };
  }

  return {
    nextState: state,
    message:
      "How much of your salary do you want to save each month? " +
      "Many people start with 6%. You can change this later.",
    isComplete: false,
  };
}

function handleMoneyHandlingStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const wantsSystem =
    input.includes("system") ||
    input.includes("handle it") ||
    input.includes("let the system") ||
    input.includes("automatic") ||
    input.includes("default");

  const wantsManual =
    input.includes("choose myself") ||
    input.includes("i want to choose") ||
    input.includes("myself") ||
    input.includes("manual");

  const wantsAdvisor =
    input.includes("advisor") ||
    input.includes("talk to an advisor") ||
    input.includes("advisor later") ||
    input.includes("later");

  if (wantsManual) {
    return {
      nextState: {
        ...state,
        step: "MANUAL_RISK",
        investmentStrategy: "MANUAL",
        collectedData: { ...state.collectedData, investmentStrategy: "MANUAL" },
      },
      message:
        "Okay — I've noted how you want your investments handled. You can adjust this if needed. " +
        "How much ups and downs are you okay with?",
      isComplete: false,
    };
  }

  if (wantsAdvisor) {
    return {
      nextState: {
        ...state,
        step: "REVIEW",
        investmentStrategy: "ADVISOR",
        collectedData: { ...state.collectedData, investmentStrategy: "ADVISOR" },
      },
      message:
        "Okay — I've noted how you want your investments handled. You can adjust this if needed. " +
        "Review your choices below.",
      isComplete: false,
    };
  }

  if (wantsSystem) {
    return {
      nextState: {
        ...state,
        step: "REVIEW",
        investmentStrategy: "DEFAULT",
        collectedData: { ...state.collectedData, investmentStrategy: "DEFAULT" },
      },
      message:
        "Okay — I've noted how you want your investments handled. You can adjust this if needed. " +
        "Review your choices below.",
      isComplete: false,
    };
  }

  return {
    nextState: state,
    message:
      "How do you want your money handled? " +
      "Say: Let the system handle it. " +
      "Or: I want to choose myself. " +
      "Or: Talk to an advisor later.",
    isComplete: false,
  };
}

function handleManualRiskStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const level = (['conservative', 'moderate', 'growth', 'aggressive'] as const).find(
    (l) => input.includes(l)
  );
  if (level) {
    return {
      nextState: {
        ...state,
        step: 'MANUAL_FUNDS',
        manualRiskLevel: level,
        collectedData: { ...state.collectedData, manualRiskLevel: level },
      },
      message: "Okay. Next, pick one fund in each group.",
      isComplete: false,
    };
  }
  return {
    nextState: state,
    message: "How much ups and downs are you okay with?",
    isComplete: false,
  };
}

function handleManualFundsStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const prefix = 'funds:';
  if (input.startsWith(prefix)) {
    const ids = input.slice(prefix.length).split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length >= 1) {
      const allocations: Record<string, number> = {};
      ids.forEach((id, i) => {
        allocations[id] = ids.length === 1 ? 100 : Math.floor(100 / ids.length) + (i < 100 % ids.length ? 1 : 0);
      });
      return {
        nextState: {
          ...state,
          step: 'MANUAL_ALLOCATION',
          manualSelectedFundIds: ids,
          manualAllocations: allocations,
        },
        message: "How do you want to split your money?",
        isComplete: false,
      };
    }
  }
  return {
    nextState: state,
    message: "Pick one fund in each group, then continue.",
    isComplete: false,
  };
}

function handleManualAllocationStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const prefix = 'alloc:';
  if (input.startsWith(prefix) && state.manualSelectedFundIds?.length) {
    const pairs = input.slice(prefix.length).split(',');
    const alloc: Record<string, number> = {};
    let sum = 0;
    for (const p of pairs) {
      const [id, v] = p.split(':');
      if (!id || v === undefined) continue;
      const num = parseFloat(v);
      if (!Number.isFinite(num) || num < 0 || num > 100) continue;
      alloc[id.trim()] = num;
      sum += num;
    }
    const validIds = state.manualSelectedFundIds.every((id) => id in alloc);
    if (validIds && Math.abs(sum - 100) < 0.01) {
      return {
        nextState: {
          ...state,
          step: 'REVIEW',
          manualAllocations: alloc,
          collectedData: {
            ...state.collectedData,
            manualAllocations: alloc,
          },
        },
        message: "Split looks good. Review your choices below.",
        isComplete: false,
      };
    }
    if (validIds) {
      return {
        nextState: state,
        message: "That split doesn't add up yet. Please adjust it and try again.",
        isComplete: false,
      };
    }
  }
  return {
    nextState: state,
    message: "How do you want to split your money?",
    isComplete: false,
  };
}

function handleReviewStep(state: EnrollmentState, input: string): EnrollmentResponse {
  const yes = matchesPattern(input, ["yes", "yep", "ok", "okay", "submit", "confirm"]);
  const no = matchesPattern(input, ["no", "not now", "later"]);
  const edit = matchesPattern(input, ["edit", "change"]);

  if (yes) {
    return {
      nextState: { ...state, step: "CONFIRMED" },
      message: "Done. I submitted your enrollment.",
      isComplete: true,
    };
  }

  if (edit) {
    if (state.investmentStrategy === "MANUAL") {
      return {
        nextState: { ...state, step: "MANUAL_ALLOCATION" },
        message: "Okay. You can change how you split your money.",
        isComplete: false,
      };
    }
    return {
      nextState: { ...state, step: "MONEY_HANDLING" },
      message: "Okay. How do you want your money handled?",
      isComplete: false,
    };
  }

  if (no) {
    return {
      nextState: state,
      message: "Okay. You can change this later. Do you want me to submit this now?",
      isComplete: false,
    };
  }

  const planLabel =
    state.selectedPlanChoice === "PAY_TAX_NOW" ? "Pay tax now" : "Pay tax later";
  const savePct = state.contributionPercentage ?? 6;
  const handling =
    state.investmentStrategy === "MANUAL"
      ? "You choose yourself"
      : state.investmentStrategy === "ADVISOR"
      ? "Talk to an advisor later"
      : "Let the system handle it";

  return {
    nextState: state,
    message:
      `Plan: ${planLabel}. ` +
      `Saving: ${savePct}%. ` +
      `How your money is handled: ${handling}. ` +
      "You can change this later. Do you want me to submit this now?",
    isComplete: false,
  };
}

function extractNumber(input: string): number | null {
  const m = input.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return Number.isFinite(v) ? v : null;
}

function matchesPattern(input: string, patterns: string[]): boolean {
  const s = input.toLowerCase();
  return patterns.some((p) => s.includes(p.toLowerCase()));
}
