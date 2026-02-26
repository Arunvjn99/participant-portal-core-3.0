import { Step } from "./steps";
import { getStepMessageIntent } from "./stepMessages";

/**
 * Returns a system message for the given step.
 * All AI generation goes through /api/core-ai; no frontend LLM calls.
 * This uses the intent as a clear, direct message.
 */
export async function generateSystemMessage(step: Step): Promise<string> {
  const intent = getStepMessageIntent(step);
  return intent;
}
