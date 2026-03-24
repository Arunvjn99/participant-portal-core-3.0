import * as React from "react";
import { useTranslation } from "react-i18next";
import { Lock, CheckCircle2, Info, Shield, FileText } from "lucide-react";
import Button from "../ui/Button";
import type { PlanOption } from "@/types/enrollment";

/** Plan-specific prompt for Core AI (lightweight). */
export function getPlanAskAiPrompt(planTitle: string): string {
  return `Explain ${planTitle} in simple terms and how it affects taxes in retirement.`;
}

/** Richer prompt for "Ask for detailed explanation" from popover. */
export function getPlanDetailedPrompt(plan: PlanOption): string {
  const id = plan.id.toLowerCase();
  if (id.includes("roth")) {
    return "Explain Roth 401(k) in simple terms. Include tax implications, employer match treatment, and who it's best for.";
  }
  if (id.includes("traditional")) {
    return "Explain Traditional 401(k), how pre-tax contributions reduce taxable income, and how withdrawals are taxed in retirement.";
  }
  return `Explain ${plan.title} in simple terms and how it affects taxes in retirement.`;
}

export interface PlanRailProps {
  plans: PlanOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAskAi?: (plan: PlanOption) => void;
}

/** Horizontal plan rail: selection only; no in-card CTA (CTA lives below grid). */
export function PlanRail({ plans, selectedId, onSelect, onAskAi }: PlanRailProps) {
  return (
    <div className="w-full relative z-10">
      {/* Subtle background element — theme-aware radial (global CSS token) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none plan-selection__page-glow"
        aria-hidden
      />
      <div className="flex flex-col gap-6 relative">
        {plans.map((plan) => (
          <HorizontalTile
            key={plan.id}
            plan={plan}
            isSelected={selectedId === plan.id}
            onSelect={() => onSelect(plan.id)}
            onAskAi={onAskAi}
          />
        ))}
      </div>
    </div>
  );
}

const HorizontalTile: React.FC<{
  plan: PlanOption;
  isSelected: boolean;
  onSelect: () => void;
  onAskAi?: (plan: PlanOption) => void;
}> = ({ plan, isSelected, onSelect, onAskAi }) => {
  const { t } = useTranslation();
  const isEligible = plan.isEligible !== false;
  const isRoth = plan.id.toLowerCase().includes("roth");
  const IconComponent = isRoth ? Shield : FileText;

  const openCoreAi = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAskAi?.(plan);
  };

  return (
    <div
      onClick={isEligible ? onSelect : undefined}
      role="button"
      tabIndex={isEligible ? 0 : -1}
      onKeyDown={(e) => {
        if (isEligible && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`
        relative w-full overflow-hidden transition-all duration-300 ease-out rounded-2xl
        ${!isEligible ? "opacity-60 grayscale-[0.8] cursor-not-allowed" : "cursor-pointer"}
        ${isEligible && isSelected ? "scale-[1.01] z-10 ring-2 ring-[var(--enroll-brand)]/30 shadow-lg" : "z-0 shadow-md"}
        ${isEligible && !isSelected ? "hover:shadow-lg" : ""}
        ${!isEligible ? "" : "bg-gradient-to-br from-[var(--enroll-card-bg)] to-white dark:from-[var(--enroll-card-bg)] dark:to-[var(--enroll-card-bg)]"}
      `}
      style={{
        background: !isEligible ? "var(--enroll-soft-bg)" : undefined,
        border: isEligible && isSelected ? "2px solid var(--enroll-brand)" : "1px solid var(--enroll-card-border)",
      }}
    >
      {/* Decorative icon — top-right, subtle, opacity-70 */}
      {isEligible && (
        <div className="absolute top-4 right-4 opacity-70 pointer-events-none z-0" aria-hidden>
          <IconComponent size={48} className="text-[var(--enroll-brand)]/20" strokeWidth={1.5} />
        </div>
      )}

      {isEligible && isSelected && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.04)" }} aria-hidden />
      )}

      <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-xl md:text-2xl font-bold tracking-tight ${!isEligible ? "text-[var(--color-textSecondary)]" : "text-[var(--color-text)]"}`}>
                {plan.title}
              </h3>
              {isEligible && onAskAi && (
                <button
                  type="button"
                  onClick={openCoreAi}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--enroll-brand)] focus-visible:ring-offset-1 shrink-0"
                  style={{
                    color: "var(--enroll-brand)",
                    background: "rgb(var(--enroll-brand-rgb) / 0.1)",
                    border: "1px solid rgb(var(--enroll-brand-rgb) / 0.25)",
                  }}
                  title={t("enrollment.learnMoreAboutPlan", { planName: plan.title })}
                  aria-label={t("enrollment.learnMoreAboutPlan", { planName: plan.title })}
                >
                  <Info size={14} className="shrink-0" />
                  <span>{t("enrollment.aiInfo")}</span>
                </button>
              )}
            </div>
            <p className="text-sm text-[var(--color-textSecondary)] mt-1">{plan.matchInfo}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {isSelected && (
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0" style={{ background: "var(--enroll-brand)", color: "white" }}>
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </div>
            )}
            {!isSelected && isEligible && (
              <Button
                type="button"
                className="enrollment-plan-card__select-cta whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
              >
                {t("enrollment.selectPlan")}
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-[var(--color-textSecondary)] leading-relaxed">
          {plan.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {plan.benefits.map((value, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wide shadow-sm"
              style={{
                color: "var(--enroll-text-secondary)",
                background: "rgb(var(--enroll-brand-rgb) / 0.08)",
                border: "1px solid rgb(var(--enroll-brand-rgb) / 0.15)",
              }}
            >
              {value}
            </span>
          ))}
        </div>
      </div>

      {!isEligible && (
        <div className="absolute top-6 right-6 text-[var(--color-textSecondary)] z-20" aria-hidden>
          <Lock size={20} />
        </div>
      )}
    </div>
  );
};
