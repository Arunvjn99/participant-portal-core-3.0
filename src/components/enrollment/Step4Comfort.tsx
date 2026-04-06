import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Shield, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { OnboardingStepCard, SuggestionCard, WizardGuideInsight } from "./onboarding";

export type InvestmentComfort = "conservative" | "balanced" | "growth" | "aggressive";

const LEVELS: {
  key: InvestmentComfort;
  icon: typeof Shield;
  labelKey: string;
  descKey: string;
  mostCommon?: boolean;
}[] = [
  {
    key: "conservative",
    icon: Shield,
    labelKey: "comfortOptConservativeLabel",
    descKey: "comfortOptConservativeDesc",
  },
  {
    key: "balanced",
    icon: BarChart2,
    labelKey: "comfortOptBalancedLabel",
    descKey: "comfortOptBalancedDesc",
    mostCommon: true,
  },
  {
    key: "growth",
    icon: TrendingUp,
    labelKey: "comfortOptGrowthLabel",
    descKey: "comfortOptGrowthDesc",
  },
  {
    key: "aggressive",
    icon: Zap,
    labelKey: "comfortOptAggressiveLabel",
    descKey: "comfortOptAggressiveDesc",
  },
];

const INSIGHT_KEYS: Record<InvestmentComfort, string> = {
  conservative: "comfortInsightConservative",
  balanced: "comfortInsightBalanced",
  growth: "comfortInsightGrowth",
  aggressive: "comfortInsightAggressive",
};

const RETURNS_KEYS: Record<InvestmentComfort, string> = {
  conservative: "comfortReturnsConservative",
  balanced: "comfortReturnsBalanced",
  growth: "comfortReturnsGrowth",
  aggressive: "comfortReturnsAggressive",
};

export interface Step4ComfortProps {
  value: InvestmentComfort;
  onChange: (v: InvestmentComfort) => void;
}

/**
 * Pre-enrollment wizard Step 4 — risk comfort (guided card + suggestion + insight).
 */
export function Step4Comfort({ value, onChange }: Step4ComfortProps) {
  const { t } = useTranslation();
  const pw = "preEnrollment.personalizeWizard.";

  const insight = useMemo(
    () => ({
      main: t(`${pw}${INSIGHT_KEYS[value]}`),
      returns: t(`${pw}${RETURNS_KEYS[value]}`),
    }),
    [t, value],
  );

  return (
    <>
      <OnboardingStepCard>
        <div>
          <h3 className="premium-wizard__question text-center">{t(`${pw}comfortQuestion`)}</h3>
          <p className="mt-2 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">{t(`${pw}comfortSubtitle`)}</p>
        </div>

        <p className="text-center text-sm text-[var(--color-text-tertiary,var(--color-text-secondary))]">{t(`${pw}comfortIntro`)}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t(`${pw}comfortRadiogroupAria`)}>
          {LEVELS.map((level) => {
            const selected = value === level.key;
            const Icon = level.icon;
            return (
              <motion.button
                key={level.key}
                type="button"
                role="radio"
                aria-checked={selected}
                layout
                onClick={() => onChange(level.key)}
                whileHover={{ scale: selected ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-colors",
                  selected
                    ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
                    : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--color-border))]",
                )}
              >
                {level.mostCommon ? (
                  <span className="absolute -top-2 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    {t(`${pw}comfortMostCommonBadge`)}
                  </span>
                ) : null}
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn("h-5 w-5 shrink-0", selected ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]")}
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-base font-semibold text-[var(--color-text)]">{t(`${pw}${level.labelKey}`)}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-[var(--color-text-secondary)]">{t(`${pw}${level.descKey}`)}</p>
              </motion.button>
            );
          })}
        </div>

        <SuggestionCard
          title={t(`${pw}comfortSuggestTitle`)}
          subtitle={t(`${pw}comfortSuggestSubtitle`)}
          badge={t(`${pw}badgePopular`)}
          actionLabel={t(`${pw}apply`)}
          onAction={() => onChange("balanced")}
          disabled={value === "balanced"}
        />
      </OnboardingStepCard>

      <AnimatePresence mode="wait">
        <WizardGuideInsight key={value}>
          <span className="block font-medium text-[var(--color-text)]">{insight.main}</span>
          <span className="mt-2 block text-xs opacity-90">{insight.returns}</span>
        </WizardGuideInsight>
      </AnimatePresence>
    </>
  );
}
