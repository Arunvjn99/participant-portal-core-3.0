import * as React from "react";
import { useTranslation } from "react-i18next";
import { Check, CheckCircle2, Info } from "lucide-react";
import type { PlanOption } from "@/types/enrollment";

export type PlanCardVariant = "single" | "multi";

export interface PlanCardProps {
  plan: PlanOption;
  isSelected: boolean;
  onSelect: () => void;
  variant: PlanCardVariant;
}

/** API-safe fallbacks: plans may come from API with missing or empty fields. */
function usePlanDisplay(plan: PlanOption) {
  return {
    title: plan.title?.trim() || plan.id,
    description: (plan.description ?? "").trim(),
    matchInfo: (plan.matchInfo ?? "").trim(),
    benefits: Array.isArray(plan.benefits) ? plan.benefits.filter(Boolean) : [],
  };
}

/**
 * Premium plan card for Choose Plan page.
 * - Entire card is clickable; clicking calls onSelect.
 * - Selected: primary border, blue highlight background, check icon top right, slight elevation.
 * - Unselected: neutral white, soft border.
 * - Plan Highlight badge only (no Recommended / AI Recommended). Key Advantages from plan data.
 * - Plan Insight section; optional "Why this plan may work for you."
 * - Graceful fallbacks when plan fields are missing (API-driven).
 */
export const PlanCard = ({ plan, isSelected, onSelect, variant }: PlanCardProps) => {
  const { t } = useTranslation();
  const { title, description, matchInfo, benefits } = usePlanDisplay(plan);
  const isEligible = plan.isEligible !== false;

  const handleClick = () => {
    if (isEligible) onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEligible && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={isEligible ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isSelected}
      aria-label={`${title}${isSelected ? ", selected" : ""}`}
      className={`
        relative w-full overflow-hidden rounded-2xl border-2 transition-all duration-300 ease-out
        ${variant === "single" ? "max-w-full" : ""}
        ${!isEligible ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${isSelected
          ? "border-[var(--enroll-brand)] bg-gradient-to-br from-[var(--enroll-card-bg)] to-[rgb(var(--enroll-brand-rgb)/0.06)] shadow-xl"
          : "border-[var(--color-border)] bg-[var(--color-surface)] shadow-md hover:shadow-lg hover:border-[var(--color-border)]"}
      `}
    >
      {/* Top right: Check circle (selected) or Info (default) — same container size to avoid layout shift */}
      <div
        className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors shrink-0"
        style={{
          borderColor: isSelected ? "var(--enroll-brand)" : "var(--enroll-card-border)",
          background: isSelected ? "var(--enroll-brand)" : "var(--enroll-soft-bg)",
        }}
        aria-label={isSelected ? t("enrollment.selectedPlanAria") : t("enrollment.planInsightsAria")}
      >
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
        ) : (
          <Info className="h-4 w-4 text-[var(--color-text-tertiary)]" strokeWidth={2} aria-hidden />
        )}
      </div>

      <div className="p-6">
        {/* Plan name */}
        <h3
          className="text-xl font-bold tracking-tight md:text-2xl"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {title}
        </h3>

        {/* Short description under "Plan Insight" */}
        {description && (
          <div className="mt-4">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--enroll-text-muted)" }}
            >
              {t("enrollment.planInsight")}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
              {description}
            </p>
          </div>
        )}

        {/* Benefit badges (from plan data when available) */}
        {benefits.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {benefits.slice(0, 5).map((benefit, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium"
                style={{
                  background: "rgb(var(--enroll-brand-rgb) / 0.08)",
                  color: "var(--enroll-text-secondary)",
                  border: "1px solid rgb(var(--enroll-brand-rgb) / 0.15)",
                }}
              >
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* Optional: Why this plan may work for you */}
        {matchInfo && (
          <div className="mt-5">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--enroll-text-muted)" }}
            >
              {t("enrollment.whyThisPlanMayWork")}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
              {matchInfo}
            </p>
          </div>
        )}

        {/* Key Advantages list (when no badges shown or in addition) */}
        {benefits.length > 0 && (
          <div className="mt-5">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--enroll-text-muted)" }}
            >
              {t("enrollment.keyAdvantages")}
            </h4>
            <ul className="space-y-1.5">
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--enroll-brand)" }}
                  />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Selected label at bottom */}
        {isSelected && (
          <div
            className="mt-6 flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--enroll-brand)" }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--enroll-brand)] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            {t("enrollment.selectPlan")}
          </div>
        )}
      </div>
    </div>
  );
};
