import type { Scenario } from "@/engine/scenarioEngine";
import { isScenarioFlowPathAllowed } from "@/guards/scenarioFlowGuard";
import { useFeedbackStore } from "@/store/feedbackStore";

/**
 * Intercept in-app navigation during demo mode. Returns `true` if navigation was blocked.
 */
export function blockDemoNavIfNotAllowed(
  scenario: Scenario | null,
  isDemoMode: boolean,
  targetPath: string,
  message: string,
): boolean {
  if (!isDemoMode || !scenario) return false;
  if (isScenarioFlowPathAllowed(targetPath, scenario)) return false;
  useFeedbackStore.getState().showToast(message, "error");
  return true;
}
