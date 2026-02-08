/**
 * Vesting Info Agent (Deterministic)
 *
 * Goal: turn "What is my vested balance?" into a guided, structured interaction.
 * - Short explanation (no dollar amounts unless explicitly provided via data)
 * - Follow-up question
 * - Supports next actions (schedule / withdrawals impact / back)
 */

export type VestingScheduleType = "cliff" | "graded";

export interface VestingPlanData {
  /** Optional vesting schedule type */
  scheduleType?: VestingScheduleType;
  /** Optional current vesting percentage (0–100) */
  currentVestingPct?: number;
}

export type VestingStep = "START" | "FOLLOWUP";

export interface VestingState {
  step: VestingStep;
  planData?: VestingPlanData;
}

export interface VestingResponse {
  nextState: VestingState;
  message: string;
  isComplete: boolean;
}

export function createInitialVestingState(planData?: VestingPlanData): VestingState {
  return { step: "START", planData };
}

const normalize = (s: string) => s.trim().toLowerCase();

const scheduleLabel = (t?: VestingScheduleType) => {
  if (!t) return null;
  return t === "cliff" ? "cliff vesting" : "graded vesting";
};

export function getVestingResponse(state: VestingState, userInput: string): VestingResponse {
  const input = normalize(userInput);
  const data = state.planData;

  if (state.step === "START") {
    const parts: string[] = [];
    parts.push("Your vested balance is the portion of your retirement account you fully own.");
    parts.push("Your own contributions are always yours.");
    parts.push("Employer contributions may vest over time, depending on your plan.");

    // Optional plan data callout (no dollar amounts)
    if (data?.scheduleType || typeof data?.currentVestingPct === "number") {
      const extras: string[] = [];
      const sLabel = scheduleLabel(data.scheduleType);
      if (sLabel) extras.push(`Your plan uses ${sLabel}.`);
      if (typeof data.currentVestingPct === "number") extras.push(`You’re currently ${data.currentVestingPct}% vested in employer contributions.`);
      if (extras.length) parts.push(extras.join(" "));
    }

    parts.push("Would you like to see your vesting schedule?");

    return {
      nextState: { ...state, step: "FOLLOWUP" },
      message: parts.join(" "),
      isComplete: false,
    };
  }

  // FOLLOWUP: keep it short and route by intent
  if (/(schedule|vesting schedule|see schedule)/i.test(input)) {
    const sLabel = scheduleLabel(data?.scheduleType);
    const pct = typeof data?.currentVestingPct === "number" ? data.currentVestingPct : null;
    const msg = [
      "Here’s how to think about your vesting schedule:",
      sLabel ? `- Type: ${sLabel}` : "- Type: (not available yet)",
      pct !== null ? `- Current vesting: ${pct}%` : "- Current vesting: (not available yet)",
      "Want to understand how vesting affects withdrawals, or go back to enrollment?",
    ].join("\n");
    return { nextState: state, message: msg, isComplete: false };
  }

  if (/(withdraw|withdrawal|cash out|distribution)/i.test(input)) {
    const msg = [
      "Vesting affects how much of the employer portion you keep if you leave the company.",
      "Your own contributions are always yours; unvested employer money may be forfeited if you aren’t fully vested.",
      "Want to see your vesting schedule?",
    ].join(" ");
    return { nextState: state, message: msg, isComplete: false };
  }

  // Default follow-up (keep conversational, not long)
  return {
    nextState: state,
    message:
      "I can help with that. Do you want to see your vesting schedule, or understand how vesting works for your employer plan?",
    isComplete: false,
  };
}

