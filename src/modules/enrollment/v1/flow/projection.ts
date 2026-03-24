import type { RiskLevel } from "../store/useEnrollmentStore";

/**
 * Lightweight mock projection from contribution % and risk level (not financial advice).
 */
export function computeMockRetirementProjection(
  contributionPercent: number,
  risk: RiskLevel | null,
): { estimatedValue: number; monthlyIncome: number } {
  const growth =
    risk === "aggressive"
      ? 1.32
      : risk === "growth"
        ? 1.24
        : risk === "balanced"
          ? 1.18
          : risk === "conservative"
            ? 1.08
            : 1.12;
  const salaryFactor = 1 + contributionPercent / 50;
  const estimatedValue = Math.round(420_000 * salaryFactor * growth);
  const monthlyIncome = Math.round(estimatedValue * 0.0038);
  return { estimatedValue, monthlyIncome };
}
