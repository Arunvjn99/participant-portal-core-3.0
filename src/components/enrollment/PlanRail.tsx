import * as React from "react";
import { useTranslation } from "react-i18next";
import { Lock, Sparkles, CheckCircle2, Trophy } from "lucide-react";
import type { PlanOption } from "../../types/enrollment";

export interface PlanRailProps {
  plans: PlanOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Horizontal plan rail: eligibility states, best-fit highlight, smooth selection. */
export function PlanRail({ plans, selectedId, onSelect }: PlanRailProps) {
  return (
    <div className="w-full relative z-10">
      <div className="flex flex-col gap-5">
        {plans.map((plan) => (
          <HorizontalTile
            key={plan.id}
            plan={plan}
            isSelected={selectedId === plan.id}
            onSelect={() => onSelect(plan.id)}
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
}> = ({ plan, isSelected, onSelect }) => {
  const { t } = useTranslation();
  const isEligible = plan.isEligible !== false;
  const isRecommended = plan.isRecommended === true;
  const confidenceScore = plan.fitScore ?? 0;

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
        relative w-full overflow-hidden group transition-all duration-300 ease-out
        ${!isEligible ? "opacity-60 grayscale-[0.8] cursor-not-allowed" : "cursor-pointer"}
        ${isEligible && isRecommended
          ? isSelected
            ? "scale-[1.01] z-20"
            : "z-10"
          : isEligible && isSelected
            ? "scale-[1.005] z-10"
            : isEligible
              ? "z-0"
              : ""}
      `}
      style={{
        background: !isEligible ? "var(--enroll-soft-bg)" : "var(--enroll-card-bg)",
        border: isEligible && isRecommended && isSelected
          ? "2px solid var(--enroll-brand)"
          : isEligible && isRecommended
            ? "1px solid rgb(var(--enroll-brand-rgb) / 0.2)"
            : isSelected
              ? "1px solid var(--enroll-card-border)"
              : "1px solid var(--enroll-card-border)",
        borderRadius: "var(--enroll-card-radius)",
        boxShadow: isSelected ? "var(--enroll-elevation-3)" : "var(--enroll-elevation-2)",
      }}
    >
      {/* Best-fit styling */}
      {isRecommended && isEligible && (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-[var(--color-surface)] to-[var(--color-primary)]/3 pointer-events-none transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-60"}`} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-multiply">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid-pattern-rail" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[var(--color-primary)]/20" />
                </pattern>
                <pattern id="dot-pattern-rail" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" className="text-[var(--color-primary)]/15" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-rail)" />
              <rect width="100%" height="100%" fill="url(#dot-pattern-rail)" />
            </svg>
          </div>
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--color-primary)]/10 via-[var(--color-primary)]/5 to-transparent rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-all duration-700 ${isSelected ? "opacity-100 scale-110" : "opacity-50 scale-100"}`} />
          {isSelected && (
            <div className="absolute inset-0 border-2 border-[var(--color-primary)]/20 rounded-2xl animate-pulse pointer-events-none" aria-hidden />
          )}
        </>
      )}

      <div className="relative z-10 p-6 md:p-7 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border w-fit transition-all duration-300
                ${isRecommended && isEligible
                  ? "bg-primary border-primary text-white shadow-primary/30"
                  : !isEligible
                    ? "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-textSecondary)]"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-textSecondary)]"}
              `}
            >
              {isRecommended && isEligible ? <Trophy size={11} className="text-[var(--color-warning)] fill-[var(--color-warning)]" /> : null}
              {isEligible ? t("enrollment.fitLabel", { percent: confidenceScore }) : t("enrollment.locked")}
            </div>
            {isRecommended && isEligible && (
              <span className="text-[11px] font-medium text-[var(--color-primary)]/80 flex items-center gap-1">
                <Sparkles size={10} />
                {t("enrollment.aiRecommendedStrategy")}
              </span>
            )}
          </div>

          <div className={`transition-all duration-300 transform ${isSelected ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0 hidden sm:block"}`}>
            {isSelected && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-text)] text-[var(--color-surface)] text-[10px] font-bold uppercase tracking-wide shadow-md">
                <CheckCircle2 size={12} className="text-[var(--color-success)]" />
                {t("enrollment.selected")}
              </div>
            )}
          </div>

          {!isSelected && isEligible && (
            <button
              type="button"
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border border-[var(--color-border)] text-[var(--color-textSecondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-background)]
                ${isRecommended ? "hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5" : ""}
              `}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {t("enrollment.select")}
            </button>
          )}
        </div>

        <div>
          <div className="mb-2">
            <h3 className={`text-xl md:text-2xl font-bold tracking-tight ${!isEligible ? "text-[var(--color-textSecondary)]" : "text-[var(--color-text)]"}`}>
              {plan.title}
            </h3>
            <p className="text-sm font-medium text-[var(--color-textSecondary)] mt-1 flex items-center gap-2">
              <span className={isRecommended && isEligible ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-textSecondary)]"}>{plan.matchInfo}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" aria-hidden />
              <span className="text-[var(--color-textSecondary)] font-normal">{plan.description.slice(0, 50)}…</span>
            </p>
          </div>
          <p className="text-sm text-[var(--color-textSecondary)] leading-relaxed max-w-2xl">
            {plan.description}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          {plan.benefits.map((value, i) => (
            <div
              key={i}
              className={`
                px-3 py-1.5 rounded-md border text-[10px] font-semibold transition-colors duration-300
                ${isSelected
                  ? isRecommended
                    ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 text-[var(--color-primary)]"
                    : "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text)]"
                  : "bg-[var(--color-background)]/50 border-[var(--color-border)] text-[var(--color-textSecondary)]"}
              `}
            >
              <span className="opacity-70 font-normal mr-1">{t("enrollment.benefitLabel")}</span>
              {value}
            </div>
          ))}
          {isRecommended && isEligible && (
            <div className="px-3 py-1.5 rounded-md border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)] text-[10px] font-semibold flex items-center gap-1">
              {t("enrollment.taxFreeGrowth")}
            </div>
          )}
        </div>
      </div>

      {!isEligible && (
        <div className="absolute top-6 right-6 text-[var(--color-textSecondary)]" aria-hidden>
          <Lock size={20} />
        </div>
      )}
    </div>
  );
};
