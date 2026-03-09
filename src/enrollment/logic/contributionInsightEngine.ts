/**
 * Rule-based contribution insight engine.
 * Returns title, message, and tone for the AI/insight banner.
 * No hardcoded copy: keys are returned for i18n; optional fallback messages.
 */

export type InsightTone = "warning" | "positive" | "neutral";

export interface ContributionInsight {
  /** i18n key for title */
  titleKey: string;
  /** i18n key for message */
  messageKey: string;
  tone: InsightTone;
}

/**
 * Get contribution insight based on percent, salary, and employer match cap.
 * Rules:
 * - percent < employerMatchCap → "You are leaving employer match on the table." (warning)
 * - percent === employerMatchCap → "You're maximizing your employer match." (positive)
 * - percent > 15 → "Aggressive savings strategy." (neutral/positive)
 * - percent >= 20 → "High-impact retirement acceleration." (positive)
 * Priority: 20+ > match cap exact > above 15 > below match cap.
 */
export function getContributionInsight(
  percent: number,
  _salary: number,
  employerMatchCap: number = 6
): ContributionInsight {
  const p = Math.max(0, percent);

  if (p >= 20) {
    return {
      titleKey: "enrollment.insight.highImpactTitle",
      messageKey: "enrollment.insight.highImpactMessage",
      tone: "positive",
    };
  }

  if (p > 15) {
    return {
      titleKey: "enrollment.insight.aggressiveTitle",
      messageKey: "enrollment.insight.aggressiveMessage",
      tone: "positive",
    };
  }

  if (p > 0 && Math.abs(p - employerMatchCap) < 0.01) {
    return {
      titleKey: "enrollment.insight.maximizingMatchTitle",
      messageKey: "enrollment.insight.maximizingMatchMessage",
      tone: "positive",
    };
  }

  if (p > 0 && p < employerMatchCap) {
    return {
      titleKey: "enrollment.insight.leavingMatchTitle",
      messageKey: "enrollment.insight.leavingMatchMessage",
      tone: "warning",
    };
  }

  return {
    titleKey: "enrollment.insight.defaultTitle",
    messageKey: "enrollment.insight.defaultMessage",
    tone: "neutral",
  };
}
